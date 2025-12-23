/* style.css - Comfortable Hacker Theme */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'); /* للأرقام */

:root {
    --bg-color: #0d1117;       /* رمادي مزرق داكن جداً (مريح للعين) */
    --panel-bg: #161b22;       /* لون البطاقات */
    --accent-green: #2ea043;   /* أخضر هادئ احترافي */
    --accent-glow: rgba(46, 160, 67, 0.15);
    --text-main: #c9d1d9;      /* أبيض مائل للرمادي للقراءة */
    --text-dim: #8b949e;       /* نص فرعي */
    --border: #30363d;
}

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: 'Cairo', sans-serif;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    direction: rtl;
    background-image: radial-gradient(#1f2428 1px, transparent 1px);
    background-size: 20px 20px; /* نقاط خلفية هادئة */
}

.container {
    background-color: var(--panel-bg);
    padding: 2.5rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
    width: 90%;
    max-width: 450px;
    text-align: center;
    position: relative;
}

/* عنوان بلمسة تقنية */
h2 {
    color: var(--accent-green);
    margin-bottom: 25px;
    font-weight: 700;
    border-bottom: 1px solid var(--border);
    padding-bottom: 15px;
    letter-spacing: 1px;
}

label.title {
    display: block; text-align: right; margin: 15px 0 8px;
    color: var(--text-dim); font-size: 0.9rem;
}

/* الحقول والأزرار */
textarea, input[type="text"] {
    width: 100%;
    background: #0d1117;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
    color: var(--accent-green);
    font-family: 'Roboto Mono', monospace; /* خط رقمي */
    transition: 0.3s;
    outline: none;
}

textarea:focus, input:focus {
    border-color: var(--accent-green);
    box-shadow: 0 0 0 3px var(--accent-glow);
}

/* الأزرار */
button {
    width: 100%; padding: 14px; margin-top: 20px;
    background: var(--accent-green);
    color: #fff; border: none; border-radius: 6px;
    font-weight: bold; font-size: 16px; cursor: pointer;
    font-family: 'Cairo', sans-serif;
    transition: 0.2s;
}

button:hover {
    background: #3fb950;
    transform: translateY(-1px);
}

button:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }

.secondary-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-dim);
}
.secondary-btn:hover { border-color: var(--text-main); color: var(--text-main); background: transparent; }

/* === تصميم صفحة العرض (App) === */
.monitor-screen {
    background: #000;
    border: 1px solid #333;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    font-family: 'Roboto Mono', monospace;
    position: relative;
}

.big-number {
    font-size: 3.5rem;
    color: var(--accent-green);
    font-weight: bold;
    text-shadow: 0 0 10px rgba(46, 160, 67, 0.4);
    margin: 10px 0;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: #21262d;
    margin-top: 15px;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--accent-green);
    width: 100%;
    transition: width 0.1s linear; /* حركة ناعمة */
}

/* تصميم خانات الرفع */
.upload-box {
    border: 1px dashed var(--border);
    background: #0d1117; padding: 20px;
    border-radius: 6px; cursor: pointer;
    color: var(--text-dim); transition: 0.3s;
    display: flex; flex-direction: column; align-items: center;
}
.upload-box:hover { border-color: var(--accent-green); color: var(--accent-green); }
.upload-box.uploaded { border-style: solid; border-color: var(--accent-green); color: var(--accent-green); }

.hidden { display: none; }
input[type="file"] { display: none; }
