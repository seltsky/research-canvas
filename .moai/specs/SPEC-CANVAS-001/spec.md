---
id: SPEC-CANVAS-001
title: Research Canvas Web App — Mermaid 기반 연구 캔버스 도구
status: DRAFT
date: 2026-05-12
authors: [김용상, AI]
phase: vision
blocks: [SPEC-CANVAS-IMPL-001, SPEC-CANVAS-COLLAB-001]
---

# 1. Background

의학 연구 (특히 의료 IR 분야)에서 논문 작성 시 다음 어려움이 있다:

- 논의가 깊어질수록 큰 그림(IMRAD 흐름, 가설 구조)을 잃기 쉬움
- 동료 연구자와 의견 교환 시 시각화 부재
- AI와 협업할 때 텍스트 기반 논의는 효율적이나 시각적 이해는 부족
- 기존 도구(Mermaid Live, Markmap, Drawio 등)는 단편적 — 종합적 연구 캔버스 부재

기존 도구 한계:
- Mermaid Live Editor: 텍스트 편집만, 협업/코멘트 없음
- Markmap: mindmap만, IMRAD 흐름 표현 어려움
- MermaidChart Pro: 모든 기능 ✓ but 유료 ($6.67/월), AI 통합 외부 의존
- Drawio: visual ✓ but 마크다운 sync 약함, AI 통합 어려움
- Custom 빌드 필요

# 2. Goals

- Mermaid 기반 연구 캔버스 web app 구축
- 텍스트 (Mermaid syntax) ↔ visual diagram 양방향 (Phase 1: 텍스트 → visual 단방향, Phase 2: 양방향)
- 본인 + 본인 AI가 텍스트 편집 후 즉시 visual 확인
- 동료가 캔버스 보고 paper-level 코멘트 작성
- 무료, 오픈소스 활용
- 로컬 사용 + 서버 배포 모두 지원

# 3. Non-goals

- 진짜 real-time multi-user 동시 편집 (Phase 3로 보류)
- AI native 통합 (사용자가 본인 AI에 copy-paste로 처리)
- 노드별 코멘트 (paper-level만)
- Visual drag-drop 편집 (Phase 2로 보류)
- 인증 시스템 (익명 + 이름 입력만)
- 진료 정보 처리 (PHI/HIPAA 영역 아님)

# 4. Functional requirements

R1. Mermaid syntax 텍스트 편집기 제공 (좌측 패널)
R2. 입력된 Mermaid 텍스트를 즉시 visual diagram으로 렌더링 (우측 패널)
R3. 모든 Mermaid 다이어그램 타입 지원 (flowchart, mindmap, sequence, class, gantt, ER, state 등)
R4. 파일 upload (.mmd, .md) — 사용자가 기존 파일 불러오기
R5. 파일 download (.mmd) — 편집한 캔버스 저장
R6. 다이어그램 export (PNG, SVG)
R7. Comment thread 표시 (하단 패널 또는 별도 panel)
R8. Comment 작성: 익명 + 이름 입력
R9. Comment 저장 (.comments.md 별도 파일 또는 같은 파일 내 섹션)
R10. 캔버스 zoom + pan (Mermaid 라이브러리 native)
R11. 다중 캔버스 관리 (파일 선택 dropdown)
R12. 모바일 responsive

# 5. Non-functional

- 로컬에서 file:// 프로토콜로 작동 (Python http.server 옵션도 지원)
- 모든 modern 브라우저 지원 (Chrome, Safari, Firefox, Edge)
- 인터넷 연결 시 Mermaid CDN 사용, 오프라인 시 local 라이브러리 fallback
- 5-30초 file polling sync (server 모드)
- 한국어 UI 우선, 영어 fallback

# 6. UX details

레이아웃:
```
┌───────────────────────────────────┐
│ Top Toolbar                        │
│ [파일 선택] [업로드] [저장] [Export]│
├──────────────────┬─────────────────┤
│                  │                 │
│ Mermaid Editor   │ Visual Diagram  │
│ (좌측)           │ (우측)          │
│                  │                 │
│                  │                 │
├──────────────────┴─────────────────┤
│ Comment Thread (하단)              │
│ - [김용상]: 의견                   │
│ - [동료A]: 답변                    │
│ [새 코멘트 작성]                   │
│ [이름]: [____] [전송]              │
└────────────────────────────────────┘
```

색상:
- Light theme (default)
- 깔끔한 의학 연구 분위기 (white background, blue accents)
- 색맹 친화적

# 7. Key technical decisions

- **Frontend**: Vanilla JavaScript + HTML + CSS (의존성 최소화)
- **Mermaid library**: CDN (https://cdn.jsdelivr.net/npm/mermaid)
- **Editor**: 단순 textarea (CodeMirror/Monaco 추후 옵션)
- **File save**: HTML5 File API (download/upload), File System Access API (modern Chrome/Edge)
- **Comment storage**: 같은 폴더 내 `{filename}.comments.json` 별도 파일
- **Server (모드 2)**: Python `http.server` 또는 Node.js Express (선택적)
- **Storage location**: 사용자 지정 폴더 (Google Drive Desktop folder 권장)

# 8. Open questions (자동 채택 defaults)

| ID | Question | Default |
|----|----------|---------|
| D1 | 편집기 라이브러리 (textarea vs CodeMirror) | textarea (단순, MVP) |
| D2 | 파일 저장 방식 | Download/Upload (Phase 1) + File System Access API (Phase 2 enhancement) |
| D3 | Comment 저장 형식 | JSON 파일 (`{filename}.comments.json`) |
| D4 | Mermaid 버전 | 최신 stable (CDN latest) |
| D5 | 모바일 layout | 세로 stack (편집기 위, visual 아래, comment 더 아래) |
| D6 | 다국어 | 한국어 primary, 영어 옵션 toggle |

# 9. Dependencies on other SPECs

- SPEC-CANVAS-IMPL-001: 구현 detail (코드 구조, 함수 spec)
- SPEC-CANVAS-COLLAB-001: 협업 mode 상세 (Phase 2)

# 10. References

- Mermaid 공식: https://mermaid.js.org
- Mermaid CDN: https://cdn.jsdelivr.net/npm/mermaid
- Mermaid Live Editor: https://mermaid.live (참고 UI)
- Markmap: https://markmap.js.org (이전 참고)

# 11. Collaboration model

- **Claude Code**: HTML/JS/CSS 코드 작성, Mermaid 라이브러리 통합, 문서 작성
- **선생님**: 요구 사항 정의, 사용 시나리오 검증, 동료 사용 가이드 검토
- **동료 IR**: 사용 후 피드백 (Phase 2 협업 mode 테스트 시)

# 12. Success criteria (Phase 1 MVP)

- [ ] Mermaid 텍스트 입력 시 즉시 visual rendering
- [ ] 모든 Mermaid 다이어그램 타입 지원 확인
- [ ] 파일 upload/download 동작
- [ ] Comment 작성 + 저장 + 표시
- [ ] 로컬 모드 동작 (file:// 또는 localhost http://)
- [ ] 모바일에서 사용 가능
- [ ] 사용자 가이드 문서 작성
- [ ] AI reference 문서 작성
