/**
 * Research Canvas — Mermaid 기반 연구 캔버스 web app
 * Phase 1 MVP
 */

// ===== Mermaid Initialization =====
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: { curve: 'basis', useMaxWidth: true },
  themeVariables: { fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }
});

// ===== State =====
let comments = [];
let renderTimer = null;
let renderCounter = 0;
let currentTheme = localStorage.getItem('rc-theme') || 'light';
let zoomLevel = parseFloat(localStorage.getItem('rc-zoom')) || 1.0;
let editorWidth = localStorage.getItem('rc-editor-width') || '1fr';

// ===== DOM Elements =====
const editor = document.getElementById('editor');
const visual = document.getElementById('visual');
const renderStatus = document.getElementById('renderStatus');
const status = document.getElementById('status');
const filenameInput = document.getElementById('filename');
const commentList = document.getElementById('commentList');
const commentCount = document.getElementById('commentCount');
const commentForm = document.getElementById('commentForm');
const authorInput = document.getElementById('authorInput');
const commentText = document.getElementById('commentText');

// ===== Templates =====
const TEMPLATES = {
  imrad: {
    name: "IMRAD Flowchart (논문 흐름)",
    content: `flowchart TB
    subgraph TITLE["연구 논문 제목"]
    end

    subgraph INTRO["1. Introduction"]
        I1["Background"]
        I2["Literature gap"]
        I3["Hypothesis"]
        I1 --> I2 --> I3
    end

    subgraph METH["2. Methods"]
        M1["Cohort"]
        M2["Procedure"]
        M3["Outcome measures"]
        M4["Statistical analysis"]
        M1 --> M2 --> M3 --> M4
    end

    subgraph RES["3. Results"]
        R1["Cohort characteristics"]
        R2["Primary outcomes"]
        R3["Secondary outcomes"]
        R4["Adverse events"]
        R1 --> R2 --> R3 --> R4
    end

    subgraph DISC["4. Discussion"]
        D1["Compare with literature"]
        D2["Mechanism / Interpretation"]
        D3["Limitations"]
        D4["Future work"]
        D1 --> D2 --> D3 --> D4
    end

    subgraph CONC["5. Conclusion"]
        C1["Take-home message"]
    end

    INTRO --> METH --> RES --> DISC --> CONC

    style TITLE fill:#0969da,color:#fff
    style INTRO fill:#ddf4ff
    style METH fill:#dcfce7
    style RES fill:#fef3c7
    style DISC fill:#fee2e2
    style CONC fill:#f3e8ff
`
  },
  hypothesis_mindmap: {
    name: "Hypothesis Mindmap (가설 정리)",
    content: `mindmap
  root(("연구 가설 정리"))
    "Primary hypothesis"
      "Mechanism A"
      "Evidence supporting"
      "Counter-arguments"
    "Secondary hypothesis"
      "Mechanism B"
    "Alternative explanations"
      "Confounders"
      "Other mechanisms"
    "Validation strategy"
      "Internal validation"
      "External validation"
    "Limitations"
      "Sample size"
      "Single center"
`
  },
  timeline: {
    name: "Research Timeline (연구 일정)",
    content: `timeline
    title 연구 진행 일정
    section Phase 0 - 준비
        2026-05 : 환경 셋업
                : 문헌 조사
    section Phase 1 - 데이터
        2026-06 : EMR 추출
                : IRB 제출
        2026-07 : Pilot
    section Phase 2 - 분석
        2026-08 : 모델 학습
        2026-09 : Cross-validation
    section Phase 3 - 논문
        2026-10 : Manuscript drafting
        2026-11 : Submission
`
  },
  consort: {
    name: "CONSORT Flow (RCT 환자 흐름)",
    content: `flowchart TD
    A["선정된 환자<br>n = 100"] --> B["등록<br>n = 80"]
    A --> A1["제외<br>n = 20"]
    B --> C["무작위 배정<br>n = 80"]
    C --> D["치료군<br>n = 40"]
    C --> E["대조군<br>n = 40"]
    D --> F["분석 포함<br>n = 38"]
    D --> F1["손실<br>n = 2"]
    E --> G["분석 포함<br>n = 39"]
    E --> G1["손실<br>n = 1"]

    style A fill:#ddf4ff
    style B fill:#dcfce7
    style F fill:#fef3c7
    style G fill:#fef3c7
`
  },
  stard: {
    name: "STARD 2015 Flow (진단 정확도 연구)",
    content: `flowchart TD
    A["Eligible patients<br>n = ___"] --> B{"Met inclusion<br>criteria?"}
    B -->|"No"| C["Excluded<br>n = ___"]
    B -->|"Yes"| D["Index test performed<br>n = ___"]
    D --> E["Reference standard performed<br>n = ___"]
    E --> F1["Disease+<br>n = ___"]
    E --> F2["Disease-<br>n = ___"]
    F1 --> G1["Index+ TP n=___<br>Index- FN n=___"]
    F2 --> G2["Index+ FP n=___<br>Index- TN n=___"]
    G1 --> H["Sensitivity / Specificity<br>PPV / NPV / AUC"]
    G2 --> H

    style D fill:#ddf4ff
    style E fill:#dcfce7
    style H fill:#fef3c7
`
  },
  prisma: {
    name: "PRISMA 2020 Flow (체계적 문헌고찰)",
    content: `flowchart TD
    A1["Records identified from databases<br>PubMed n=___ Embase n=___"] --> A2["After duplicates removed<br>n = ___"]
    A3["Additional from registries<br>n = ___"] --> A2
    A2 --> B["Records screened<br>n = ___"]
    B --> B1["Excluded by title/abstract<br>n = ___"]
    B --> C["Reports sought for retrieval<br>n = ___"]
    C --> C1["Reports not retrieved<br>n = ___"]
    C --> D["Reports assessed for eligibility<br>n = ___"]
    D --> D1["Excluded with reasons<br>n = ___"]
    D --> E["Studies included in review<br>n = ___"]
    E --> F["Studies in meta-analysis<br>n = ___"]

    style A1 fill:#ddf4ff
    style A3 fill:#ddf4ff
    style E fill:#fef3c7
    style F fill:#dcfce7
`
  },
  tripod_ai: {
    name: "TRIPOD-AI Flow (AI 예측 모델)",
    content: `flowchart TD
    A["Source dataset<br>n = ___"] --> B{"Inclusion criteria"}
    B -->|"Excluded"| C["Excluded<br>이유: ___"]
    B -->|"Included"| D["Final cohort<br>n = ___"]
    D --> E1["Training set<br>n = ___ (___%)"]
    D --> E2["Validation set<br>n = ___ (___%)"]
    D --> E3["Test set<br>n = ___ (___%)"]
    E1 --> F["Model architecture<br>예: CNN, Transformer"]
    E2 --> F
    F --> G["Training + tuning"]
    G --> H["Performance evaluation<br>AUROC / Sensitivity / Specificity"]
    E3 --> H
    H --> I["External validation<br>n = ___ at ___"]
    I --> J["Clinical interpretation"]

    style D fill:#ddf4ff
    style F fill:#dcfce7
    style H fill:#fef3c7
    style I fill:#fee2e2
`
  },
  patient_pathway: {
    name: "Patient Pathway (환자 임상 경로)",
    content: `flowchart TD
    A["환자 내원<br>증상: ___"] --> B["초기 평가<br>병력 + 신체검사"]
    B --> C{"진단 검사"}
    C --> C1["영상: ___"]
    C --> C2["혈액: ___"]
    C --> C3["기타: ___"]
    C1 --> D{"진단"}
    C2 --> D
    C3 --> D
    D -->|"확진"| E["치료 결정"]
    D -->|"불확실"| F["추가 검사"]
    F --> D
    E --> G1["Option 1: ___"]
    E --> G2["Option 2: ___"]
    E --> G3["Option 3: ___"]
    G1 --> H["추적 관찰"]
    G2 --> H
    G3 --> H
    H --> I{"결과 평가"}
    I -->|"호전"| J["종료"]
    I -->|"악화"| K["재평가"]
    K --> E

    style A fill:#ddf4ff
    style D fill:#fef3c7
    style E fill:#dcfce7
    style J fill:#dcfce7
`
  },
  mechanism: {
    name: "Mechanism Diagram (병태생리/시술 메커니즘)",
    content: `flowchart TD
    A["원인 자극<br>예: 시술 stress"] --> B["1차 반응<br>예: 혈관 손상"]
    B --> C{"매개 인자"}
    C --> C1["인자 1: ___"]
    C --> C2["인자 2: ___"]
    C --> C3["인자 3: ___"]
    C1 --> D["Pathway A<br>예: 염증 반응"]
    C2 --> E["Pathway B<br>예: 응고 활성"]
    C3 --> F["Pathway C<br>예: 혈관 수축"]
    D --> G["중간 결과<br>예: 부종"]
    E --> G
    F --> G
    G --> H{"최종 outcome"}
    H --> H1["성공: ___"]
    H --> H2["실패: ___"]
    H --> H3["합병증: ___"]

    style A fill:#fee2e2
    style C fill:#fef3c7
    style G fill:#ddf4ff
    style H fill:#dcfce7
`
  },
  decision_tree: {
    name: "Clinical Decision Tree (임상 의사결정)",
    content: `flowchart TD
    A["환자 평가<br>: ___"] --> B{"기준 1<br>예: 연령 65 이상?"}
    B -->|"Yes"| C{"기준 2A<br>예: 동반 질환?"}
    B -->|"No"| D{"기준 2B<br>예: 증상 심각?"}
    C -->|"Yes"| E1["Action 1<br>: ___"]
    C -->|"No"| E2["Action 2<br>: ___"]
    D -->|"Yes"| E3["Action 3<br>: ___"]
    D -->|"No"| E4["Action 4<br>: ___"]
    E1 --> F["Outcome A"]
    E2 --> F
    E3 --> G["Outcome B"]
    E4 --> G

    style A fill:#ddf4ff
    style F fill:#dcfce7
    style G fill:#fef3c7
`
  },
  cohort_selection: {
    name: "Cohort Selection (연구 코호트 선정)",
    content: `flowchart TD
    A["전체 후보<br>n = ___"] --> B{"포함 기준<br>: ___"}
    B -->|"미충족"| C["제외<br>n = ___"]
    B -->|"충족"| D{"제외 기준 1<br>: ___"}
    D -->|"해당"| E1["제외 n = ___<br>이유: ___"]
    D -->|"미해당"| F{"제외 기준 2<br>: ___"}
    F -->|"해당"| E2["제외 n = ___<br>이유: ___"]
    F -->|"미해당"| G{"제외 기준 3<br>: ___"}
    G -->|"해당"| E3["제외 n = ___<br>이유: ___"]
    G -->|"미해당"| H["최종 코호트<br>n = ___"]
    H --> I1["Group A<br>n = ___"]
    H --> I2["Group B<br>n = ___"]

    style A fill:#ddf4ff
    style H fill:#fef3c7
    style I1 fill:#dcfce7
    style I2 fill:#dcfce7
`
  },
  empty: {
    name: "빈 캔버스",
    content: ""
  }
};

