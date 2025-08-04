@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');
:root{--bg:#fff;--text:#111;--primary-start:#8A2BE2;--primary-end:#4169E1;--shadow:#111;--border-width:3px;--grey:#555;--light-grey:#f3f4f6;--response-bg:#0d0d0d;--response-text:#00ff7f;--green:#10B981;--red:#EF4444;--blue:#3B82F6;}
html,body{padding:0;margin:0;font-family:'Inter',sans-serif;background-color:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
.page-container{display:flex;flex-direction:column;min-height:100vh;}
.content-wrap{flex:1;}
main{max-width:900px;margin:0 auto;padding:0 1rem 5rem 1rem;}
a{color:inherit;text-decoration:none;} *{box-sizing:border-box;}
.site-header{position:relative;padding:1.5rem 1rem;max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;}
.site-header::after{content:'';position:absolute;bottom:0;left:0;width:50%;height:var(--border-width);background:var(--shadow);}
.site-logo-text{font-weight:900;font-size:1.75rem;}
.header-logo-wrapper{position:relative;width:60px;height:60px;}
.header-logo-wrapper::after{content:'';position:absolute;width:100%;height:100%;background-color:var(--shadow);top:6px;left:6px;z-index:-1;transition:all .2s ease;}
.header-logo-wrapper:hover::after{top:3px;left:3px;}
.text-gradient{background:linear-gradient(120deg,var(--primary-start) 0%,var(--primary-end) 100%);color:transparent;-webkit-background-clip:text;background-clip:text;}
.landing-main{text-align:center;padding-top:2rem;}
.intro-text-section{max-width:650px;margin:2rem auto 4rem auto;}
.intro-text-section h2{font-size:2.75rem;margin:0 0 1rem 0;font-weight:900;}
.intro-text-section p{color:var(--grey);line-height:1.7;margin:0;font-size:1.1rem;}
.landing-image-wrapper{position:relative;width:100%;max-width:450px;aspect-ratio:1/1;margin:0 auto 4rem auto;}
.explore-link-wrapper{position:absolute;top:59.5%;left:50%;transform:translate(-50%,-50%);width:41%;height:15.5%;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;transition:transform .2s ease-out;}
.explore-link-wrapper:hover{transform:translate(-50%,-50%) scale(1.05);}
.explore-text{font-weight:900;font-size:clamp(0.8rem,3.5vw,1.3rem);color:var(--text);}
.thanks-section h2{font-size:2.5rem;margin-bottom:2rem;}
.thanks-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem 2.5rem;}
.thanks-item h3{margin:0;font-size:1.1rem;font-weight:900;}.thanks-item p{margin:0.2rem 0 0;font-size:0.9rem;color:var(--grey);}
input.neo-input,select.neo-input{width:100%;padding:10px 12px;font-size:0.95rem;border:var(--border-width) solid var(--shadow);background:var(--bg);transition:all .2s ease;border-radius:0;}
.select-wrapper{position:relative;}.select-wrapper::after{content:'▼';font-size:0.8rem;position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--grey);}
.neo-input:focus{outline:none;border-color:var(--primary-start);box-shadow:0 0 0 3px var(--primary-start);}
button.neo-button{padding:8px 16px;font-size:0.9rem;border:var(--border-width) solid var(--shadow);background:var(--bg);font-weight:700;cursor:pointer;transition:all .2s ease;border-radius:0;}
button.neo-button:hover{box-shadow:4px 4px 0 var(--shadow);transform:translate(-2px,-2px);}
button.neo-button:active{box-shadow:1px 1px 0 var(--shadow);transform:translate(1px,1px);}
.button-group{display:flex;gap:.8rem;margin-top:1.5rem;}
.docs-header{padding:0 1rem;}
.docs-main{position:relative;max-width:800px;}.docs-intro{margin-bottom:3rem;}.docs-intro h1{font-size:clamp(2.5rem,8vw,3.5rem);margin-bottom:1rem;}
.docs-intro p{font-size:1.1rem;line-height:1.6;color:var(--grey);}
.peeking-image{position:fixed;top:0;right:0;width:250px;height:auto;z-index:10;pointer-events:none;}
@media (max-width: 1100px){.peeking-image{display:none;}}
.category-filters{display:flex;gap:.8rem;margin-bottom:2.5rem;flex-wrap:wrap;}
.category-button{padding:8px 16px;font-size:0.9rem;font-weight:700;background:var(--bg);border:var(--border-width) solid var(--shadow);cursor:pointer;transition:all .2s ease;}
.category-button:hover{box-shadow:3px 3px 0 var(--shadow);transform:translate(-2px,-2px);}
.category-button.active{background:var(--shadow);color:var(--bg);box-shadow:none;transform:none;}
.api-list{display:flex;flex-direction:column;gap:1.5rem;}
.api-doc-card{border:var(--border-width) solid var(--shadow);transition:box-shadow .2s ease;overflow:hidden;}
.api-doc-header{background:var(--bg);width:100%;padding:1rem 1.2rem;border:none;display:flex;justify-content:space-between;align-items:center;text-align:left;cursor:pointer;}
.api-header-left{display:flex;align-items:center;gap:1rem;}
.api-title-bg{background:var(--light-grey);padding:0.3rem 0.8rem;border:var(--border-width) solid var(--shadow);}.api-title-bg span{font-size:1.25rem;font-weight:900;}
.api-header-right{display:flex;align-items:center;gap:1rem;}
.api-category-tag{background-color:#eef2ff;color:var(--primary-end);padding:4px 8px;border-radius:4px;font-weight:700;font-size:.8rem;}
.api-toggle{font-size:1rem;transition:transform .3s ease;color:var(--grey);}.api-toggle.open{transform:rotate(180deg);}
.api-doc-content-wrapper{overflow:hidden;}
.api-doc-content{padding:1.5rem;border-top:var(--border-width) solid #eee;}.api-description{margin-top:0;margin-bottom:1.5rem;color:var(--grey);}
.param-group{margin-bottom:1rem;}.param-group label{display:block;font-weight:700;margin-bottom:0.5rem;}
.result-section{margin-top:1.5rem;}.result-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;}.result-header h4{margin:0;font-size:1rem;}
.response-status{font-weight:900;font-family:'Fira Code',monospace;font-size:.9rem;padding:2px 8px;}
.response-status.status-2{color:var(--green);}
.response-status.status-4,.response-status.status-5{color:var(--red);}
.result-box{background-color:var(--response-bg);border:var(--border-width) solid var(--shadow);padding:1rem;position:relative;margin-top:.5rem;}
.code-box pre{margin:0;font-family:'Fira Code',monospace;white-space:pre-wrap;word-break:break-all;overflow-x:auto;max-height:400px;color:var(--response-text);font-size:.85rem;}
.copy-button{background:#333;color:#fff;border:none;padding:4px 8px;font-size:.8rem;font-weight:bold;cursor:pointer;position:absolute;top:10px;right:10px;transition:all .2s ease;border-radius:4px;}
.copy-button:hover{background:#444;}
.possible-responses-table{width:100%;border-collapse:collapse;margin-top:1.5rem;font-size:0.9rem;}
.possible-responses-table th,.possible-responses-table td{text-align:left;padding:8px;border-bottom:2px solid var(--light-grey);}
.possible-responses-table th{font-weight:900;}
.status-code-box{font-family:'Fira Code',monospace;font-weight:700;padding:2px 6px;border-radius:3px;color:var(--bg);}
.status-code-box.code-2xx{background-color:var(--green);}
.status-code-box.code-4xx{background-color:var(--blue);}
.status-code-box.code-5xx{background-color:var(--red);}
.loading-indicator{display:flex;justify-content:center;align-items:center;height:50px;}.loading-indicator span{display:inline-block;width:8px;height:8px;border-radius:50%;background-color:var(--primary-start);margin:0 4px;animation:loading-dots 1.4s infinite ease-in-out both;}
.loading-indicator span:nth-child(1){animation-delay:-.32s;}.loading-indicator span:nth-child(2){animation-delay:-.16s;}
@keyframes loading-dots{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
.site-footer{text-align:center;padding:2rem 1rem;border-top:var(--border-width) solid #eee;font-weight:700;color:var(--grey);}
.floating-whatsapp-btn{position:fixed;bottom:20px;right:20px;width:55px;height:55px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:4px 4px 0 var(--shadow);border:var(--border-width) solid var(--shadow);z-index:1000;transition:all .2s ease;overflow:hidden;}
.floating-whatsapp-btn img{width:100%;height:100%;object-fit:cover;}
.floating-whatsapp-btn:hover{transform:translateY(-3px) scale(1.05);box-shadow:6px 6px 0 var(--shadow);}
