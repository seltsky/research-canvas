# Research Canvas

Mermaid 기반 연구 캔버스 web app — 의학 연구자를 위한 시각적 논의 도구.

## 5분 안에 시작하기

### 1. 다운로드 + 설치

이 폴더 전체를 본인 컴퓨터로 복사 (또는 Google Drive 폴더에 둠).

권장 위치: `~/Library/CloudStorage/GoogleDrive-{본인이메일}/내 드라이브/research-canvas/`

### 2. 실행 (가장 단순)

`src/index.html` 파일을 더블클릭 → 브라우저에서 web app 열림.

### 3. 실행 (협업 모드, 다른 device에서도 접속)

터미널 열기 후:

```bash
cd ~/Library/CloudStorage/GoogleDrive-{본인이메일}/내\ 드라이브/research-canvas/src
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속.

같은 네트워크의 다른 device에서: `http://{본인-IP}:8000` 접속.

### 4. 첫 캔버스 만들기

브라우저에서 web app 열리면:
1. 좌측 편집기에 Mermaid 텍스트 입력
2. 우측에 자동으로 그림 표시
3. 상단 "💾 저장" 버튼으로 .mmd 파일 다운로드

## Mermaid Syntax 기본

### Flowchart (흐름도, IMRAD에 적합)

```
flowchart TD
    A[Introduction] --> B[Methods]
    B --> C[Results]
    C --> D[Discussion]
```

### Mindmap (가설 정리)

```
mindmap
  root((연구 주제))
    가설 1
      증거 A
      증거 B
    가설 2
```

### Timeline (일정)

```
timeline
    title 연구 일정
    2026-05 : Phase 0
    2026-06 : Phase 1
    2026-09 : Phase 2
```

### Sequence Diagram (시퀀스)

```
sequenceDiagram
    Patient->>IR: 의뢰
    IR->>PACS: 영상 검토
    PACS-->>IR: DSA 영상
    IR->>Patient: 시술
```

## 주요 기능

### 편집기

- 좌측: Mermaid 텍스트 편집기
- 우측: 자동 visual 렌더링 (입력 후 0.3초)
- 한글 노드는 따옴표로 감싸기: `A["가설 1"]`
- 모든 Mermaid 다이어그램 타입 지원

### 파일 관리

- **저장 (Cmd/Ctrl+S)**: 현재 캔버스를 .mmd 파일로 다운로드
- **불러오기**: 기존 .mmd 또는 .md 파일 업로드
- **PNG/SVG 내보내기**: 다이어그램 이미지로 저장

### 자동 저장

- 편집 중인 내용은 브라우저 localStorage에 자동 저장됨
- 다음에 같은 브라우저에서 열면 마지막 작업 자동 복원

### 코멘트 (협업)

- 하단 코멘트 thread
- 익명 + 이름 입력으로 코멘트 작성
- "💾 코멘트 저장" 버튼으로 .comments.json 파일 다운로드
- "📂 코멘트 불러오기"로 동료의 코멘트 파일 import

### 키보드 단축키

- `Cmd/Ctrl + S`: 저장
- `Cmd/Ctrl + /`: 도움말 토글
- `Esc`: 도움말 닫기

## AI와 협업

이 웹앱은 AI native 통합이 없습니다. 대신 본인 AI (Claude, ChatGPT, Gemini 등)와 copy-paste로 협업합니다.

### 권장 워크플로우

1. **시작**: AI에게 "OO 주제로 Mermaid IMRAD flowchart 만들어줘" 요청
2. **붙여넣기**: AI가 준 Mermaid 텍스트를 편집기에 붙여넣기
3. **확인**: 우측 visual에서 즉시 결과 확인
4. **수정 요청**: 텍스트 전체 복사 → AI에 "이 부분 이렇게 수정해줘" 요청
5. **반영**: 새 텍스트 다시 붙여넣기

### Tip

- AI에게 항상 "Mermaid syntax로 작성해줘"라고 명시
- 큰 다이어그램은 부분만 수정 요청 (전체 재생성보다 효율적)
- 한글 노드는 `["..."]`로 감싸도록 안내

## 동료와 협업

### 시나리오 1: 같은 네트워크 (병원 내)

1. 본인 컴퓨터에서 `python3 -m http.server 8000` 실행
2. 본인 IP 주소 확인 (예: 192.168.1.100)
3. 동료에게 URL 공유: `http://192.168.1.100:8000`
4. 동료 브라우저로 접속 → 캔버스 보기 + 코멘트 작성
5. 동료가 작성한 코멘트는 .comments.json 파일로 저장 후 본인에게 전달

### 시나리오 2: 다른 device (Tailscale 등 VPN)

같은 절차이나 IP가 Tailscale IP.

### 시나리오 3: 웹 호스팅

`src/` 폴더를 GitHub Pages, Vercel, Netlify에 배포 → URL 공유.

배포 단계:
1. GitHub repo 생성 후 `src/` 폴더 push
2. GitHub Pages 활성화
3. URL 동료에게 공유

### 시나리오 4: 단순 파일 공유

1. 캔버스를 .mmd로 저장
2. 카카오톡/이메일로 동료에게 전달
3. 동료가 본인 web app에서 "불러오기"로 로드
4. 코멘트 작성 후 .comments.json 파일 본인에게 전달

## 폴더 구조

```
research-canvas/
├── src/
│   ├── index.html       (메인 페이지)
│   ├── style.css        (스타일)
│   └── app.js           (JavaScript 로직)
├── canvases/
│   ├── example_imrad_flow.mmd
│   ├── example_hypothesis_mindmap.mmd
│   └── example_timeline.mmd
├── docs/
│   └── (추가 문서)
├── README.md            (이 파일, 사용자 가이드)
├── AI_REFERENCE.md      (AI 참조용 spec)
└── .moai/specs/         (SPEC 문서)
```

## 자주 묻는 질문

**Q: 인터넷 없는 환경에서 사용 가능한가요?**
A: Mermaid 라이브러리를 CDN에서 로드하므로 첫 사용 시 인터넷 필요. 한 번 캐시되면 오프라인 사용 가능. 완전 오프라인 사용 원하시면 mermaid.min.js를 다운받아 `assets/`에 두고 index.html의 script 경로 변경.

**Q: 한글 노드 텍스트가 깨져요.**
A: Mermaid는 한글 noun을 따옴표/대괄호로 감싸야 합니다. `A[가설] --> B[검증]` 대신 `A["가설"] --> B["검증"]` 사용.

**Q: 코멘트가 자동 동기화되나요?**
A: 아니요. 현재 Phase 1 MVP는 수동 .comments.json 공유. Phase 2에서 file polling sync 구현 예정.

**Q: 모바일에서 사용 가능한가요?**
A: 모바일 responsive 지원하나, 편집은 데스크탑 권장. 모바일은 read-only 또는 코멘트 작성에 적합.

**Q: 큰 다이어그램이 느려요.**
A: 50개 이상 노드는 가독성도 떨어지니 분할 권장. 또는 mindmap에서 클릭 토글로 일부만 표시.

## 라이선스

오픈소스 MIT 라이선스. 자유롭게 사용/수정/공유 가능.

## 다음 step (Phase 2 계획)

- Visual drag-drop 편집 (mermaid-flow 같은 기능)
- Server 배포 가이드
- 동료 read + comment 모드 (file polling sync)
- Visual 편집 양방향 sync

## 기여 / 피드백

문제 발견 시 또는 개선 의견은 GitHub Issues 또는 직접 코드 수정 후 PR.