const DEFAULT_TEMPLATE = "imrad";
const DEFAULT_CONTENT = TEMPLATES[DEFAULT_TEMPLATE].content;

// ===== Initialization =====
function init() {
  // Theme
  applyTheme(currentTheme);

  // Restore splitter position
  document.documentElement.style.setProperty('--editor-w', editorWidth);

  // Restore last canvas from localStorage
  const savedContent = localStorage.getItem('rc-content');
  const savedFilename = localStorage.getItem('rc-filename');
  const savedAuthor = localStorage.getItem('rc-author');

  editor.value = savedContent || DEFAULT_CONTENT;
  if (savedFilename) filenameInput.value = savedFilename;
  if (savedAuthor) authorInput.value = savedAuthor;

  // Restore comments
  const savedComments = localStorage.getItem('rc-comments');
  if (savedComments) {
    try {
      comments = JSON.parse(savedComments);
      renderComments();
    } catch (e) {
      console.error('Failed to parse saved comments:', e);
    }
  }

  // Initial render
  renderDiagram();
  applyZoom();

  // Bind events
  bindEvents();
  bindSplitter();
  bindZoom();

  setStatus('준비됨');
}

// ===== Mermaid Rendering =====
async function renderDiagram() {
  const text = editor.value.trim();

  if (!text) {
    visual.innerHTML = '';
    visual.className = 'mermaid-container empty';
    visual.textContent = '캔버스가 비어있습니다. Mermaid syntax를 입력하세요.';
    renderStatus.textContent = '비어있음';
    return;
  }

  renderStatus.textContent = '렌더링 중...';
  const id = 'rc-diagram-' + (++renderCounter);

  try {
    const { svg } = await mermaid.render(id, text);
    visual.className = 'mermaid-container';
    visual.innerHTML = svg;
    renderStatus.textContent = '✓ 렌더링 완료 (노드 클릭 시 텍스트 highlight)';

    // Save to localStorage
    localStorage.setItem('rc-content', text);

    // Wire up node click handlers
    attachNodeClickHandlers();

    // Re-apply zoom
    applyZoom();
  } catch (e) {
    visual.className = 'mermaid-container error';
    visual.textContent = 'Mermaid 렌더링 오류:\n\n' + (e.message || e);
    renderStatus.textContent = '✗ 오류';
  }
}

