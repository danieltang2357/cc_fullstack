const fs = require('fs');
const path = require('path');

const employees = [
  { no: 1,  name: "张三",  type: "管理费", gross: 12000, pension: 930,  medical: 180, unemployment: 0,    illness: 0,    ins_total: 1110,   housing: 570, other_tax: 165.32, net: 10501.68 },
  { no: 2,  name: "李四",  type: "管理费", gross: 8500,  pension: 650,  medical: 180, unemployment: 8.5,  illness: 0,    ins_total: 838.5,  housing: 400, other_tax: 88.45,  net: 7323.05  },
  { no: 3,  name: "王五",  type: "技术费", gross: 15000, pension: 900,  medical: 200, unemployment: 9.2,  illness: 55.8, ins_total: 1165,   housing: 600, other_tax: 256.78, net: 12397.22 },
  { no: 4,  name: "赵六",  type: "管理费", gross: 9800,  pension: 700,  medical: 195, unemployment: 9.8,  illness: 0,    ins_total: 904.8,  housing: 450, other_tax: 118.92, net: 8576.28  },
  { no: 5,  name: "陈七",  type: "技术费", gross: 11500, pension: 750,  medical: 220, unemployment: 11.5, illness: 0,    ins_total: 981.5,  housing: 500, other_tax: 146.88, net: 9371.62  },
  { no: 6,  name: "刘八",  type: "管理费", gross: 7200,  pension: 580,  medical: 150, unemployment: 7.2,  illness: 0,    ins_total: 737.2,  housing: 350, other_tax: 55.68,  net: 6157.12  },
  { no: 7,  name: "杨九",  type: "技术费", gross: 13200, pension: 800,  medical: 265, unemployment: 13.2, illness: 50,   ins_total: 1128.2, housing: 580, other_tax: 198.45, net: 11325.35 },
  { no: 8,  name: "周十",  type: "管理费", gross: 6800,  pension: 520,  medical: 138, unemployment: 6.8,  illness: 0,    ins_total: 664.8,  housing: 300, other_tax: 42.35,  net: 5842.85  },
  { no: 9,  name: "吴一一", type: "技术费", gross: 14500, pension: 800,  medical: 285, unemployment: 14.5, illness: 80,   ins_total: 1179.5, housing: 580, other_tax: 232.67, net: 12927.83 },
  { no: 10, name: "郑一二", type: "管理费", gross: 8800,  pension: 680,  medical: 175, unemployment: 8.8,  illness: 0,    ins_total: 863.8,  housing: 420, other_tax: 95.25,  net: 7620.95  },
];

