# 의학 연구 Mermaid 템플릿 라이브러리

본 템플릿들은 NodeBB 게시판, Excalidraw, Mermaid Live Editor 등에서 사용 가능합니다.

## 템플릿 목록

| # | 파일 | 용도 |
|---|---|---|
| 01 | `01_IMRAD_flowchart.mmd` | 논문 구조 (Introduction → Methods → Results → Discussion → Conclusion) |
| 02 | `02_CONSORT_flow.mmd` | RCT 환자 흐름 (CONSORT 2010) |
| 03 | `03_STARD_flow.mmd` | 진단 정확도 연구 (STARD 2015) |
| 04 | `04_PRISMA_flow.mmd` | 체계적 문헌고찰 (PRISMA 2020) |
| 05 | `05_TRIPOD_AI_flow.mmd` | AI 예측 모델 개발/검증 (TRIPOD-AI) |
| 06 | `06_patient_pathway.mmd` | 환자 임상 경로 |
| 07 | `07_mechanism_diagram.mmd` | 병태생리/시술 메커니즘 |
| 08 | `08_hypothesis_tree.mmd` | 연구 가설 정리 (mindmap) |
| 09 | `09_decision_tree.mmd` | 임상 의사결정 나무 |
| 10 | `10_cohort_selection.mmd` | 연구 코호트 선정 흐름 |

## 사용 방법

### 방법 1: NodeBB에서 직접 사용 (Mermaid 코드 그대로)
1. 원하는 템플릿 파일 열기
2. 내용 전체 복사
3. NodeBB 게시글 본문에 붙여넣기:
   ````
   ```mermaid
   (여기에 복사한 코드)
   ```
   ````
4. ___ 부분을 본인 연구 내용으로 수정
5. composer 우측 preview에서 즉시 확인 (live render)
6. Submit

### 방법 2: Excalidraw에서 시각 편집
1. https://excalidraw.com 열기
2. 좌상단 ≡ 메뉴 → "+ Mermaid to Excalidraw"
3. 템플릿 코드 paste
4. Insert → 시각 편집 (drag-drop)
5. File → Save to file → PNG
6. NodeBB 게시글에 PNG 업로드

### 방법 3: AI에게 수정 요청
1. ChatGPT/Claude에 prompt:
   ```
   다음 Mermaid 템플릿을 [본인 연구 주제]에 맞게 수정해줘:
   (템플릿 코드 paste)
   ```
2. AI가 수정한 코드 복사
3. NodeBB 게시글에 붙여넣기

### 방법 4: Research Canvas web app에서 수정
1. https://seltsky.github.io/research-canvas/ 열기
2. 좌측에 템플릿 코드 paste
3. 우측에서 즉시 visual 확인하면서 수정
4. 완성 후 코드 복사 → NodeBB에 paste

## ___ 표시

`___` 또는 `[___]`는 본인 연구 내용으로 채워넣어야 하는 placeholder입니다.

## 템플릿 추가 요청

새 템플릿이 필요하면 NodeBB에 요청하거나 직접 .mmd 파일 추가 후 PR.
