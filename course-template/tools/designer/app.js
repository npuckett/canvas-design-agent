/* Canvas Designer — block editor over a course repo.
   Depends on catalog.js (window.CATALOG): themes, fonts, elements. */
"use strict";

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const state = {
  course: null,
  file: null,          // { path, frontmatter, body }
  wrapper: null,       // outer container element (clone, no children) or null
  theme: "S01",
  selected: null,      // selected .blk element
  inner: null,         // selected element *inside* the block, or null
  dirty: false,
  undoStack: [],
  lintIssues: [],
  styles: { styles: [], default: null },  // course custom styles (styles.json)
};

const canvas = $("#canvas");

/* ================= API ================= */

async function api(path, opts) {
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}
const postJSON = (path, body) =>
  api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/* ================= theme engine ================= */

const COLOR_ROLES = ["accent", "link", "headings", "text", "muted", "lightBg", "border", "darkBg", "darkText"];

function hexMix(hex, other, f) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(hex), p(other)];
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * f).toString(16).padStart(2, "0")).join("");
}
const tint = (hex, f) => hexMix(hex, "#ffffff", f);
const shade = (hex, f) => hexMix(hex, "#000000", f);

const themeGradient = (t) => t.headerGradient || `linear-gradient(135deg, ${t.colors.accent}, ${shade(t.colors.accent, 0.3)})`;

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function replaceAllCI(html, from, to) {
  return html.replace(new RegExp(esc(from), "gi"), to);
}

/* Build ordered replacement pairs to convert HTML styled with theme `from`
   into theme `to`. Longest matches first so gradients beat their own hexes. */
function themePairs(from, to) {
  const pairs = [];
  pairs.push([themeGradient(from), themeGradient(to)]);
  pairs.push([from.font, to.font]);
  for (const role of COLOR_ROLES) {
    const f = from.colors[role], t = to.colors[role];
    if (f && t) pairs.push([f, t]);
  }
  if (from.id === "S01") {
    // header subtitle tints + gradient tail that only exist as S01 literals
    pairs.push(["#004499", shade(to.colors.accent, 0.3)]);
    pairs.push(["#b3d9ff", tint(to.colors.accent, 0.72)]);
    pairs.push(["#cce5ff", tint(to.colors.accent, 0.72)]);
  }
  const seen = new Set();
  return pairs
    .filter(([f, t]) => {
      const k = f.toLowerCase();
      if (!f || f.toLowerCase() === (t || "").toLowerCase() || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => b[0].length - a[0].length);
}

function applyTheme(html, fromId, toId) {
  if (fromId === toId) return html;
  const from = CATALOG.themes[fromId], to = CATALOG.themes[toId];
  // Colors and fonts are swapped via unique placeholders (two-pass, so a
  // target value that equals another source value is never re-replaced).
  const pairs = themePairs(from, to);
  pairs.forEach(([f], i) => { html = replaceAllCI(html, f, `\u0001${i}\u0001`); });
  pairs.forEach(([, t], i) => { html = html.split(`\u0001${i}\u0001`).join(t); });
  // Border radius token swap inside border-radius declarations only.
  if (from.radius !== to.radius && from.radius !== "0px") {
    html = html.replace(/border-radius:\s*([^;"'}]+)/gi,
      (m, val) => "border-radius: " + val.split(from.radius).join(to.radius));
  }
  return html;
}

function detectTheme(html) {
  if (!html) return "S01";
  let best = "S01", bestScore = 0;
  for (const t of Object.values(CATALOG.themes)) {
    let score = 0;
    const probe = [t.colors.accent, t.colors.lightBg, t.colors.headings, t.font];
    if (t.headerGradient) probe.push(t.headerGradient, t.headerGradient);
    for (const p of probe) {
      if (p) score += (html.match(new RegExp(esc(p), "gi")) || []).length;
    }
    if (score > bestScore) { best = t.id; bestScore = score; }
  }
  return best;
}

/* ================= parsing & serializing ================= */

function parseBody(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  let nodes = [...tpl.content.childNodes].filter(
    (n) => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) && n.nodeType !== Node.COMMENT_NODE
  );
  let wrapper = null;
  if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE &&
      /max-width/.test(nodes[0].getAttribute("style") || "") && nodes[0].children.length) {
    wrapper = nodes[0].cloneNode(false);
    nodes = [...nodes[0].childNodes].filter(
      (n) => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) && n.nodeType !== Node.COMMENT_NODE
    );
  }
  // Wrap loose text/inline nodes so every block is a single element.
  const blocks = nodes.map((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) return n;
    const p = document.createElement("p");
    p.style.cssText = "color: #495057;";
    p.textContent = n.textContent.trim();
    return p;
  });
  return { wrapper, blocks };
}