function fmt(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function hex(n) {
  return '0x' + Math.floor(n).toString(16).toUpperCase().padStart(4, '0');
}

function generateHTML(emp) {
  const empId = String(emp.no).padStart(3, '0');
  const totalDeductions = emp.ins_total + emp.housing + emp.other_tax;
  const timestamp = `2025.${String(new Date().getMonth()+1).padStart(2,'0')}.${String(new Date().getDate()).padStart(2,'0')}`;
  const checksum = (emp.no * 0xA3F + Math.floor(emp.net)).toString(16).toUpperCase().padStart(8, '0');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAYROLL_SYS :: ${emp.name} :: EMP_${empId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --green:     #00ff41;
      --green-dim: #00b32c;
      --green-glow: rgba(0, 255, 65, 0.35);
      --cyan:      #00e5ff;
      --cyan-dim:  #0097a7;
      --red:       #ff2a5e;
      --amber:     #ffb300;
      --bg:        #030a03;
      --bg2:       #060f06;
      --bg3:       #0a160a;
      --border:    rgba(0, 255, 65, 0.2);
      --border-hi: rgba(0, 255, 65, 0.6);
      --text-dim:  rgba(0, 255, 65, 0.35);
      --font: 'JetBrains Mono', 'Courier New', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font);
      background: var(--bg);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
      overflow-x: hidden;
    }

    /* Grid background */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    /* Scanlines */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.18) 2px,
        rgba(0, 0, 0, 0.18) 4px
      );
      pointer-events: none;
      z-index: 999;
      animation: scanMove 8s linear infinite;
    }

    @keyframes scanMove {
      0%   { background-position: 0 0; }
      100% { background-position: 0 40px; }
    }

    /* Corner decorations */
    .corner { position: fixed; width: 80px; height: 80px; pointer-events: none; z-index: 1; }
    .corner svg { width: 100%; height: 100%; }
    .corner.tl { top: 16px; left: 16px; }
    .corner.tr { top: 16px; right: 16px; transform: scaleX(-1); }
    .corner.bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
    .corner.br { bottom: 16px; right: 16px; transform: scale(-1); }

    /* Main card */
    .terminal {
      position: relative;
      width: 100%;
      max-width: 760px;
      background: var(--bg2);
      border: 1px solid var(--border-hi);
      box-shadow:
        0 0 30px var(--green-glow),
        0 0 80px rgba(0, 255, 65, 0.08),
        inset 0 0 30px rgba(0, 255, 65, 0.03);
      z-index: 10;
      animation: bootIn 0.6s ease-out both;
    }

    @keyframes bootIn {
      0%   { opacity: 0; transform: translateY(20px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Title bar */
    .titlebar {
      background: var(--bg3);
      border-bottom: 1px solid var(--border);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .dots { display: flex; gap: 7px; }
    .dot {
      width: 12px; height: 12px;
      border-radius: 50%;
    }
    .dot.r { background: #ff2a5e; box-shadow: 0 0 6px #ff2a5e; }
    .dot.y { background: #ffb300; box-shadow: 0 0 6px #ffb300; }
    .dot.g { background: #00ff41; box-shadow: 0 0 6px #00ff41; }
    .titlebar-text {
      font-size: 11px;
      color: var(--text-dim);
      letter-spacing: 0.08em;
      flex: 1;
      text-align: center;
    }
    .titlebar-text span { color: var(--green-dim); }

    /* Header */
    .header {
      padding: 28px 32px 20px;
      border-bottom: 1px solid var(--border);
      position: relative;
      overflow: hidden;
    }
    .header::after {
      content: 'CONFIDENTIAL';
      position: absolute;
      right: -30px; top: 18px;
      font-size: 10px;
      color: rgba(255,42,94,0.12);
      letter-spacing: 0.3em;
      transform: rotate(20deg);
      font-weight: 700;
    }

    .prompt-line {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 8px;
    }
    .prompt { color: var(--green-dim); font-size: 12px; }
    .cmd { color: var(--cyan); font-size: 13px; letter-spacing: 0.05em; }
    .cursor {
      display: inline-block;
      width: 8px; height: 14px;
      background: var(--green);
      margin-left: 2px;
      vertical-align: middle;
      animation: blink 1s step-end infinite;
      box-shadow: 0 0 8px var(--green);
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    .sys-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--green);
      letter-spacing: 0.12em;
      text-shadow: 0 0 15px var(--green), 0 0 30px rgba(0,255,65,0.4);
      margin: 14px 0 6px;
    }
    .sys-subtitle {
      font-size: 11px;
      color: var(--text-dim);
      letter-spacing: 0.15em;
    }

    /* Employee block */
    .emp-block {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-left: 3px solid var(--cyan);
      margin: 24px 32px;
      padding: 16px 20px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.06);
    }
    .emp-field {}
    .emp-key {
      font-size: 9px;
      color: var(--cyan-dim);
      letter-spacing: 0.2em;
      margin-bottom: 5px;
    }
    .emp-val {
      font-size: 15px;
      font-weight: 600;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0,229,255,0.5);
      letter-spacing: 0.08em;
    }

    /* Sections */
    .section {
      padding: 0 32px;
      margin-bottom: 20px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.2em;
    }
    .section-header::before { content: '//'; color: var(--green-dim); }
    .section-header .line {
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* Data rows */
    .data-row {
      display: flex;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid rgba(0,255,65,0.06);
      font-size: 13px;
      position: relative;
      transition: background 0.15s;
    }
    .data-row:hover {
      background: rgba(0,255,65,0.03);
    }
    .data-row:last-child { border-bottom: none; }

    .row-key {
      flex: 1;
      color: rgba(0,255,65,0.5);
      letter-spacing: 0.05em;
    }
    .row-key .hex { font-size: 9px; color: var(--text-dim); margin-left: 10px; }
    .row-dots {
      flex: 1;
      border-bottom: 1px dotted rgba(0,255,65,0.15);
      margin: 0 14px;
      height: 1px;
      align-self: center;
    }
    .row-val {
      font-size: 14px;
      font-weight: 500;
      color: var(--green);
      min-width: 120px;
      text-align: right;
      letter-spacing: 0.05em;
    }
    .row-val.deduct { color: var(--red); }
    .row-val.gross  { color: var(--amber); font-weight: 700; }
    .row-val.sub    { color: rgba(255,42,94,0.7); font-size: 13px; }

    /* Subtotal row */
    .subtotal-row {
      background: rgba(255,42,94,0.05);
      border: 1px solid rgba(255,42,94,0.2);
      padding: 10px 12px;
      display: flex;
      align-items: center;
      margin-top: 6px;
    }
    .subtotal-row .row-key { color: rgba(255,42,94,0.7); font-size: 12px; }
    .subtotal-row .row-val { color: var(--red); font-weight: 600; }

    /* Net pay block */
    .net-block {
      margin: 24px 32px;
      background: linear-gradient(135deg, rgba(0,255,65,0.06) 0%, rgba(0,255,65,0.02) 100%);
      border: 1px solid var(--green-dim);
      box-shadow: 0 0 30px rgba(0,255,65,0.12), inset 0 0 20px rgba(0,255,65,0.03);
      padding: 24px 28px;
      position: relative;
      overflow: hidden;
    }
    .net-block::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      animation: scanH 3s ease-in-out infinite;
    }
    @keyframes scanH {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .net-label {
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.25em;
      margin-bottom: 10px;
    }
    .net-label::before { content: '>> '; color: var(--green-dim); }
    .net-amount {
      font-size: 44px;
      font-weight: 700;
      color: var(--green);
      text-shadow: 0 0 20px var(--green), 0 0 40px rgba(0,255,65,0.5);
      letter-spacing: 0.06em;
      line-height: 1;
    }
    .net-amount .currency { font-size: 22px; margin-right: 4px; opacity: 0.8; }
    .net-sub {
      margin-top: 8px;
      font-size: 11px;
      color: var(--text-dim);
    }

    /* Status bar */
    .statusbar {
      background: var(--bg3);
      border-top: 1px solid var(--border);
      padding: 10px 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.12em;
    }
    .status-item { display: flex; align-items: center; gap: 6px; }
    .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    .status-spacer { flex: 1; }
    .checksum { color: rgba(0,229,255,0.4); font-size: 9px; }

    /* Glitch effect on name */
    .glitch {
      position: relative;
      display: inline-block;
    }
    .glitch::before,
    .glitch::after {
      content: attr(data-text);
      position: absolute;
      left: 0; top: 0;
      width: 100%;
      height: 100%;
    }
    .glitch::before {
      color: var(--cyan);
      animation: glitch1 4s infinite;
      clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    }
    .glitch::after {
      color: var(--red);
      animation: glitch2 4s infinite;
      clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
    }
    @keyframes glitch1 {
      0%,90%,100% { transform: translate(0); opacity: 0; }
      92%         { transform: translate(-2px, 1px); opacity: 0.8; }
      94%         { transform: translate(2px, -1px); opacity: 0.8; }
      96%         { transform: translate(0); opacity: 0; }
    }
    @keyframes glitch2 {
      0%,90%,100% { transform: translate(0); opacity: 0; }
      93%         { transform: translate(2px, 1px); opacity: 0.8; }
      95%         { transform: translate(-2px, -1px); opacity: 0.8; }
      97%         { transform: translate(0); opacity: 0; }
    }

    /* Count-up animation */
    .count-up {
      opacity: 0;
      animation: fadeUp 0.4s ease-out forwards;
    }
    @keyframes fadeUp {
      to { opacity: 1; }
    }
    .count-up:nth-child(1)  { animation-delay: 0.3s; }
    .count-up:nth-child(2)  { animation-delay: 0.45s; }
    .count-up:nth-child(3)  { animation-delay: 0.6s; }
    .count-up:nth-child(4)  { animation-delay: 0.75s; }
    .count-up:nth-child(5)  { animation-delay: 0.9s; }
    .count-up:nth-child(6)  { animation-delay: 1.05s; }
    .count-up:nth-child(7)  { animation-delay: 1.2s; }
    .count-up:nth-child(8)  { animation-delay: 1.35s; }
  </style>
</head>
<body>

  <!-- Corner brackets -->
  <div class="corner tl">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 40 L2 2 L40 2" stroke="rgba(0,255,65,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="2" cy="2" r="2" fill="#00ff41"/>
    </svg>
  </div>
  <div class="corner tr">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 40 L2 2 L40 2" stroke="rgba(0,255,65,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="2" cy="2" r="2" fill="#00ff41"/>
    </svg>
  </div>
  <div class="corner bl">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 40 L2 2 L40 2" stroke="rgba(0,255,65,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="2" cy="2" r="2" fill="#00ff41"/>
    </svg>
  </div>
  <div class="corner br">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 40 L2 2 L40 2" stroke="rgba(0,255,65,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="2" cy="2" r="2" fill="#00ff41"/>
    </svg>
  </div>

  <div class="terminal">

    <!-- macOS-style title bar -->
    <div class="titlebar">
      <div class="dots">
        <div class="dot r"></div>
        <div class="dot y"></div>
        <div class="dot g"></div>
      </div>
      <div class="titlebar-text">
        payroll_sys@hr-terminal:~$ <span>decrypt --emp=${empId} --verify</span>
      </div>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="prompt-line">
        <span class="prompt">root@payroll-sys:~$</span>
        <span class="cmd">fetch compensation_record --id=${empId} --format=terminal</span>
        <span class="cursor"></span>
      </div>
      <div class="sys-title">PAYROLL_TERMINAL</div>
      <div class="sys-subtitle">COMPENSATION_RECORD v2.0 &nbsp;|&nbsp; PERIOD: ${timestamp} &nbsp;|&nbsp; ACCESS: AUTHORIZED</div>
    </div>

    <!-- Employee info -->
    <div class="emp-block">
      <div class="emp-field">
        <div class="emp-key">EMPLOYEE_NAME</div>
        <div class="emp-val glitch" data-text="${emp.name}">${emp.name}</div>
      </div>
      <div class="emp-field">
        <div class="emp-key">EMPLOYEE_ID</div>
        <div class="emp-val">EMP_${empId}</div>
      </div>
      <div class="emp-field">
        <div class="emp-key">DEPARTMENT_TYPE</div>
        <div class="emp-val">${emp.type}</div>
      </div>
    </div>

    <!-- Gross -->
    <div class="section">
      <div class="section-header">INCOME_RECORD <div class="line"></div></div>
      <div class="data-row count-up">
        <span class="row-key">GROSS_SALARY <span class="hex">${hex(emp.gross)}</span></span>
        <div class="row-dots"></div>
        <span class="row-val gross">¥ ${fmt(emp.gross)}</span>
      </div>
    </div>

    <!-- Social insurance -->
    <div class="section">
      <div class="section-header">DEDUCTIONS :: SOCIAL_INSURANCE <div class="line"></div></div>
      <div class="data-row count-up">
        <span class="row-key">PENSION_INSURANCE</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.pension)}</span>
      </div>
      <div class="data-row count-up">
        <span class="row-key">MEDICAL_INSURANCE</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.medical)}</span>
      </div>
      <div class="data-row count-up">
        <span class="row-key">UNEMPLOYMENT_INS</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.unemployment)}</span>
      </div>
      <div class="data-row count-up">
        <span class="row-key">CRITICAL_ILLNESS_INS</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.illness)}</span>
      </div>
      <div class="subtotal-row count-up">
        <span class="row-key">INSURANCE_SUBTOTAL</span>
        <div class="row-dots"></div>
        <span class="row-val sub">- ¥ ${fmt(emp.ins_total)}</span>
      </div>
    </div>

    <!-- Other deductions -->
    <div class="section">
      <div class="section-header">DEDUCTIONS :: OTHER <div class="line"></div></div>
      <div class="data-row count-up">
        <span class="row-key">HOUSING_PROVIDENT_FUND</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.housing)}</span>
      </div>
      <div class="data-row count-up">
        <span class="row-key">PERSONAL_INCOME_TAX</span>
        <div class="row-dots"></div>
        <span class="row-val deduct">- ¥ ${fmt(emp.other_tax)}</span>
      </div>
    </div>

    <!-- Net pay -->
    <div class="net-block">
      <div class="net-label">NET_TRANSFER_AMOUNT</div>
      <div class="net-amount">
        <span class="currency">¥</span>${fmt(emp.net)}
      </div>
      <div class="net-sub">
        TOTAL_DEDUCTIONS: ¥ ${fmt(totalDeductions)} &nbsp;|&nbsp;
        DEDUCTION_RATE: ${((totalDeductions / emp.gross) * 100).toFixed(1)}%
      </div>
    </div>

    <!-- Status bar -->
    <div class="statusbar">
      <div class="status-item">
        <div class="status-dot"></div>
        <span>VERIFIED</span>
      </div>
      <div class="status-item">SYS: HR_PAYROLL_v2</div>
      <div class="status-item">DATE: ${timestamp}</div>
      <div class="status-spacer"></div>
      <div class="checksum">CHECKSUM: ${checksum}</div>
    </div>

  </div>

</body>
</html>`;
}

employees.forEach(emp => {
  const filename = path.join(__dirname, `${emp.name}_工资条.html`);
  fs.writeFileSync(filename, generateHTML(emp), 'utf-8');
  console.log(`✓ 已生成：${emp.name}_工资条.html`);
});

console.log(`\n共生成 ${employees.length} 个工资条文件。`);