// ===== Node click → text highlight =====
function attachNodeClickHandlers() {
  const nodes = visual.querySelectorAll('.node, .label-container');
  nodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', (e) => {
      e.stopPropagation();

      // Try to extract node identifier or label
      const nodeId = extractNodeIdentifier(node);
      if (!nodeId) return;

      // Highlight in editor
      highlightInEditor(nodeId);

      // Highlight in visual
      visual.querySelectorAll('.node.rc-highlight').forEach(n => n.classList.remove('rc-highlight'));
      node.classList.add('rc-highlight');
    });
  });
}

function extractNodeIdentifier(nodeEl) {
  // Try various ways to get a meaningful identifier
  // 1. Node ID from Mermaid (e.g., "flowchart-A-1")
  const id = nodeEl.id || '';
  const idMatch = id.match(/(?:flowchart-|node-)?([A-Za-z0-9_]+)/);

  // 2. Visible text label inside the node
  const textEl = nodeEl.querySelector('foreignObject, text, .nodeLabel, span');
  const textContent = textEl ? textEl.textContent.trim() : '';

  // Prefer text label (more user-friendly), fall back to ID
  return textContent || (idMatch ? idMatch[1] : '');
}

function highlightInEditor(needle) {
  if (!needle) return;
  const text = editor.value;
  const lines = text.split('\n');
  let foundLine = -1;
  let foundIdx = -1;

  // Strategy 1: exact text match
  for (let i = 0; i < lines.length; i++) {
    const idx = lines[i].indexOf(needle);
    if (idx !== -1) {
      foundLine = i;
      foundIdx = idx;
      break;
    }
  }

  if (foundLine === -1) {
    // Strategy 2: case-insensitive
    const lowerNeedle = needle.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      const idx = lines[i].toLowerCase().indexOf(lowerNeedle);
      if (idx !== -1) {
        foundLine = i;
        foundIdx = idx;
        break;
      }
    }
  }

  if (foundLine === -1) {
    setStatus('편집기에서 해당 노드 텍스트를 찾을 수 없음: ' + needle);
    return;
  }

  // Calculate absolute position
  let charPos = 0;
  for (let i = 0; i < foundLine; i++) {
    charPos += lines[i].length + 1; // +1 for newline
  }
  const startPos = charPos + foundIdx;
  const endPos = startPos + needle.length;

  // Set selection
  editor.focus();
  editor.setSelectionRange(startPos, endPos);

  // Scroll into view (approximate)
  const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 20;
  editor.scrollTop = Math.max(0, foundLine * lineHeight - editor.clientHeight / 3);

  setStatus(`🎯 노드 "${needle}" → ${foundLine + 1}번째 줄에서 발견`);
}

