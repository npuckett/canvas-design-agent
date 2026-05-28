# Course Homepage and Schedule Editable Tags

Use the Canvas Design Agent skill. Transform the course homepage and schedule content below into a clear Canvas course page for students.

If you can create files or artifacts, create a downloadable `canvas-fragment.html` source file. If you cannot create a file, show the Canvas source in chat.

Do not show a rendered preview.

Copy and paste this entire file into a chat tool with the skill. The tag lines below are design instructions for the generated Canvas page. Use the tags to decide how each section should be displayed, but do not show the tag names or comment suggestions to students unless a tag is clearly meant to become a student-facing label.

Markdown comments in this file suggest other tags, colors, or elements to try. They are for workshop experimentation and should not appear in the final Canvas page.

**NOTE** All text below was generated for the sake of this workshop. I don't use generated text in my actual courses.

## Global Element Tags

Style Tag: S06 Editorial
<!-- Try also: S01 Clean Modern, S02 Bold Academic, S03 Warm Minimal, S04 High Contrast, S05 Studio Dark, S07 Studio Light -->

Accent Color Tag: #000000
<!-- S06 color ideas: #000000, #333333, #555555, #666666. For contrast experiments, try #b71c1c or #0055aa. -->

Page Container Element: L05 Centered Container
<!-- Try also: L06 for full-width section bands, L04 for sidebar/main grid, or plain flow with no wrapper. -->

Header Element: V05 Gradient Header
<!-- Try also: V02 Color-Coded Header, V06 Dark Theme Section, or no header for a pure S06 editorial title block. -->

Navigation Element: N01 Anchor Link Table of Contents
<!-- Try also: no navigation, N02 button links, or a compact text list. -->

Course Info Element: C04 Definition List
<!-- Try also: L03 Flexbox Row, C03 Info Card, C05 Styled Definition List with Border Accent. -->

Course Image Element: E03 Linked Image
<!-- Try also: E01 GitHub-Hosted Image if you want a plain image with caption and no link. -->

Welcome Element: T06 Styled Blockquote
<!-- Try also: V01 Left-Border Accent Box, C03 Info Card, or plain paragraphs with T01 headings. -->

This Week Element: V03 Alert / Callout Box
<!-- Try also: V01 Left-Border Accent Box, C03 Info Card, or C07 Checklist. -->

Learning Goals Element: C07 Checklist
<!-- Try also: C06 Ordered List Variants, C09 Basic Unordered List, or C03 Info Card. -->

Learning Units Element: C01 Collapsible Section
<!-- Try also: L03 Flexbox Row with C03 cards, C02 Nested Collapsibles, or C06 Ordered List Variants. -->

Key Dates Element: D05 Schedule Grid
<!-- Try also: D01 Data Table, C03 Info Cards, V01 Left-Border Accent Boxes, or C06 Ordered List Variants. -->

Weekly Schedule Element: C01 Collapsible Section
<!-- Try also: D05 Schedule Grid, C03 Info Cards, C06 Ordered List Variants, or compact text list. -->

Project Element: C03 Info Card
<!-- Try also: V01 Left-Border Accent Box, C01 Collapsible Section, D01 Data Table, or L03 card row. -->

Project Badge Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, plain bold labels, or no badges. -->

Grading Element: D07 Div-Based Progress Bar
<!-- Try also: D01 Data Table, C03 Info Card, C06 Ordered List Variants, or V04 percentage badges. -->

Instructor Note Element: V01 Left-Border Accent Box
<!-- Try also: T06 Styled Blockquote, V03 Alert / Callout Box, or plain paragraph. -->

Resources Container Element: C01 Collapsible Section
<!-- Try also: C03 Info Card, V01 Left-Border Accent Box, or no container. -->

Resources Link Element: N02 Button-Styled Links
<!-- Try also: N01 Anchor Link Table of Contents or simple text links. -->

## How To Experiment