function serializeBody() {
  const parts = $$(".blk", canvas)
    .map((b) => {
      const clone = b.cloneNode(true);
      // strip editor-only selection classes from nested elements
      $$(".inner-sel, .inner-hover", clone).forEach((el) => {
        el.classList.remove("inner-sel", "inner-hover");
        if (!el.getAttribute("class")) el.removeAttribute("class");
      });
      return clone.innerHTML.trim();
    })
    .filter(Boolean);
  const inner = parts.join("\n\n");
  if (!state.wrapper) return inner;
  const shell = state.wrapper.cloneNode(false);
  shell.innerHTML = "\n@@BODY@@\n";
  return shell.outerHTML.replace("@@BODY@@", inner);
}

/* ================= rendering ================= */

function renderBlocks(blocks) {
  canvas.classList.remove("empty-hint");
  canvas.textContent = "";
  if (state.wrapper) {
    const st = state.wrapper.getAttribute("style") || "";
    canvas.setAttribute("style", st);
  } else {
    canvas.removeAttribute("style");
  }
  for (const node of blocks) canvas.appendChild(makeBlk(node));
  if (!blocks.length) {
    canvas.classList.add("empty-hint");
    canvas.textContent = "Empty — insert an element from the palette on the right.";
  }
  selectBlk(null);
}

function makeBlk(node) {
  const blk = document.createElement("div");
  blk.className = "blk";
  blk.setAttribute("contenteditable", "true");
  blk.appendChild(node);
  blk.addEventListener("focusin", () => { if (state.selected !== blk) selectBlk(blk); });
  blk.addEventListener("click", (e) => {
    selectBlk(blk, /*keepInner*/ true);
    const t = e.target.nodeType === Node.ELEMENT_NODE ? e.target : e.target.parentElement;
    setInner(resolveInner(t, blk));
    e.stopPropagation();
  });
  blk.addEventListener("input", markDirty);
  // drag reorder
  blk.draggable = false;
  blk.addEventListener("dragover", (e) => { e.preventDefault(); blk.classList.add("drop-target"); });
  blk.addEventListener("dragleave", () => blk.classList.remove("drop-target"));
  blk.addEventListener("drop", (e) => {
    e.preventDefault();
    blk.classList.remove("drop-target");
    if (dragSrc && dragSrc !== blk) { pushUndo(); canvas.insertBefore(dragSrc, blk); markDirty(); }
  });
  return blk;
}

let dragSrc = null;

function selectBlk(blk, keepInner) {
  $$(".blk.sel", canvas).forEach((b) => b.classList.remove("sel"));
  state.selected = blk;
  if (!keepInner) setInner(null);
  const tools = $("#blk-tools");
  if (!blk) { setInner(null); tools.hidden = true; return; }
  blk.classList.add("sel");
  tools.hidden = false;
  positionTools();
}

function setInner(el) {
  $$(".inner-sel", canvas).forEach((n) => {
    n.classList.remove("inner-sel");
    if (!n.getAttribute("class")) n.removeAttribute("class");
  });
  state.inner = el && state.selected && state.selected.contains(el) ? el : null;
  if (state.inner) state.inner.classList.add("inner-sel");
  renderCrumb();
}

function renderCrumb() {
  const box = $("#blk-crumb");
  box.textContent = "";
  if (!state.selected) return;
  const path = [];
  let n = state.inner;
  while (n && n !== state.selected) { path.unshift(n); n = n.parentElement; }
  const addSeg = (label, el, isCurrent) => {
    if (box.children.length) {
      const sep = document.createElement("span");
      sep.className = "crumb-sep";
      sep.textContent = "›";
      box.appendChild(sep);
    }
    const b = document.createElement("button");
    b.textContent = label;
    if (isCurrent) b.classList.add("crumb-cur");
    b.addEventListener("click", (e) => { e.stopPropagation(); setInner(el); });
    box.appendChild(b);
  };
  addSeg("block", null, !state.inner);
  path.forEach((el, i) => addSeg(el.tagName.toLowerCase(), el, i === path.length - 1));
}