// ===== Zoom =====
function bindZoom() {
  document.getElementById('btnZoomIn').addEventListener('click', () => zoom(1.25));
  document.getElementById('btnZoomOut').addEventListener('click', () => zoom(0.8));
  document.getElementById('btnZoomReset').addEventListener('click', () => setZoom(1.0));
  document.getElementById('btnFitWidth').addEventListener('click', fitToWidth);

  // Mouse wheel zoom on visual
  const wrapper = document.getElementById('visualWrapper');
  wrapper.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    if (e.deltaY < 0) zoom(1.1); else zoom(1 / 1.1);
  }, { passive: false });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target === editor || e.target === commentText || e.target === authorInput) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom(1.25); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoom(0.8); }
    else if (e.key === '0') { e.preventDefault(); setZoom(1.0); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); fitToWidth(); }
  });
}

function zoom(factor) {
  setZoom(Math.max(0.2, Math.min(5.0, zoomLevel * factor)));
}

function setZoom(level) {
  zoomLevel = level;
  applyZoom();
  localStorage.setItem('rc-zoom', String(zoomLevel));
}

function applyZoom() {
  visual.style.transform = `scale(${zoomLevel})`;
  document.getElementById('zoomLevel').textContent = Math.round(zoomLevel * 100) + '%';
}