- Change one element ID at a time, then paste the whole file into a chat tool with the skill.
- Leave the course text alone at first so you can see how a tag changes the layout.
- Use the comments as a menu of ideas, not as required content.
- If an element produces an unclear result, try a more literal element ID such as `C09`, `C03`, `V01`, or `D01`.

## Page Goals

Section Handling Tag: generation-instructions
<!-- These goals should guide the output. Do not render this section as student-facing course content unless the user asks for a process note. -->

- Make the page feel like a practical course homepage, not a syllabus wall
- Keep this week's work and the major deadlines easy to find near the top
- Make quick links obvious and easy to scan
- Present the weekly schedule in a simple format that faculty can edit by hand
- Keep projects, due dates, and grading visible without hiding important information
- Put optional resources after the required course information

## Accessibility

Section Handling Tag: generation-instructions
<!-- Accessibility instructions should guide the generated HTML. Do not show this section as course content. -->

- Use one clear h1 and logical heading order
- Use descriptive link text
- Keep body text readable on narrow screens
- Do not rely on color alone to identify due dates, project milestones, or presentation days
- Keep all graded deadlines visible
- Use readable contrast throughout

## Course Info

Section Element: C04 Definition List
<!-- Try also: L03 Flexbox Row, C03 Info Card, C05 Styled Definition List with Border Accent. -->

Field Element: C04 Definition List
<!-- Try also: C05 for border-accent definitions or L03 for card-style fields. -->

Header Metadata Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, plain text metadata, or no badge. -->

Header Accent Element: T07 Styled Horizontal Rule
<!-- Try also: V01 Left-Border Accent Box, V05 Gradient Header, or no accent. -->

Course Code: CART 398
Course Title: Designing AI Agents: They Are Fun! and They Might Eat Us
Course Subtitle: A studio seminar on theory, tools, and experimental interactions for small screens
Term: Fall 2026
Meeting Time: Tuesdays, 1:00-3:45 PM
Room: EV 7.735 Studio Lab
Instructor: Oh Cadyu

## Course Image

Section Element: E03 Linked Image
Image URL: https://dn721207.ca.archive.org/0/items/AILS_AC96-0191-4/AC96-0191-4.jpg
Image Placement: Immediately below the course title/header, before navigation, course info cards, or welcome text.
Image Crop: Display as a slightly cropped landscape image near the top of the page.
Crop Style: width: 100%; max-width: 100%; height: 520px; object-fit: cover; object-position: center 42%; display: block;
Alt Text: Dr Ross and Rei Cheng wearing 3D glasses while maneuvering a reconstructed skull and tissue model for facial reconstructive surgery.
Caption: Virtual Environment for facial reconstructive surgery, 1996. Public Domain. Internet Archive item AILS_AC96-0191-4.

## Welcome Message

Section Element: T06 Styled Blockquote
<!-- Try also: V01 Left-Border Accent Box, C03 Info Card, or plain paragraphs. -->

Tone Tag: lightly-playful
<!-- Try also: formal-academic, studio-friendly, concise-direct, speculative -->

Layout Element: L05 Centered Container
<!-- Try also: L07 Float Wrap, L06 Full-Width Section, or plain flow. -->

Welcome to Designing AI Agents: They Are Fun! and They Might Eat Us. In this course, we will treat AI agents as strange little collaborators: sometimes helpful, sometimes overconfident, and always worth questioning carefully before handing them the keys to anything important.

This is a studio seminar about making, reading, and testing. We will read early AI theory, look closely at contemporary tools and open-source projects, and use agent-based coding workflows to build experimental interactions for phones. Your phone already knows how to steal your time and data. This course asks a better question: what else could it become if you used AI tools to design interactions that are playful, critical, useful, or delightfully unnecessary?

No one is expected to arrive as an expert programmer or AI researcher. You are expected to document your process, ask sharper questions over time, test your work with other people, and stay alert to the difference between an impressive demo and a thoughtful interaction.

## This Week

