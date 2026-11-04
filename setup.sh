#!/bin/sh
# 只使用系統已有 Python 及 Node，不下載套件或要求憑證。
set -eu
PROJECT_HOME=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$PROJECT_HOME"
command -v python3 >/dev/null 2>&1 || { echo "請先安裝 Python 3.9+。"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "請先安裝 Node.js 18+。"; exit 1; }
python3 build.py
node verify.cjs
python3 verify_html.py
printf '%s\n' '完成。請用瀏覽器開啟 dist/index.html。'