// hover affordance for nested elements
canvas.addEventListener("mouseover", (e) => {
  $$(".inner-hover", canvas).forEach((n) => {
    n.classList.remove("inner-hover");
    if (!n.getAttribute("class")) n.removeAttribute("class");
  });
  const blk = e.target.closest && e.target.closest(".blk");
  if (!blk || blk !== state.selected) return;
  const t = resolveInner(
    e.target.nodeType === Node.ELEMENT_NODE ? e.target : e.target.parentElement, blk);
  if (t) t.classList.add("inner-hover");
});
canvas.addEventListener("mouseleave", () => {
  $$(".inner-hover", canvas).forEach((n) => {
    n.classList.remove("inner-hover");
    if (!n.getAttribute("class")) n.removeAttribute("class");
  });
});

function positionTools() {
  const blk = state.selected, tools = $("#blk-tools");
  if (!blk || tools.hidden) return;
  const edRect = $("#editor").getBoundingClientRect();
  const r = blk.getBoundingClientRect();
  tools.style.left = Math.max(8, r.left - edRect.left) + "px";
  tools.style.top = Math.max(44, r.top - edRect.top - 34) + "px";
}
$("#canvas-scroll").addEventListener("scroll", positionTools);
window.addEventListener("resize", positionTools);
document.addEventListener("click", (e) => {
  if (!e.target.closest(".blk") && !e.target.closest("#blk-tools") && !e.target.closest("#panel")) selectBlk(null);
});

/* ================= block operations ================= */

function pushUndo() {
  state.undoStack.push(serializeBody());
  if (state.undoStack.length > 50) state.undoStack.shift();
  $("#undo-btn").disabled = false;
}

function undo() {
  const html = state.undoStack.pop();
  if (html === undefined) return;
  const { wrapper, blocks } = parseBody(html);
  state.wrapper = wrapper;
  renderBlocks(blocks);
  markDirty();
  $("#undo-btn").disabled = !state.undoStack.length;
}

$("#blk-tools").addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  const blk = state.selected;
  if (!act || !blk) return;
  const inner = state.inner;
  if (inner) {
    // operate on the nested element within its own parent
    if (act === "up" && inner.previousElementSibling) {
      pushUndo(); inner.parentNode.insertBefore(inner, inner.previousElementSibling); markDirty();
    } else if (act === "down" && inner.nextElementSibling) {
      pushUndo(); inner.parentNode.insertBefore(inner.nextElementSibling, inner); markDirty();
    } else if (act === "dup") {
      pushUndo();
      const copy = inner.cloneNode(true);
      copy.classList.remove("inner-sel");
      if (!copy.getAttribute("class")) copy.removeAttribute("class");
      inner.parentNode.insertBefore(copy, inner.nextSibling);
      setInner(copy); markDirty();
    } else if (act === "del") {
      pushUndo(); const parent = inner.parentElement; inner.remove();
      setInner(parent !== blk ? parent : null); markDirty();
    } else if (act === "html") {
      openHtmlModal(blk, inner);
    }
    positionTools();
    return;
  }
  if (act === "up" && blk.previousElementSibling) {
    pushUndo(); canvas.insertBefore(blk, blk.previousElementSibling); markDirty();
  } else if (act === "down" && blk.nextElementSibling) {
    pushUndo(); canvas.insertBefore(blk.nextElementSibling, blk); markDirty();
  } else if (act === "dup") {
    pushUndo();
    const copy = makeBlk(blk.firstElementChild.cloneNode(true));
    canvas.insertBefore(copy, blk.nextSibling); selectBlk(copy); markDirty();
  } else if (act === "del") {
    pushUndo(); blk.remove(); selectBlk(null); markDirty();
    if (!canvas.children.length) renderBlocks([]);
  } else if (act === "html") {
    openHtmlModal(blk);
  }
  positionTools();
});

function openHtmlModal(blk, inner) {
  const modal = $("#html-modal");
  const target = inner || blk;
  const cleanHtml = (el) => {
    const c = el.cloneNode(true);
    $$(".inner-sel, .inner-hover", c).forEach((n) => {
      n.classList.remove("inner-sel", "inner-hover");
      if (!n.getAttribute("class")) n.removeAttribute("class");
    });
    if (c.classList) {
      c.classList.remove("inner-sel", "inner-hover");
      if (!c.getAttribute("class")) c.removeAttribute("class");
    }
    return inner ? c.outerHTML.trim() : c.innerHTML.trim();
  };
  $("#html-editor").value = cleanHtml(target);
  modal.showModal();
  $("#html-apply").onclick = () => {
    pushUndo();
    const tpl = document.createElement("template");
    tpl.innerHTML = $("#html-editor").value;
    const el = tpl.content.firstElementChild;
    if (el) {
      if (inner) { inner.replaceWith(el); setInner(el); }
      else { blk.textContent = ""; blk.appendChild(el); }
      markDirty();
    }
    modal.close();
  };
  $("#html-cancel").onclick = () => modal.close();
}