function fitToWidth() {
  const svgEl = visual.querySelector('svg');
  if (!svgEl) return;
  const wrapper = document.getElementById('visualWrapper');
  const wrapperWidth = wrapper.clientWidth - 48; // padding
  const svgWidth = svgEl.getBoundingClientRect().width / zoomLevel;
  if (svgWidth > 0) {
    setZoom(wrapperWidth / svgWidth);
  }
}

// ===== Splitter =====
function bindSplitter() {
  const splitter = document.getElementById('splitter');
  let dragging = false;

  splitter.addEventListener('mousedown', (e) => {
    dragging = true;
    splitter.classList.add('dragging');
    document.body.style.cursor = window.innerWidth <= 768 ? 'row-resize' : 'col-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const main = document.querySelector('.main');
    const rect = main.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const top = e.clientY - rect.top;
      const ratio = top / rect.height;
      if (ratio > 0.15 && ratio < 0.85) {
        main.style.gridTemplateRows = `${ratio * 100}% 6px ${(1 - ratio) * 100}%`;
      }
    } else {
      const left = e.clientX - rect.left;
      const ratio = left / rect.width;
      if (ratio > 0.15 && ratio < 0.85) {
        const newWidth = `${ratio * 100}%`;
        document.documentElement.style.setProperty('--editor-w', newWidth);
        editorWidth = newWidth;
        localStorage.setItem('rc-editor-width', newWidth);
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      splitter.classList.remove('dragging');
      document.body.style.cursor = '';
    }
  });

  // Touch support
  splitter.addEventListener('touchstart', (e) => {
    dragging = true;
    splitter.classList.add('dragging');
  });
  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const main = document.querySelector('.main');
    const rect = main.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const top = t.clientY - rect.top;
      const ratio = top / rect.height;
      if (ratio > 0.15 && ratio < 0.85) {
        main.style.gridTemplateRows = `${ratio * 100}% 6px ${(1 - ratio) * 100}%`;
      }
    } else {
      const left = t.clientX - rect.left;
      const ratio = left / rect.width;
      if (ratio > 0.15 && ratio < 0.85) {
        document.documentElement.style.setProperty('--editor-w', `${ratio * 100}%`);
      }
    }
  });
  document.addEventListener('touchend', () => {
    dragging = false;
    splitter.classList.remove('dragging');
  });
}