Section Element: V03 Alert / Callout Box
<!-- Try also: V01 Left-Border Accent Box, C03 Info Card, or C07 Checklist. -->

Priority Tag: high
<!-- Try also: normal, urgent, informational -->

Show Labels Tag: true
<!-- Try also: false for a more prose-like summary -->

Accent Color Tag: #000000
<!-- Try also: #333333, #555555, #0055aa. Keep strong contrast. -->

Week: 1
Date: Sep 8, 2026
Focus: What is an agent, and why do designers keep giving software jobs it may not deserve?
Reading: Alan Turing, "Computing Machinery and Intelligence" (1950), excerpts
In Class: Course introduction, agent vocabulary, first small-group scenario exercise, and project notebook setup
Due: Set up your documentation space and bring one example of an AI interaction you find either promising, confusing, or suspicious

## Learning Goals

Section Element: C07 Checklist
<!-- Try also: C06 Ordered List Variants, C09 Basic Unordered List, or C03 Info Card. -->

Goal Group Tag: outcomes
<!-- Try also: skills, concepts, process, critique-language -->

Marker Element: C07 Checklist
<!-- Try also: C06 numbered markers, C09 bullets, or V04 small label badges. -->

- Describe major ideas from early AI history and connect them to current design questions
- Research contemporary AI tools and creative projects with attention to openness, shareability, and public documentation
- Use AI coding tools to prototype interactive systems while keeping human judgment in the loop
- Design and test experimental phone interactions that respond to real user behavior
- Document process clearly enough that another person can understand what changed, what failed, and what you learned
- Present speculative, technical, and ethical design decisions in concise critique language

## Learning Units

Section Element: C01 Collapsible Section
<!-- Try also: L03 Flexbox Row with C03 cards, C02 Nested Collapsibles, or C06 Ordered List Variants. -->

Unit Accent Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, V01 Left-Border Accent Box, or plain bold week ranges. -->

### Unit 1: Foundations and Futures

Unit Type Tag: foundations
<!-- Try also: history, theory, speculative, workshop -->

Unit Element: C01 Collapsible Section
<!-- Try also: C03 Info Card, V01 Left-Border Accent Box, or plain section. -->

Weeks: 1-2
Description: We begin with early AI dreams, cybernetic feedback, and a short speculative workshop about what could happen next year.

### Unit 2: Contemporary Tools and Impossible Things

Unit Type Tag: research
<!-- Try also: tools, examples, survey, field-scan -->

Unit Element: C01 Collapsible Section

Weeks: 3-4
Description: We study recent art, design, and technical projects that use AI tools in ways that would have seemed unlikely a year ago, with special attention to open-source and shareable work.

### Unit 3: Phone Experiments and Agent-Based Coding

Unit Type Tag: prototype
<!-- Try also: studio, coding, interaction, main-project -->

Unit Element: C01 Collapsible Section

Weeks: 5-9
Description: We use AI coding tools to design and prototype experimental interactions for phones, then test version 1 with classmates.

### Unit 4: Testing, Revision, and Presentation

Unit Type Tag: final
<!-- Try also: critique, testing, presentation, reflection -->

Unit Element: C01 Collapsible Section

Weeks: 10-12
Description: We revise from feedback, run a second test session, and prepare final presentations that explain both the interaction and the process behind it.

## Key Dates

Section Element: D05 Schedule Grid
<!-- Try also: D01 Data Table, C03 Info Cards, V01 Left-Border Accent Boxes, or C06 Ordered List Variants. -->

Deadline Emphasis Element: V04 Status Badge
<!-- Try also: V01 left border, T02 highlighted text, or plain bold labels. -->

Date Label Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, muted text, or date-first row in D05. -->

### Key Date 1

Event Type Tag: deadline
<!-- Try also: checkpoint, workshop, presentation, test-session -->

Assessment Tag: graded
<!-- Try also: ungraded, formative, participation -->

Date: Sep 15, 2026
Title: Workshop 1 due
Details: AI History and Future drawing plus 200-word response

