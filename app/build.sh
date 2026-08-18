#!/bin/zsh
# Build (and optionally sign + notarize) the standalone Canvas Designer.app.
#
#   ./app/build.sh                 build unsigned
#   ./app/build.sh --sign "Developer ID Application: Name (TEAMID)"
#   ./app/build.sh --sign "..." --notarize "Keychain Profile Name"
#
# The notary profile is a keychain profile created once with
# `xcrun notarytool store-credentials` — no credentials live in this repo.
# Requires Homebrew python3.12. Output: app/dist/Canvas Designer.app
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
APP="$REPO/app"
PY="${PYTHON:-/opt/homebrew/bin/python3.12}"
SIGN_ID=""
NOTARY_PROFILE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --sign) SIGN_ID="$2"; shift 2 ;;
    --notarize) NOTARY_PROFILE="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
if [[ -n "$NOTARY_PROFILE" && -z "$SIGN_ID" ]]; then
  echo "--notarize requires --sign" >&2; exit 2
fi

cd "$APP"

if [[ ! -d .venv ]]; then
  "$PY" -m venv .venv
fi
source .venv/bin/activate
pip install --quiet --upgrade pip pywebview pyinstaller

python3 make_icon.py "$APP/build"

pyinstaller --noconfirm --clean --windowed \
  --name "Canvas Designer" \
  --icon "$APP/build/AppIcon.icns" \
  --paths "$REPO/tools" \
  --add-data "$REPO/tools/designer:designer" \
  --osx-bundle-identifier "com.nickpuckett.canvasdesigner" \
  --distpath "$APP/dist" --workpath "$APP/build/pyinstaller" \
  --specpath "$APP/build" \
  designer_app.py

APP_BUNDLE="$APP/dist/Canvas Designer.app"

if [[ -n "$SIGN_ID" ]]; then
  codesign --deep --force --options runtime --timestamp \
    --entitlements "$APP/entitlements.plist" \
    --sign "$SIGN_ID" "$APP_BUNDLE"
  codesign --verify --strict --verbose=2 "$APP_BUNDLE"
fi

if [[ -n "$NOTARY_PROFILE" ]]; then
  NOTARY_ZIP="$APP/dist/CanvasDesigner-notary.zip"
  ditto -c -k --keepParent "$APP_BUNDLE" "$NOTARY_ZIP"
  xcrun notarytool submit "$NOTARY_ZIP" \
    --keychain-profile "$NOTARY_PROFILE" --wait --timeout 1h
  xcrun stapler staple "$APP_BUNDLE"
  xcrun stapler validate "$APP_BUNDLE"
  spctl --assess --type execute -v "$APP_BUNDLE" || true
  rm -f "$NOTARY_ZIP"
fi

echo "Built: $APP_BUNDLE"