// ===== Editor Events =====
function bindEvents() {
  // Auto-render on edit (debounced 300ms)
  editor.addEventListener('input', () => {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderDiagram, 300);
  });

  // Filename change
  filenameInput.addEventListener('change', () => {
    localStorage.setItem('rc-filename', filenameInput.value);
  });

  // Author save
  authorInput.addEventListener('change', () => {
    localStorage.setItem('rc-author', authorInput.value);
  });

  // Buttons
  document.getElementById('btnNew').addEventListener('click', newCanvas);
  document.getElementById('btnTemplate').addEventListener('click', showTemplateMenu);
  document.getElementById('btnUpload').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  document.getElementById('btnSave').addEventListener('click', saveCanvas);
  document.getElementById('btnExportPng').addEventListener('click', exportPng);
  document.getElementById('btnExportSvg').addEventListener('click', exportSvg);
  document.getElementById('btnTheme').addEventListener('click', toggleTheme);
  document.getElementById('btnHelp').addEventListener('click', () => {
    document.getElementById('helpModal').style.display = 'flex';
  });

  // Comments
  document.getElementById('btnLoadComments').addEventListener('click', () => document.getElementById('commentInput').click());
  document.getElementById('commentInput').addEventListener('change', handleCommentUpload);
  document.getElementById('btnSaveComments').addEventListener('click', saveComments);
  document.getElementById('btnToggleComments').addEventListener('click', toggleCommentSection);
  commentForm.addEventListener('submit', addComment);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      saveCanvas();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      const m = document.getElementById('helpModal');
      m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
    }
    if (e.key === 'Escape') {
      document.getElementById('helpModal').style.display = 'none';
    }
  });
}

// ===== File Operations =====
function newCanvas() {
  if (editor.value && !confirm('현재 캔버스를 새로 시작하시겠습니까? 저장되지 않은 변경 내용은 사라집니다.')) {
    return;
  }
  editor.value = TEMPLATES[DEFAULT_TEMPLATE].content;
  filenameInput.value = 'untitled';
  comments = [];
  renderComments();
  renderDiagram();
  localStorage.removeItem('rc-content');
  localStorage.removeItem('rc-comments');
  showToast('새 캔버스 시작 (IMRAD 템플릿)', 'success');
}

function showTemplateMenu() {
  const keys = Object.keys(TEMPLATES);
  const labels = keys.map((k, i) => `${i + 1}. ${TEMPLATES[k].name}`).join('\n');
  const choice = prompt('템플릿 선택 (번호 입력):\n\n' + labels);
  if (!choice) return;
  const idx = parseInt(choice, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= keys.length) {
    showToast('잘못된 번호', 'error');
    return;
  }
  if (editor.value && editor.value !== TEMPLATES[DEFAULT_TEMPLATE].content) {
    if (!confirm('현재 캔버스를 템플릿으로 교체하시겠습니까? 저장되지 않은 변경은 사라집니다.')) {
      return;
    }
  }
  const tplKey = keys[idx];
  editor.value = TEMPLATES[tplKey].content;
  renderDiagram();
  showToast('템플릿 적용: ' + TEMPLATES[tplKey].name, 'success');
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    editor.value = ev.target.result;
    filenameInput.value = file.name.replace(/\.(mmd|md|txt)$/, '');
    renderDiagram();
    showToast('불러옴: ' + file.name, 'success');
  };
  reader.onerror = () => showToast('파일 읽기 실패', 'error');
  reader.readAsText(file);

  // Reset input so same file can be re-uploaded
  e.target.value = '';
}

function saveCanvas() {
  const filename = (filenameInput.value || 'untitled').replace(/\.mmd$/, '');
  const blob = new Blob([editor.value], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename + '.mmd');
  showToast('저장됨: ' + filename + '.mmd', 'success');
}

function exportPng() {
  const svgEl = visual.querySelector('svg');
  if (!svgEl) { showToast('렌더된 다이어그램이 없습니다', 'error'); return; }

  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = currentTheme === 'dark' ? '#0d1117' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      const filename = (filenameInput.value || 'canvas') + '.png';
      downloadBlob(blob, filename);
      showToast('내보냄: ' + filename, 'success');
    }, 'image/png');
    URL.revokeObjectURL(url);
  };
  img.onerror = () => showToast('PNG 변환 실패', 'error');
  img.src = url;
}

