let deferredInstallPrompt = null;

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

  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
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
  document.addEventListener('DOMContentLoaded', showInstallGuide);
} else {
  showInstallGuide();
}
