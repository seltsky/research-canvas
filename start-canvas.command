#!/bin/bash
cd "$(dirname "$0")/src"
echo "Research Canvas 시작 중..."
echo "브라우저에서 http://localhost:8000 접속하세요."
echo "종료하려면 Ctrl+C 누르세요."
sleep 1
open http://localhost:8000
python3 -m http.server 8000