// Elements that accept children when a nested element is the insert target.
const CONTAINER_TAGS = new Set(["DIV", "TD", "TH", "LI", "DD", "BLOCKQUOTE", "FIGURE", "DETAILS"]);

// Inline elements are never selection targets — a click on one selects the
// nearest block-level ancestor instead (or the block itself).
const INLINE_TAGS = new Set([
  "SPAN", "STRONG", "EM", "B", "I", "A", "MARK", "ABBR", "KBD", "SAMP",
  "VAR", "SUP", "SUB", "DEL", "INS", "CODE", "SMALL", "U", "S", "BR",
]);

// Parents whose direct children are structurally constrained; inserting a
// foreign element "after" a child climbs out to the structure's edge.
const STRICT_PARENTS = {
  UL: ["LI"], OL: ["LI"], DL: ["DT", "DD"],
  TABLE: ["THEAD", "TBODY", "TFOOT", "TR", "CAPTION", "COLGROUP"],
  THEAD: ["TR"], TBODY: ["TR"], TFOOT: ["TR"], TR: ["TD", "TH"], COLGROUP: ["COL"],
};

function resolveInner(t, blk) {
  while (t && t !== blk && INLINE_TAGS.has(t.tagName)) t = t.parentElement;
  if (!t || t === blk || t === blk.firstElementChild || !blk.contains(t)) return null;
  return t;
}

// A container whose only content is an ALL-CAPS placeholder ("COLUMN 1",
// "CARD CONTENT") gets cleared when real content is inserted into it.
function clearPlaceholder(el) {
  if (el.children.length) return;
  const t = el.textContent.trim();
  if (t && t.length < 40 && /^[A-Z0-9 ,.&_\-]+$/.test(t)) el.textContent = "";
}

