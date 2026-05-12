---
id: SPEC-CANVAS-001
companion_to: spec.md
status: DRAFT
date: 2026-05-12
phase: vision
---

# Acceptance — Research Canvas Web App

## A0. Pre-launch readiness

- [ ] 프로젝트 폴더 ~/projects/research-canvas-webapp/ 셋업 완료
- [ ] SPEC 문서 (spec.md, plan.md, acceptance.md) 작성됨
- [ ] 브라우저에서 file:// 또는 http:// 로 페이지 열기 동작 확인

## A1. Core editing (Phase 1 MVP)

- [ ] index.html 더블클릭 또는 localhost 접속 시 페이지 로드
- [ ] 좌측 textarea에 Mermaid syntax 입력 가능
- [ ] 입력 후 300ms 내 우측에 visual diagram 렌더링
- [ ] Flowchart, mindmap, sequence diagram 모두 정상 렌더링
- [ ] 한글 노드 텍스트 (따옴표로 감싼 경우) 정상 렌더링
- [ ] 빈 textarea 또는 잘못된 syntax 시 명확한 error 메시지

## A2. File operations

- [ ] "업로드" 버튼 클릭 → 파일 선택 dialog
- [ ] .mmd 또는 .md 파일 선택 → 텍스트가 textarea에 로드
- [ ] 로드된 캔버스가 즉시 visual로 렌더링
- [ ] "저장" 버튼 클릭 → .mmd 파일 다운로드
- [ ] "Export PNG" 버튼 → diagram 이미지 다운로드
- [ ] "Export SVG" 버튼 → SVG 다운로드

## A3. Comment thread

- [ ] 하단에 comment thread 영역 표시
- [ ] 기존 코멘트 (시간순) 표시
- [ ] 작성자 이름 + 코멘트 내용 입력 form
- [ ] "전송" 클릭 시 새 코멘트 추가 + 즉시 표시
- [ ] 코멘트가 .comments.json 파일로 저장 (download)
- [ ] .comments.json 파일 upload 시 기존 코멘트 로드

## A4. UI/UX

- [ ] 데스크탑 (1920x1080) 정상 표시
- [ ] 노트북 (1366x768) 정상 표시
- [ ] 모바일 (375x667 iPhone) 정상 표시 (세로 stack)
- [ ] 텍스트 변경 시 visual 자동 업데이트 (300ms debounce)
- [ ] 무거운 다이어그램 렌더링 시 loading indicator
- [ ] 에러 발생 시 user-friendly 메시지

## A5. Documentation

- [ ] README.md (한국어) 작성됨
  - 5분 시작 가이드
  - Mermaid syntax 기본 예시
  - 파일 관리
  - 동료와 협업 (가이드)
- [ ] AI_REFERENCE.md 작성됨
  - 폴더 구조
  - 파일 형식 spec
  - AI가 캔버스 read/write하는 방법
  - 사용자와 AI 협업 패턴

## A6. Example canvases

- [ ] canvases/ 폴더에 예시 3개:
  - example_imrad_flow.mmd (IMRAD flowchart)
  - example_hypothesis_mindmap.mmd (가설 mindmap)
  - example_timeline.mmd (timeline 또는 gantt)

## A7. Sign-off — Phase 1 MVP minimum

- [ ] 모든 A1, A2, A3 (core 기능) 동작
- [ ] A5 문서 완성
- [ ] 사용자 (선생님)가 직접 사용 후 만족 확인
- [ ] HAIC paper canvas로 첫 사용 시도 성공

## What is NOT required for Phase 1 acceptance

- Visual drag-drop 편집 (Phase 2)
- Server 배포 (Phase 2)
- Real-time multi-user (Phase 3)
- AI native 통합 (Phase 3)
- 인증 (Phase 3)
- Mermaid Live Editor 수준의 UX 폴리싱 (점진적 개선)

## Risk-tolerance fallbacks

만약 Mermaid CDN 다운 시: assets/ 폴더에 local mermaid.min.js 사본 두기.

만약 textarea가 단순해서 사용 불편 시: Phase 1.5에서 CodeMirror 통합.

만약 comment 파일이 같은 폴더 관리 어려우면: localStorage fallback.

만약 모바일 사용 어려우면: 모바일은 read-only mode 권장 (편집은 데스크탑).

## Phase 2 acceptance (별도 SPEC 작성 시)

- Visual drag-drop 노드 편집
- Server 배포 가이드
- 동료 read + comment 모드
- 5-30초 file polling sync