### Key Date 2

Event Type Tag: deadline
Assessment Tag: graded
Date: Sep 29, 2026
Title: Workshop 2 due
Details: Contemporary tools research blog post with images

### Key Date 3

Event Type Tag: test-session
Assessment Tag: graded
Date: Oct 20, 2026
Title: Test Session 1
Details: First user test of main project prototype

### Key Date 4

Event Type Tag: presentation
Assessment Tag: graded
Date: Nov 3, 2026
Title: Version 1 Presentation
Details: Short presentation of main project direction and prototype

### Key Date 5

Event Type Tag: test-session
Assessment Tag: graded
Date: Nov 17, 2026
Title: Test Session 2
Details: Revised prototype test with documentation

### Key Date 6

Event Type Tag: presentation
Assessment Tag: graded
Date: Nov 24, 2026
Title: Final Presentation
Details: Final project presentation and process archive

## Weekly Schedule

Section Element: C01 Collapsible Section
<!-- Try also: D05 Schedule Grid, C03 Info Cards, C06 Ordered List Variants, or compact text list. -->

Schedule Density Tag: compact
<!-- Try also: roomy, very-compact, expanded -->

Show Week Type Tags: true
<!-- Try also: false if the layout feels too busy -->

Week Accent Element: V04 Status Badge
<!-- Try also: V01 Left-Border Accent Box, T02 Highlighted Text, or no accent. -->

### Week 1 -- Sep 8, 2026: What is an agent?

Week Type Tag: seminar
<!-- Try also: lecture, discussion, studio, workshop -->

Milestone Tag: none
<!-- Try also: workshop-1, workshop-2, test-session, presentation, final -->

- In class: Course introduction, agent vocabulary, examples of helpful and unhelpful automation, documentation setup
- Reading / research: Alan Turing, "Computing Machinery and Intelligence" (1950), excerpts
- Due: Set up documentation space; bring one AI interaction example

### Week 2 -- Sep 15, 2026: AI history and near futures

Week Type Tag: workshop
Milestone Tag: workshop-1

- In class: Discussion of early AI claims, speculative futures exercise, paper drawing workshop
- Reading / research: Norbert Wiener, Cybernetics (1948), excerpts; Joseph Weizenbaum, "ELIZA" (1966), excerpts
- Due: Workshop 1 due -- drawing on paper plus 200 words

### Week 3 -- Sep 22, 2026: Augmentation, conversation, and control

Week Type Tag: demo
Milestone Tag: research-prep

- In class: Demo day: agent workflows in coding tools; small experiments with prompts, constraints, and review
- Reading / research: J. C. R. Licklider, "Man-Computer Symbiosis" (1960); Douglas Engelbart, "Augmenting Human Intellect" (1962), excerpts
- Due: Research log -- three contemporary projects to investigate

### Week 4 -- Sep 29, 2026: Contemporary tools research

Week Type Tag: research-workshop
Milestone Tag: workshop-2

- In class: Share research examples, discuss open-source practice, compare impossible-seeming projects from the last 12 months
- Reading / research: Student-selected examples from art, design, and technical projects; prioritize open-source repositories and public process notes
- Due: Workshop 2 due -- 500-word blog post with 2-3 illustrated examples

### Week 5 -- Oct 6, 2026: Phones as sites for interaction

Week Type Tag: project-launch
Milestone Tag: main-project-start

- In class: Main project launch, phone affordance mapping, interaction sketches, scope check
- Reading / research: Lucy Suchman, Plans and Situated Actions (1987), excerpts; mobile interaction case studies
- Due: Main project concept sketch and interaction statement

### Week 6 -- Oct 13, 2026: Agent-assisted prototyping

Week Type Tag: studio
Milestone Tag: prototype-plan

- In class: Studio build session, AI coding tool workflow demo, critique of generated code and interface decisions
- Reading / research: Don Norman, The Design of Everyday Things (2013), feedback and affordance excerpts
- Due: Prototype plan, feature list, and first technical test