function insertElement(html) {
  if (!state.file) return;
  pushUndo();
  const themed = applyTheme(html, "S01", state.theme);
  const tpl = document.createElement("template");
  tpl.innerHTML = themed;
  const els = [...tpl.content.children];
  if (!els.length) return;
  // Nested target: insert inside a selected container, or after the
  // selected nested element within its parent.
  if (state.inner && state.selected && state.selected.contains(state.inner)) {
    const blk = state.selected;
    let target = state.inner;
    if (CONTAINER_TAGS.has(target.tagName)) {
      if (target.tagName === "DETAILS")
        target = [...target.children].find((c) => c.tagName === "DIV") || target;
      clearPlaceholder(target);
      els.forEach((el) => target.appendChild(el));
    } else {
      // climb out of list/table structures the new element can't live in
      while (target.parentElement && target.parentElement !== blk) {
        const allowed = STRICT_PARENTS[target.parentElement.tagName];
        if (allowed && !allowed.includes(els[0].tagName)) target = target.parentElement;
        else break;
      }
      if (target.parentElement === blk || target === blk.firstElementChild) {
        // climbed to the block root — insert as a sibling block instead
        let last = null;
        for (const el of els) {
          const nb = makeBlk(el);
          canvas.insertBefore(nb, blk.nextSibling);
          last = nb;
        }
        selectBlk(last);
        last.scrollIntoView({ behavior: "smooth", block: "center" });
        markDirty();
        return;
      }
      els.forEach((el) => target.parentNode.insertBefore(el, target.nextSibling));
    }
    setInner(els[els.length - 1]);
    els[els.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
    markDirty();
    return;
  }
  if (canvas.classList.contains("empty-hint")) {
    canvas.classList.remove("empty-hint");
    canvas.textContent = "";
    // First block on an empty page gets the standard centered wrapper.
    if (!state.wrapper && state.file.path.startsWith("pages/")) {
      const t = CATALOG.themes[state.theme];
      const w = document.createElement("div");
      w.setAttribute("style", `max-width: 800px; margin: 0 auto; padding: 24px; font-family: ${t.font};`);
      state.wrapper = w;
      canvas.setAttribute("style", w.getAttribute("style"));
    }
  }
  let last = null;
  for (const el of els) {
    const blk = makeBlk(el);
    canvas.insertBefore(blk, state.selected ? state.selected.nextSibling : null);
    last = blk;
  }
  selectBlk(last);
  last.scrollIntoView({ behavior: "smooth", block: "center" });
  markDirty();
}

/* ================= palette ================= */

function renderPalette(filter = "") {
  const box = $("#palette");
  box.textContent = "";
  const q = filter.trim().toLowerCase();
  let currentCat = null;
  for (const el of CATALOG.elements) {
    for (const variant of el.variants) {
      const label = `${el.id} ${el.name} ${variant.name} ${el.category}`.toLowerCase();
      if (q && !label.includes(q)) continue;
      if (el.category !== currentCat) {
        currentCat = el.category;
        const h = document.createElement("div");
        h.className = "pal-cat";
        h.textContent = currentCat;
        box.appendChild(h);
      }
      const item = document.createElement("div");
      item.className = "pal-item";
      const name = document.createElement("div");
      name.className = "pal-name";
      name.innerHTML = `<span class="pal-id">${el.id}</span> ${el.name}` +
        (el.variants.length > 1 ? ` — ${variant.name}` : "");
      const prev = document.createElement("div");
      prev.className = "pal-preview";
      prev.innerHTML = applyTheme(variant.html, "S01", state.theme);
      item.append(name, prev);
      item.title = el.description || "";
      item.addEventListener("click", () => insertElement(variant.html));
      box.appendChild(item);
    }
  }
}
$("#palette-search").addEventListener("input", (e) => renderPalette(e.target.value));

/* ================= lint ================= */

const LINT_RULES = [
  [/<script\b/i, "<script> tags are stripped by Canvas"],
  [/<style\b/i, "<style> blocks are stripped by Canvas"],
  [/<svg\b/i, "SVG elements are completely removed"],
  [/box-shadow/i, "box-shadow is stripped"],
  [/text-shadow/i, "text-shadow is stripped"],
  [/(^|[^-a-z])opacity\s*:/i, "opacity is stripped"],
  [/(^|[^-a-z])transform\s*:/i, "transform is stripped"],
  [/letter-spacing/i, "letter-spacing is stripped"],
  [/word-spacing/i, "word-spacing is stripped"],
  [/<(meter|progress|fieldset|legend)\b/i, "form/meter elements are stripped (use D07 for progress)"],
  [/\bclass=/i, "class attributes may be stripped — use inline styles"],
  [/src=["']data:/i, "data: URIs are blocked — host images on Canvas or GitHub Pages"],
  [/<details[^>]*\sopen[\s>]/i, "the open attribute on <details> is stripped"],
  [/<(html|head|body)\b/i, "output must be a fragment — no <html>/<head>/<body>"],
];

function runLint(html) {
  state.lintIssues = LINT_RULES.filter(([re]) => re.test(html)).map(([, msg]) => msg);
  const btn = $("#lint-btn");
  if (state.lintIssues.length) {
    btn.textContent = `⚠ ${state.lintIssues.length} Canvas issue${state.lintIssues.length > 1 ? "s" : ""}`;
    btn.classList.add("bad");
  } else {
    btn.textContent = "✓ Canvas-safe";
    btn.classList.remove("bad");
  }
}
$("#lint-btn").addEventListener("click", () => {
  runLint(serializeBody());
  showMsg("Canvas safety check", state.lintIssues.length
    ? state.lintIssues.map((s) => "• " + s).join("\n")
    : "No problems found. Everything here survives the Canvas sanitizer.");
});

/* ================= front matter form ================= */

const GRADING_TYPES = ["points", "percent", "letter_grade", "gpa_scale", "pass_fail", "not_graded"];
const SUBMISSION_TYPES = ["online_upload", "online_url", "online_text_entry", "media_recording", "on_paper", "none"];

function fileKind(path) {
  if (path.startsWith("assignments/")) return "assignment";
  if (path === "syllabus.md") return "syllabus";
  return "page";
}

function renderFmForm() {
  const box = $("#fm-form");
  box.classList.remove("dim");
  box.textContent = "";
  if (!state.file) return;
  const fm = state.file.frontmatter;
  const kind = fileKind(state.file.path);

  const addText = (key, label, type = "text") => {
    const l = document.createElement("label");
    l.className = "field";
    l.textContent = label;
    const i = document.createElement("input");
    i.type = type;
    i.value = fm[key] || "";
    i.addEventListener("input", () => {
      if (i.value.trim() === "") delete fm[key]; else fm[key] = i.value.trim();
      if (key === "title") $("#doc-title").textContent = fm.title || state.file.path;
      markDirty();
    });
    l.appendChild(i);
    box.appendChild(l);
  };
  const addCheck = (key, label, dflt) => {
    const l = document.createElement("label");
    l.className = "field check";
    const i = document.createElement("input");
    i.type = "checkbox";
    i.checked = (fm[key] || String(dflt)) === "true";
    i.addEventListener("change", () => {
      if (i.checked === dflt) delete fm[key]; else fm[key] = String(i.checked);
      markDirty();
    });
    l.append(i, document.createTextNode(" " + label));
    box.appendChild(l);
  };
  const addSelect = (key, label, options) => {
    const l = document.createElement("label");
    l.className = "field";
    l.textContent = label;
    const s = document.createElement("select");
    s.append(new Option("(default)", ""));
    options.forEach((o) => s.append(new Option(o, o)));
    s.value = fm[key] || "";
    s.addEventListener("change", () => {
      if (!s.value) delete fm[key]; else fm[key] = s.value;
      markDirty();
    });
    l.appendChild(s);
    box.appendChild(l);
  };

  if (kind === "syllabus") {
    box.innerHTML = '<p class="dim">The syllabus has no settings — Canvas renders its own heading. Edit the body on the canvas.</p>';
    return;
  }
  addText("title", "Title");
  if (kind === "page") {
    addCheck("published", "Published", true);
    addCheck("front_page", "Course home page", false);
  } else {
    addText("points", "Points", "number");
    addText("due", "Due (YYYY-MM-DD or YYYY-MM-DD HH:MM)");
    addText("group", "Assignment group");
    addSelect("grading_type", "Grading type", GRADING_TYPES);
    addSelect("submission_types", "Submission type", SUBMISSION_TYPES);
    addCheck("published", "Published", true);
  }
}

/* ================= course / files ================= */

async function loadCourse() {
  state.course = await api("/api/course");
  $("#course-name").textContent = state.course.course.title || state.course.name;
  $("#course-root").textContent = state.course.root;
  $("#build-btn").disabled = !state.course.canBuild;
  const fill = (listEl, items) => {
    listEl.textContent = "";
    for (const it of items) {
      const li = document.createElement("li");
      li.textContent = it.title;
      li.dataset.path = it.path;
      if (it.points) {
        const m = document.createElement("span");
        m.className = "meta";
        m.textContent = `${it.points} pts`;
        li.appendChild(m);
      }
      li.addEventListener("click", () => openFile(it.path));
      listEl.appendChild(li);
    }
  };
  fill($("#page-list"), state.course.pages);
  fill($("#assignment-list"), state.course.assignments);
  markActiveFile();
}

function markActiveFile() {
  $$("#sidebar .file-list li").forEach((li) =>
    li.classList.toggle("active", state.file && li.dataset.path === state.file.path));
}

async function openFile(path) {
  if (state.dirty && !confirm("Discard unsaved changes?")) return;
  const data = await api("/api/file?path=" + encodeURIComponent(path));
  state.file = data;
  state.undoStack = [];
  state.dirty = false;
  $("#undo-btn").disabled = true;
  $("#save-btn").disabled = true;
  $("#dirty-dot").hidden = true;
  $("#doc-title").textContent = data.frontmatter.title || path;
  $("#doc-title").classList.remove("dim");
  state.theme = data.body.trim()
    ? detectTheme(data.body)
    : (state.styles.default && CATALOG.themes[state.styles.default] ? state.styles.default : "S01");
  $("#theme-select").value = state.theme;
  const { wrapper, blocks } = parseBody(data.body);
  state.wrapper = wrapper;
  renderBlocks(blocks);
  runLint(data.body);
  renderFmForm();
  renderPalette($("#palette-search").value);
  markActiveFile();
}

function markDirty() {
  state.dirty = true;
  $("#save-btn").disabled = false;
  $("#dirty-dot").hidden = false;
}

async function saveFile() {
  if (!state.file) return;
  const body = serializeBody();
  runLint(body);
  await postJSON("/api/save", {
    path: state.file.path,
    frontmatter: state.file.frontmatter,
    body,
  });
  state.file.body = body;
  state.dirty = false;
  $("#save-btn").disabled = true;
  $("#dirty-dot").hidden = true;
  loadCourse(); // titles/points may have changed
}
$("#save-btn").addEventListener("click", () => saveFile().catch((e) => showMsg("Save failed", e.message)));
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); saveFile().catch((er) => showMsg("Save failed", er.message)); }
  if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.target.closest(".blk") && !e.target.closest("dialog")) { e.preventDefault(); undo(); }
  if (e.key === "Escape" && state.inner) { e.preventDefault(); setInner(null); }
});
$("#undo-btn").addEventListener("click", undo);

