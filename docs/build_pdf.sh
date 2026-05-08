#!/usr/bin/env bash
# Gera CP5_Documento_Tecnico.pdf a partir de CP5_Documento_Tecnico.html
# usando Chrome headless. Não requer dependências extras.
set -euo pipefail

cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HTML="$(pwd)/CP5_Documento_Tecnico.html"
PDF="$(pwd)/CP5_Documento_Tecnico.pdf"

if [ ! -f "$HTML" ]; then
  echo "ERRO: $HTML não existe."
  exit 1
fi

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$PDF" \
  --print-to-pdf-no-header \
  --virtual-time-budget=10000 \
  "file://$HTML"

echo "PDF gerado em: $PDF"