### Week 7 -- Oct 20, 2026: Testing version 0.5

Week Type Tag: test-session
Milestone Tag: test-session-1

- In class: Test Session 1, observation notes, feedback synthesis, revision planning
- Reading / research: Read two classmates' documentation pages before class
- Due: Test Session 1 due -- working prototype test and notes

### Week 8 -- Oct 27, 2026: Interaction, behavior, and trust

Week Type Tag: studio
Milestone Tag: version-1-prep

- In class: Studio development, microinteraction critique, privacy and consent discussion for phone-based systems
- Reading / research: Donna Haraway, "A Cyborg Manifesto" (1985), excerpts; contemporary AI ethics short reading
- Due: Revised prototype and test plan for version 1

### Week 9 -- Nov 3, 2026: Version 1 presentations

Week Type Tag: presentation
Milestone Tag: version-1-presentation

- In class: Version 1 presentation day, peer questions, next-step planning
- Reading / research: Review presentation checklist and critique prompts
- Due: Version 1 Presentation due

### Week 10 -- Nov 10, 2026: Revision from evidence

Week Type Tag: studio
Milestone Tag: revision

- In class: Studio build sprint, debugging clinic, documentation review, accessibility pass
- Reading / research: N. Katherine Hayles, How We Became Posthuman (1999), excerpts; accessibility testing resource
- Due: Revision plan and documented change log

### Week 11 -- Nov 17, 2026: Second testing session

Week Type Tag: test-session
Milestone Tag: test-session-2

- In class: Test Session 2, structured feedback, final presentation storyboarding
- Reading / research: Student-selected reference connected to final project topic
- Due: Test Session 2 due -- revised prototype test and documentation

### Week 12 -- Nov 24, 2026: Final presentations

Week Type Tag: presentation
Milestone Tag: final-presentation

- In class: Final presentations, process archive review, course reflection
- Reading / research: No new reading; finalize documentation and prepare presentation
- Due: Final Presentation due -- prototype, process archive, and reflection

## Projects and Deliverables

Section Element: C03 Info Card
<!-- Try also: V01 Left-Border Accent Box, C01 Collapsible Section, D01 Data Table, or L03 card row. -->

Metadata Element: C04 Definition List
<!-- Try also: V04 Status Badge row, D01 Data Table, or plain label-value list. -->

Assessment Emphasis Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, V01 Left-Border Accent Box, or no emphasis. -->

### Workshop 1: AI History and Future

Project Type Tag: short-workshop
<!-- Try also: history-workshop, speculative-workshop, paper-response -->

Assessment Tag: graded
Due: Sep 15, 2026
Weight: 10%
Output: Drawing on paper plus 200 words

Read important papers from very early AI and cybernetics, then propose one possible outcome that could happen in the next year. Your drawing should make the idea visible without needing to look polished. Your written response should explain the future you are proposing, what historical idea it connects to, and who might benefit or be harmed if it actually happened.

### Workshop 2: Contemporary Tools Research

Project Type Tag: research-workshop
<!-- Try also: field-scan, tool-research, contemporary-examples -->

Assessment Tag: graded
Due: Sep 29, 2026
Weight: 10%
Output: Blog post of approximately 500 words with images showing 2-3 examples

Research art, design, and technical projects that have happened within the last 12 months. Find examples of things you thought were impossible that people are now making. Emphasize work that is open-source, well documented, forkable, remixable, or otherwise shareable. Your post should describe what each project does, why it surprised you, and what design question it opens for your own work.

### Main Project: Experimental Phone Interactions

Project Type Tag: main-project
<!-- Try also: capstone-project, studio-project, prototype-project -->

Assessment Tag: graded-sequence
Due: Developed across Weeks 5-12
Weight: Test Session 1 15%, Version 1 Presentation 25%, Test Session 2 15%, Final Presentation 25%
Output: Interactive phone prototype, testing documentation, process archive, and final presentation

