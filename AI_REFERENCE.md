# AI Reference — Research Canvas

이 문서는 AI(Claude, ChatGPT, Gemini 등)가 사용자와 함께 Research Canvas를 효과적으로 활용하기 위한 참조 문서입니다.

## 목적

Research Canvas는 의학 연구자가 논문 작성/논의 흐름을 시각적으로 정리하는 도구입니다. AI는 사용자가 본인 의도를 더 잘 시각화할 수 있도록 도와야 합니다.

## 폴더 구조

```
research-canvas/
├── src/                      # Web app source (수정하지 말 것)
├── canvases/                 # 사용자 캔버스 파일들
│   ├── *.mmd                 # Mermaid 캔버스
│   └── *.comments.json       # 코멘트 thread (선택)
├── docs/                     # 추가 문서
├── README.md                 # 사용자 가이드
├── AI_REFERENCE.md           # 이 파일
└── .moai/specs/              # SPEC 문서
```

## 파일 형식 spec

### .mmd (Mermaid 캔버스)

Plain text, Mermaid syntax. 예:

```
flowchart TD
    A[Introduction] --> B[Methods]
    B --> C[Results]
```

지원 다이어그램:
- `flowchart TD/LR/TB/BT`
- `mindmap`
- `sequenceDiagram`
- `classDiagram`
- `gantt`
- `pie`
- `stateDiagram-v2`
- `erDiagram`
- `journey`
- `timeline`

### .comments.json (코멘트 파일)

JSON array, 각 코멘트는 다음 구조:

```json
[
  {
    "id": "c-1715900000000-abc123",
    "author": "김용상",
    "timestamp": "2026-05-12T07:00:00Z",
    "text": "첫 번째 가설 보강 필요"
  }
]
```

## AI가 사용자와 협업하는 패턴

### 패턴 1: 새 캔버스 작성

사용자: "OO 주제로 IMRAD flowchart 만들어줘"

AI 응답 (예):
```
flowchart TB
    subgraph INTRO[Introduction]
        I1[Background]
        I2[Hypothesis]
    end
    subgraph METH[Methods]
        M1[Cohort]
        M2[Procedure]
    end
    subgraph RES[Results]
        R1[Outcomes]
    end
    subgraph DISC[Discussion]
        D1[Comparison]
        D2[Limitations]
    end
    INTRO --> METH --> RES --> DISC
```

지침:
- Mermaid syntax 정확히 사용
- 한글 노드는 따옴표/대괄호로 감싸기
- 노드 텍스트는 짧게 (한 줄, 5-10단어)
- IMRAD 구조 충실
- 색상 추가 (`style A fill:#ddf4ff`)

### 패턴 2: 수정 요청

사용자가 기존 .mmd 텍스트 + 수정 요청 전달.

AI 응답:
- 전체 수정된 Mermaid 텍스트 반환
- 변경 부분 명시 (예: "Discussion에 'Comparison with Meyblum' 노드 추가")
- 사용자가 그대로 편집기에 붙여넣을 수 있도록 코드 블록 포맷

### 패턴 3: 코멘트 응답

사용자: "동료 IR이 이런 코멘트 남겼어 [코멘트 내용]. 이걸 어떻게 반영할까?"

AI 응답:
- 코멘트 분석 (rationale, 임상적 타당성)
- 캔버스에 어떻게 반영할지 제안
- 수정된 Mermaid 텍스트 (해당하는 부분만 또는 전체)

### 패턴 4: 가설 brainstorming

사용자: "이 주제로 가설 mindmap 만들어줘"

AI 응답:
```
mindmap
  root((주제))
    가설 1
      증거 A
      반박 가능성
    가설 2
    ...
```

## 추천 워크플로우 (사용자에게 제안할 것)

1. **시작**: AI에게 캔버스 생성 요청
2. **편집기에 붙여넣기**: AI 응답 그대로 web app 편집기에
3. **시각 확인**: 우측 visual 보면서 검토
4. **부분 수정 요청**: 마음에 안 드는 부분만 AI에게 수정 요청
5. **반복**: 만족할 때까지
6. **저장**: .mmd 파일로 다운로드 → Google Drive 폴더에 보관

## 자주 발생하는 오류 + 해결

### Mermaid 렌더링 오류

원인:
- Syntax 오류 (괄호, 화살표 형태)
- 한글 노드에 따옴표 없음
- 지원 안 되는 다이어그램 type

해결:
- 한글 노드는 `["..."]` 형태로
- 다이어그램 type 정확히 (예: `flowchart TD`, `mindmap`)
- 빈 노드 안 됨

### 한글 깨짐

원인: 노드 ID에 한글 사용

해결:
- 노드 ID는 영문/숫자
- 표시 텍스트만 한글: `A["가설"]`

### 너무 큰 다이어그램

해결:
- mindmap에서 클릭 토글로 일부만 표시
- 여러 캔버스로 분할
- 색상으로 구역 구분

## 사용자 친화적 응답 가이드

AI가 사용자에게 답변할 때:

✓ 좋은 응답:
- "여기 IMRAD flowchart입니다. 편집기에 붙여넣으면 자동 렌더됩니다.
  ```
  flowchart TD
    A[Intro] --> B[Methods]
    ...
  ```
  특히 D2 노드 (Mechanism)는 강조했습니다 (노란색)."

✗ 나쁜 응답:
- "Mermaid syntax는 다음과 같습니다. flowchart 사용하세요. 노드는 [...] 형태입니다." (배경 설명만 길고 실제 코드 없음)

## Limitations 인지

이 도구는 다음을 못 합니다:
- Visual drag-drop 편집 (Phase 2 예정)
- 실시간 multi-user 동시 편집
- AI native 통합 (사용자가 copy-paste로 중계)
- 자동 PDF 변환

AI는 이 한계를 인지하고 사용자에게 명확히 안내해야 합니다.

## SPEC 참조

자세한 spec은 `.moai/specs/SPEC-CANVAS-001/` 참조:
- spec.md: Vision SPEC
- plan.md: Implementation plan
- acceptance.md: Acceptance criteria
