let deferredInstallPrompt = null;

const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta && !viewportMeta.content.includes('viewport-fit=cover')) {
  viewportMeta.content = `${viewportMeta.content}, viewport-fit=cover`;
}

function isStandaloneApp() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function installAppShell() {
  if (!isStandaloneApp() || document.querySelector('[data-afdj-app-shell]')) return;

  document.body.classList.add('is-standalone-app');

  const style = document.createElement('style');
  style.dataset.afdjAppShell = '1';
  style.textContent = `
    body.is-standalone-app{width:100%;max-width:100%;padding-bottom:calc(76px + env(safe-area-inset-bottom));overflow-x:hidden;overscroll-behavior-y:none;-webkit-tap-highlight-color:transparent}
    body.is-standalone-app .afdj-web-header{display:none!important}
    .afdj-app-top{position:sticky;top:0;z-index:9000;width:100%;height:calc(58px + env(safe-area-inset-top));padding:env(safe-area-inset-top) calc(18px + env(safe-area-inset-right)) 0 calc(18px + env(safe-area-inset-left));box-sizing:border-box;display:flex;align-items:center;gap:11px;background:color-mix(in srgb,var(--color-bg,#161826) 92%,transparent);border-bottom:1px solid rgba(255,255,255,.09);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
    .afdj-app-top img{width:30px;height:30px;border-radius:8px;box-shadow:0 0 20px rgba(145,132,217,.25)}
    .afdj-app-brand{display:grid;line-height:1.05}.afdj-app-brand b{font:600 14px/1.1 Inter,system-ui,sans-serif;letter-spacing:.02em;color:var(--color-text,#f4f3f8)}.afdj-app-brand span{margin-top:3px;font:500 9px/1 Inter,system-ui,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:var(--color-neutral-500,#9397ab)}
    .afdj-app-nav{position:fixed;left:calc(10px + env(safe-area-inset-left));right:calc(10px + env(safe-area-inset-right));bottom:calc(8px + env(safe-area-inset-bottom));z-index:9000;min-height:64px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:center;padding:5px;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:color-mix(in srgb,var(--color-surface,#232532) 94%,transparent);box-shadow:0 16px 46px rgba(0,0,0,.45);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
    .afdj-app-nav a{min-height:52px;display:grid;place-items:center;align-content:center;gap:4px;border-radius:13px;color:var(--color-neutral-500,#9397ab)!important;text-decoration:none!important;font:600 10px/1 Inter,system-ui,sans-serif;touch-action:manipulation}
    .afdj-app-nav a svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .afdj-app-nav a[aria-current="page"]{background:rgba(145,132,217,.16);color:var(--color-accent-300,#d2cefd)!important}
    body.is-standalone-app button,body.is-standalone-app a{touch-action:manipulation}
    @media (max-width:520px){
      body.is-standalone-app{--gut:16px!important;--gut-lg:16px!important;--sec:48px!important;--stack:22px!important}
      body.is-standalone-app main,body.is-standalone-app section{width:100%!important;max-width:100%!important;box-sizing:border-box}
      body.is-standalone-app img,body.is-standalone-app video,body.is-standalone-app canvas{max-width:100%!important;height:auto}
      body.is-standalone-app input,body.is-standalone-app textarea,body.is-standalone-app select{min-width:0!important;max-width:100%!important;box-sizing:border-box}
      body.is-standalone-app [style*="display: flex"]{min-width:0;max-width:100%;flex-wrap:wrap}
      body.is-standalone-app [style*="grid-template-columns"]{grid-template-columns:minmax(0,1fr)!important}
      body.is-standalone-app h1,body.is-standalone-app h2,body.is-standalone-app h3,body.is-standalone-app p{overflow-wrap:anywhere}
    }
    @media (min-width:760px){.afdj-app-nav{left:50%;right:auto;width:430px;transform:translateX(-50%)}}
  `;
  document.head.appendChild(style);

  const shell = document.createElement('div');
  shell.dataset.afdjAppShell = '1';
  shell.innerHTML = `
    <div class="afdj-app-top">
      <img src="/app-icon-192.png" alt="">
      <div class="afdj-app-brand"><b>AI For DJs Global</b><span>DJ tools and workflows</span></div>
    </div>
    <nav class="afdj-app-nav" aria-label="App navigation">
      <a href="/" data-app-route="home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8v9.4a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8Z"/><path d="M9 21v-7h6v7"/></svg><span>Home</span></a>
      <a href="/chat" data-app-route="chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z"/><path d="M8 9h8M8 13h5"/></svg><span>AI Chat</span></a>
      <a href="/analyzer" data-app-route="analyzer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg><span>Analyze</span></a>
      <a href="/tools" data-app-route="tools"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg><span>Tools</span></a>
    </nav>
  `;
  document.body.prepend(shell);

  const path = window.location.pathname.toLowerCase();
  const route = path.includes('chat') ? 'chat' : path.includes('analyzer') ? 'analyzer' : path.includes('tool') || path.includes('prompt') || path.includes('contract') || path.includes('event-brief') ? 'tools' : 'home';
  shell.querySelector(`[data-app-route="${route}"]`)?.setAttribute('aria-current', 'page');

  const hideWebsiteHeader = () => {
    document.querySelectorAll('header').forEach((header) => {
      if (header.querySelector('a[href*="Home.dc.html"],a[href="/"],a[href="./"]')) header.classList.add('afdj-web-header');
    });
  };
  hideWebsiteHeader();
  const observer = new MutationObserver(hideWebsiteHeader);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      registration.update();
    } catch (error) {
      console.warn('App installation support is unavailable.', error);
    }
  });
}

