---
id: SPEC-CANVAS-001
companion_to: spec.md
status: DRAFT
date: 2026-05-12
phase: vision
---

# Implementation plan — Research Canvas Web App

## Sub-milestones

| ID | Goal | Estimate | Status |
|----|------|----------|--------|
| M1.0 | 프로젝트 셋업 + 기본 HTML 구조 | 1시간 | TODO |
| M1.1 | Mermaid library 통합 + 텍스트 → visual 렌더링 | 2시간 | TODO |
| M1.2 | 좌측 textarea 편집 + 우측 visual 자동 업데이트 | 1시간 | TODO |
| M1.3 | 파일 upload (.mmd, .md) | 1시간 | TODO |
| M1.4 | 파일 download (.mmd) + export (PNG, SVG) | 2시간 | TODO |
| M1.5 | Comment thread UI + 작성/저장 | 3시간 | TODO |
| M1.6 | Comment 파일 (.comments.json) read/write | 1시간 | TODO |
| M1.7 | Toolbar (file dropdown, theme toggle, etc.) | 1시간 | TODO |
| M1.8 | Mobile responsive CSS | 2시간 | TODO |
| M1.9 | 폴리싱 (CSS, animation, error handling) | 2시간 | TODO |
| M2.0 | README.md 사용자 가이드 작성 | 1시간 | TODO |
| M2.1 | AI_REFERENCE.md 작성 | 1시간 | TODO |
| M2.2 | 예시 캔버스 (.mmd) 3개 제작 | 1시간 | TODO |
| M3.0 | 테스트 + 버그 수정 | 2시간 | TODO |

Total: ~21시간 (Phase 1 MVP)

## Phase grouping

- **Phase 1 (MVP)**: M1.0–M3.0 (~21시간) — 즉시 진행
- **Phase 2 (협업 mode)**: 별도 SPEC (Visual drag-drop, server 배포, 동료 협업)
- **Phase 3 (advanced)**: 진짜 real-time multi-user

## Tech setup steps

```bash
# 1. 프로젝트 폴더 (이미 생성됨)
cd ~/projects/research-canvas-webapp

# 2. 폴더 구조
ls -la
# - src/ (소스 코드)
# - assets/ (CSS, JS local fallback)
# - canvases/ (예시 .mmd 파일)
# - docs/ (문서)
# - .moai/specs/ (SPEC 문서)

# 3. 로컬 server 실행 (개발 시)
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000/src/index.html
```

## Coding milestones

### M1.0 - 기본 HTML 구조

Files:
- src/index.html (메인 페이지)
- assets/style.css (CSS)
- assets/app.js (JavaScript)

HTML 구조:
- 상단 toolbar (파일 dropdown, upload, save, export 버튼)
- 좌측 textarea (Mermaid 편집)
- 우측 div (Mermaid 렌더링 target)
- 하단 comment thread (collapsible)

### M1.1 - Mermaid library 통합

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({ startOnLoad: false });

async function renderDiagram(text) {
  const { svg } = await mermaid.render('diagram-id', text);
  document.getElementById('visual').innerHTML = svg;
}
</script>
```

### M1.2 - 자동 업데이트

```javascript
const editor = document.getElementById('editor');
let renderTimer;
editor.addEventListener('input', () => {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => renderDiagram(editor.value), 300);
});
```

### M1.3-1.4 - 파일 I/O

- HTML5 File API 사용
- input[type="file"]로 upload
- download = Blob + a.download

### M1.5-1.6 - Comment thread

Comment 파일 형식 (.comments.json):
```json
[
  {
    "id": "uuid",
    "author": "김용상",
    "timestamp": "2026-05-12T07:00:00Z",
    "text": "첫 번째 가설 보강 필요"
  },
  ...
]
```

UI:
- Comment 목록 (작성자, 시간, 내용)
- 새 코멘트 입력 form
- 작성자 입력 + 내용 입력 + 전송 버튼

### M2.0-2.1 - 문서 작성

README.md (한국어 사용자 가이드):
- 5분 안에 시작하기
- Mermaid syntax 기본
- 파일 저장/공유
- 동료와 협업

AI_REFERENCE.md (AI 참조용):
- 폴더 구조
- 파일 형식 (.mmd, .comments.json)
- AI가 사용자와 협업하는 패턴
- 추천 워크플로우

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Mermaid CDN 다운 시 작동 안 함 | local fallback (assets/mermaid.min.js) |
| 큰 다이어그램 렌더링 느림 | 텍스트 변경 시 debounce (300ms), 큰 다이어그램은 collapse 옵션 |
| 한글 캔버스 syntax 오류 | 한글 노드 텍스트는 따옴표로 감싸기 (가이드에 명시) |
| 모바일 키보드 가림 | viewport meta tag, 동적 layout |
| 동료가 Mermaid 모름 | 가이드 문서에 syntax 예시 풍부하게 |

## Testing plan

- 각 milestone 후 manual test
- 다양한 Mermaid 다이어그램 type 테스트 (예시 .mmd 활용)
- Browser 호환성 (Chrome, Safari)
- Mobile (iOS Safari)

## What this SPEC does NOT cover

- Visual drag-drop 편집 (Phase 2)
- Server 배포 + 협업 mode (Phase 2)
- 진짜 real-time multi-user (Phase 3)
- AI native 통합 (Phase 3, 옵션)
- 인증 (Phase 3)