/* ================= theme switch & course styles ================= */

async function loadStyles() {
  try {
    state.styles = await api("/api/styles");
  } catch { state.styles = { styles: [], default: null }; }
  // Register custom styles as themes so the whole engine (apply/detect/
  // palette previews) treats them exactly like S01–S07.
  for (const s of state.styles.styles) CATALOG.themes[s.id] = s;
  rebuildThemeSelect();
}

function rebuildThemeSelect() {
  const sel = $("#theme-select");
  const cur = sel.value;
  sel.textContent = "";
  const std = document.createElement("optgroup");
  std.label = "Standard themes";
  const custom = document.createElement("optgroup");
  custom.label = "Course styles";
  for (const t of Object.values(CATALOG.themes)) {
    const opt = new Option(t.id.startsWith("c-") ? t.name : `${t.id} ${t.name}`, t.id);
    (t.id.startsWith("c-") ? custom : std).append(opt);
  }
  sel.append(std);
  if (custom.children.length) sel.append(custom);
  sel.value = CATALOG.themes[cur] ? cur : "S01";
}

function switchTheme(to) {
  if (!state.file) { state.theme = to; renderPalette($("#palette-search").value); return; }
  pushUndo();
  const html = applyTheme(serializeBody(), state.theme, to);
  state.theme = to;
  const { wrapper, blocks } = parseBody(html);
  state.wrapper = wrapper;
  renderBlocks(blocks);
  renderPalette($("#palette-search").value);
  markDirty();
}