function showInstallGuide() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('install') !== '1') return;

  const standalone = isStandaloneApp();
  const isiPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const style = document.createElement('style');
  style.textContent = `
    .afdj-install-layer{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:18px;background:rgba(9,10,18,.82);backdrop-filter:blur(10px)}
    .afdj-install-card{width:min(520px,100%);padding:28px;border:1px solid var(--color-neutral-700,#595d6c);border-radius:14px;background:var(--color-surface,#232532);color:var(--color-text,#e9e9ed);box-shadow:0 22px 80px rgba(0,0,0,.55);font-family:Inter,system-ui,sans-serif}
    .afdj-install-card h2{margin:0 0 10px;font-size:clamp(28px,8vw,42px);font-weight:500;letter-spacing:-.03em}
    .afdj-install-card p{color:var(--color-neutral-300,#cfd3e5);line-height:1.55}
    .afdj-install-kicker{font-size:11px!important;letter-spacing:.18em;text-transform:uppercase;color:var(--color-accent,#9184d9)!important}
    .afdj-install-actions{display:grid;gap:10px;margin-top:22px}
    .afdj-install-primary,.afdj-install-secondary{min-height:46px;padding:12px 16px;border-radius:8px;font:500 15px Inter,system-ui,sans-serif;cursor:pointer}
    .afdj-install-primary{border:1px solid var(--color-accent,#9184d9);background:transparent;color:var(--color-accent-300,#d2cefd)}
    .afdj-install-secondary{border:1px solid rgba(233,233,237,.16);background:transparent;color:var(--color-text,#e9e9ed)}
    .afdj-install-note{margin:14px 0 0!important;font-size:13px;color:var(--color-neutral-500,#9397ab)!important}
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.className = 'afdj-install-layer';
  layer.innerHTML = `
    <section class="afdj-install-card" role="dialog" aria-modal="true" aria-labelledby="afdj-install-title">
      <p class="afdj-install-kicker">AI FOR DJS GLOBAL APP</p>
      <h2 id="afdj-install-title">${standalone ? 'The app is installed.' : 'Install the website as your app.'}</h2>
      <p id="afdj-install-copy">${standalone ? 'You are already using AI For DJs Global in app mode.' : isiPhone ? 'On iPhone: tap the Share button in Safari, choose Add to Home Screen, then tap Add.' : 'Tap Install App. The AI For DJs Global icon will appear on your phone.'}</p>
      <div class="afdj-install-actions">
        ${standalone || isiPhone ? '' : '<button class="afdj-install-primary" type="button" data-install>Install App</button>'}
        <button class="afdj-install-secondary" type="button" data-close>${standalone ? 'Continue' : 'Continue to the website'}</button>
      </div>
      <p class="afdj-install-note">The app uses the same website, design, pages and tools. Website updates appear automatically.</p>
    </section>
  `;
  document.body.appendChild(layer);

  const close = () => {
    layer.remove();
    const clean = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState({}, '', clean);
  };
  layer.querySelector('[data-close]').addEventListener('click', close);
  const installButton = layer.querySelector('[data-install]');
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        document.querySelector('#afdj-install-copy').textContent = 'Open your browser menu and choose Install app or Add to Home Screen.';
        return;
      }
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      if (result.outcome === 'accepted') close();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { installAppShell(); showInstallGuide(); });
} else {
  installAppShell();
  showInstallGuide();
}