Use AI coding tools to create an experimental new interaction for phones. The project can be useful, poetic, inconvenient in an interesting way, or built around a highly specific behavior. The phone should not only display content; it should respond to touch, movement, time, location, sound, camera input, notifications, or another interaction pattern you can test with people.

Your prototype does not need to become a polished app store product. It does need to be testable, documented, and specific enough that someone can understand what kind of relationship it proposes between a person, a phone, and an AI-assisted design process.

### Test Sessions and Presentations

Section Element: C06 Ordered List Variants
<!-- Try also: C03 Info Card, C01 Collapsible Section, or C07 Checklist. -->

Milestone Label Element: V04 Status Badge
<!-- Try also: T02 Highlighted Text, V01 Left-Border Accent Box, or plain bold labels. -->

Test Session 1, Week 7: Bring a working prototype or focused interaction test. Observe what users actually do, not only what you hoped they would do.

Version 1 Presentation, Week 9: Present your concept, prototype, early tests, and next-step plan. Show what changed because of feedback.

Test Session 2, Week 11: Test a revised version with clearer goals. Document what improved, what broke, and what still feels uncertain.

Final Presentation, Week 12: Present the final prototype, the process archive, and a concise reflection on how AI coding tools shaped the project.

## Grading Overview

Section Element: D07 Div-Based Progress Bar
<!-- Try also: D01 Data Table, C03 Info Card, C06 Ordered List Variants, or V04 percentage badges. -->

Sort Tag: course-order
<!-- Try also: highest-weight-first, chronological, grouped-by-project -->

Total Weight Tag: show-100-percent
<!-- Try also: hide-total, show-total-callout -->

Assessment Type Tag: workshop
- Workshop 1: 10%

Assessment Type Tag: workshop
- Workshop 2: 10%

Assessment Type Tag: testing
- Test Session 1: 15%

Assessment Type Tag: testing
- Test Session 2: 15%

Assessment Type Tag: presentation
- Version 1 Presentation: 25%

Assessment Type Tag: presentation
- Final Presentation: 25%

## Workshop Norms

Section Element: C07 Checklist
<!-- Try also: C09 Basic Unordered List, C06 Ordered List Variants, C03 Info Card, or V01 left-border list. -->

Tone Tag: direct-supportive
<!-- Try also: formal, playful, policy-like, critique-focused -->

- Document prompts, code changes, design decisions, and tests as part of the work, not as an afterthought
- Treat AI-generated output as material to inspect, revise, and take responsibility for
- Share sources, references, and tool choices clearly enough that classmates can learn from them
- Make prototypes testable early, even when they are awkward
- Give critique that names what is happening, what it makes possible, and what question should be tested next
- Avoid collecting sensitive data from classmates unless the class has discussed and approved a safe testing plan

## Instructor Note

Section Element: V01 Left-Border Accent Box
<!-- Try also: T06 Styled Blockquote, V03 Alert / Callout Box, C03 Info Card, or plain paragraph. -->

Accent Color Tag: #333333
<!-- Try also: #000000, #555555, #666666 -->

This course rewards careful experiments more than flawless demos. If your prototype fails in a way that teaches you something specific, document it. If an AI tool gives you code that works but you cannot explain, slow down and investigate. The goal is not to prove that agents are magical. The goal is to learn how to design with them without surrendering your judgment at the door.

## Optional Resources

Section Element: C01 Collapsible Section
<!-- Try also: C03 Info Card, V01 Left-Border Accent Box, or no container. -->

Resource Visibility Tag: optional-collapsed
<!-- Try also: optional-open, always-visible, compact-footer -->

Link Element: N02 Button-Styled Links
<!-- Try also: N01 Anchor Link Table of Contents or simple text links. -->

- AI history reading archive: [link]
- Open-source AI coding tools list: [link]
- Mobile prototyping references: [link]
- Documentation template: [link]
- Accessibility contrast checker: [link]
- Consent and user testing guide: [link]
- Example process blogs from past studio courses: [link]