function initThemeSelect() {
  rebuildThemeSelect();
  $("#theme-select").addEventListener("change", (e) => switchTheme(e.target.value));
}

/* ----- style editor dialog ----- */

const ROLE_LABELS = {
  accent: "Accent", link: "Links", headings: "Headings", text: "Body text",
  muted: "Muted text", lightBg: "Box background", border: "Borders",
  darkBg: "Dark sections", darkText: "Text on dark",
};

function openStyleEditor() {
  const modal = $("#style-modal");
  const base = CATALOG.themes[$("#theme-select").value] || CATALOG.themes.S01;
  const editingCustom = base.id.startsWith("c-");

  // base selector
  const baseSel = $("#st-base");
  baseSel.textContent = "";
  for (const t of Object.values(CATALOG.themes))
    baseSel.append(new Option(t.id.startsWith("c-") ? t.name : `${t.id} ${t.name}`, t.id));
  baseSel.value = base.id;

  // font selector
  const fontSel = $("#st-font");
  fontSel.textContent = "";
  for (const f of Object.values(CATALOG.fonts)) fontSel.append(new Option(`${f.id} ${f.name}`, f.stack));
  fontSel.append(new Option("Custom…", "custom"));

  const fill = (t) => {
    const grid = $("#st-colors");
    grid.textContent = "";
    for (const role of Object.keys(ROLE_LABELS)) {
      const l = document.createElement("label");
      l.className = "field";
      l.textContent = ROLE_LABELS[role];
      const i = document.createElement("input");
      i.type = "color";
      i.value = t.colors[role] || "#888888";
      i.dataset.role = role;
      l.appendChild(i);
      grid.appendChild(l);
    }
    const stacks = Object.values(CATALOG.fonts).map((f) => f.stack);
    if (stacks.includes(t.font)) {
      fontSel.value = t.font;
      $("#st-font-custom-wrap").hidden = true;
    } else {
      fontSel.value = "custom";
      $("#st-font-custom-wrap").hidden = false;
      $("#st-font-custom").value = t.font;
    }
    $("#st-radius").value = ["0px", "4px", "8px", "12px"].includes(t.radius) ? t.radius : "4px";
    const grad = t.headerGradient && t.headerGradient.match(/#[0-9a-f]{6}/gi);
    $("#st-grad-on").checked = !!grad;
    $("#st-grad-a").value = grad ? grad[0] : t.colors.accent;
    $("#st-grad-b").value = grad && grad[1] ? grad[1] : shade(t.colors.accent, 0.3);
    $("#st-grad-colors").toggleAttribute("data-off", !$("#st-grad-on").checked);
  };

  $("#st-name").value = editingCustom ? base.name : "";
  $("#st-default").checked = editingCustom && state.styles.default === base.id;
  $("#st-delete").hidden = !editingCustom;
  fill(base);

  baseSel.onchange = () => fill(CATALOG.themes[baseSel.value]);
  fontSel.onchange = () => { $("#st-font-custom-wrap").hidden = fontSel.value !== "custom"; };
  $("#st-grad-on").onchange = () =>
    $("#st-grad-colors").toggleAttribute("data-off", !$("#st-grad-on").checked);

  modal.showModal();

  $("#st-cancel").onclick = () => modal.close();
  $("#st-delete").onclick = async () => {
    if (!confirm(`Delete the "${base.name}" course style? Pages keep their current colors.`)) return;
    state.styles.styles = state.styles.styles.filter((s) => s.id !== base.id);
    if (state.styles.default === base.id) state.styles.default = null;
    delete CATALOG.themes[base.id];
    await postJSON("/api/styles", state.styles);
    if (state.theme === base.id) state.theme = "S01";
    rebuildThemeSelect();
    modal.close();
  };
  $("#st-save").onclick = async () => {
    const name = $("#st-name").value.trim();
    if (!name) { $("#st-name").focus(); return; }
    const colors = {};
    $$("#st-colors input").forEach((i) => { colors[i.dataset.role] = i.value; });
    const font = fontSel.value === "custom"
      ? ($("#st-font-custom").value.trim() || CATALOG.fonts.F01.stack)
      : fontSel.value;
    const style = {
      id: "c-" + slugify(name),
      name,
      base: baseSel.value.startsWith("c-") ? (CATALOG.themes[baseSel.value].base || "S01") : baseSel.value,
      colors,
      font,
      radius: $("#st-radius").value,
      headerGradient: $("#st-grad-on").checked
        ? `linear-gradient(135deg, ${$("#st-grad-a").value}, ${$("#st-grad-b").value})`
        : null,
    };
    state.styles.styles = state.styles.styles.filter((s) => s.id !== style.id).concat([style]);
    if ($("#st-default").checked) state.styles.default = style.id;
    else if (state.styles.default === style.id) state.styles.default = null;
    CATALOG.themes[style.id] = style;
    try {
      await postJSON("/api/styles", state.styles);
    } catch (e) { showMsg("Could not save style", e.message); return; }
    rebuildThemeSelect();
    $("#theme-select").value = style.id;
    switchTheme(style.id);
    modal.close();
  };
}
$("#style-edit-btn").addEventListener("click", openStyleEditor);

/* ================= build & new-file ================= */

$("#build-btn").addEventListener("click", async () => {
  const btn = $("#build-btn");
  btn.disabled = true;
  btn.textContent = "Building…";
  try {
    const res = await postJSON("/api/build", {});
    showMsg(res.ok ? "Package built" : "Build failed",
      (res.ok ? `Ready to import into Canvas:\n${res.imscc}\n\n` : "") + res.output);
  } catch (e) {
    showMsg("Build failed", e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Build .imscc package";
  }
});

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function newFileDialog(type) {
  const modal = $("#new-modal");
  $("#new-title").textContent = type === "pages" ? "New page" : "New assignment";
  const titleIn = $("#new-doc-title"), slugIn = $("#new-doc-slug");
  titleIn.value = ""; slugIn.value = ""; slugIn.dataset.touched = "";
  titleIn.oninput = () => { if (!slugIn.dataset.touched) slugIn.value = slugify(titleIn.value); };
  slugIn.oninput = () => { slugIn.dataset.touched = "1"; };
  modal.showModal();
  $("#new-create").onclick = async () => {
    try {
      const res = await postJSON("/api/create", { type, slug: slugIn.value, title: titleIn.value.trim() });
      modal.close();
      await loadCourse();
      await openFile(res.path);
    } catch (e) { showMsg("Could not create file", e.message); }
  };
  $("#new-cancel").onclick = () => modal.close();
}
$("#new-page").addEventListener("click", () => newFileDialog("pages"));
$("#new-assignment").addEventListener("click", () => newFileDialog("assignments"));

/* ================= misc ui ================= */

function showMsg(title, body) {
  $("#msg-title").textContent = title;
  $("#msg-body").textContent = body;
  $("#msg-modal").showModal();
}
$("#msg-close").addEventListener("click", () => $("#msg-modal").close());

$$("#panel-tabs button").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$("#panel-tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    $("#tab-insert").hidden = btn.dataset.tab !== "insert";
    $("#tab-settings").hidden = btn.dataset.tab !== "settings";
  }));

window.addEventListener("beforeunload", (e) => { if (state.dirty) e.preventDefault(); });

/* ================= boot ================= */

initThemeSelect();
renderPalette();
loadStyles()
  .then(() => loadCourse())
  .catch((e) => showMsg("Could not load course", e.message));
