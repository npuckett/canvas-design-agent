#!/bin/zsh
# Build (and optionally sign) the standalone Canvas Designer.app.
#
#   ./app/build.sh                 build unsigned
#   ./app/build.sh --sign "Developer ID Application: Name (TEAMID)"
#
# Requires Homebrew python3.12. Output: app/dist/Canvas Designer.app
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
APP="$REPO/app"
PY="${PYTHON:-/opt/homebrew/bin/python3.12}"
SIGN_ID=""
if [[ "${1:-}" == "--sign" ]]; then
  SIGN_ID="$2"
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

echo "Built: $APP_BUNDLE"