function exportSvg() {
  const svgEl = visual.querySelector('svg');
  if (!svgEl) { showToast('렌더된 다이어그램이 없습니다', 'error'); return; }
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const filename = (filenameInput.value || 'canvas') + '.svg';
  downloadBlob(blob, filename);
  showToast('내보냄: ' + filename, 'success');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ===== Comments =====
function addComment(e) {
  e.preventDefault();
  const author = authorInput.value.trim();
  const text = commentText.value.trim();
  if (!author || !text) return;

  const comment = {
    id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    author: author,
    timestamp: new Date().toISOString(),
    text: text
  };
  comments.push(comment);
  commentText.value = '';
  renderComments();
  saveCommentsToLocal();
  showToast('코멘트 추가됨', 'success');

  // Save author for next time
  localStorage.setItem('rc-author', author);
}

function deleteComment(id) {
  if (!confirm('이 코멘트를 삭제하시겠습니까?')) return;
  comments = comments.filter(c => c.id !== id);
  renderComments();
  saveCommentsToLocal();
}

function renderComments() {
  commentCount.textContent = comments.length;
  commentList.innerHTML = '';

  if (comments.length === 0) return;

  // Sort by timestamp (oldest first)
  const sorted = [...comments].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  for (const c of sorted) {
    const item = document.createElement('div');
    item.className = 'comment-item';

    const meta = document.createElement('div');
    meta.className = 'comment-meta';

    const left = document.createElement('span');
    left.innerHTML = `<span class="comment-author">${escapeHtml(c.author)}</span> · ${formatTime(c.timestamp)}`;

    const delBtn = document.createElement('button');
    delBtn.className = 'comment-delete';
    delBtn.textContent = '삭제';
    delBtn.onclick = () => deleteComment(c.id);

    meta.appendChild(left);
    meta.appendChild(delBtn);

    const text = document.createElement('div');
    text.className = 'comment-text';
    text.textContent = c.text;

    item.appendChild(meta);
    item.appendChild(text);
    commentList.appendChild(item);
  }

  // Auto scroll to bottom
  commentList.scrollTop = commentList.scrollHeight;
}

function saveCommentsToLocal() {
  localStorage.setItem('rc-comments', JSON.stringify(comments));
}

function saveComments() {
  if (comments.length === 0) {
    showToast('저장할 코멘트가 없습니다', 'error');
    return;
  }
  const filename = (filenameInput.value || 'untitled') + '.comments.json';
  const blob = new Blob([JSON.stringify(comments, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
  showToast('코멘트 저장됨: ' + filename, 'success');
}

function handleCommentUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const loaded = JSON.parse(ev.target.result);
      if (!Array.isArray(loaded)) throw new Error('Comments file must be an array');
      // Merge with existing
      const existingIds = new Set(comments.map(c => c.id));
      const newOnes = loaded.filter(c => !existingIds.has(c.id));
      comments = [...comments, ...newOnes];
      renderComments();
      saveCommentsToLocal();
      showToast(`코멘트 ${newOnes.length}개 불러옴`, 'success');
    } catch (err) {
      showToast('코멘트 파일 형식 오류: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function toggleCommentSection() {
  const commentsEl = document.querySelector('.comments');
  if (commentsEl.classList.contains('collapsed')) {
    commentsEl.classList.remove('collapsed');
    commentsEl.style.height = '';
    document.documentElement.style.setProperty('--comment-h', '280px');
    document.getElementById('btnToggleComments').textContent = '▼';
  } else {
    commentsEl.classList.add('collapsed');
    document.documentElement.style.setProperty('--comment-h', '40px');
    document.getElementById('btnToggleComments').textContent = '▲';
  }
}

// ===== Theme =====
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('rc-theme', currentTheme);

  // Re-render with new theme
  mermaid.initialize({
    startOnLoad: false,
    theme: currentTheme === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
    flowchart: { curve: 'basis', useMaxWidth: true }
  });
  renderDiagram();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ===== Utilities =====
function setStatus(msg) { status.textContent = msg; }

function showToast(msg, type) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return Math.floor(diff/60) + '분 전';
  if (diff < 86400) return Math.floor(diff/3600) + '시간 전';
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' +
         String(d.getDate()).padStart(2,'0') + ' ' +
         String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

// ===== Start =====
document.addEventListener('DOMContentLoaded', init);
