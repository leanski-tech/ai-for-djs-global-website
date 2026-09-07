(function(){
  const labels={
    '/':'Home',
    '/analyzer':'AI Track Analyzer',
    '/chat':'AI Chat',
    '/contract':'Contract Generator',
    '/event-brief':'Event Brief',
    '/playbook':'The DJ\'s AI Playbook',
    '/prompts':'Prompt Library',
    '/tools':'AI Tools',
    '/blog':'Field Notes',
    '/equipment':'Equipment Guide',
    '/lineage':'DJ Lineage',
    '/schools':'DJ Schools',
    '/merch':'Merch',
    '/pricing':'Pricing',
    '/directory':'Directory',
    '/workflow':'Workflows'
  };

  if(!document.getElementById('afd-premium-frame-styles')){
    const style=document.createElement('style');
    style.id='afd-premium-frame-styles';
    style.textContent=`
      .afd-route-kicker{display:flex;align-items:center;gap:10px;margin:0 0 18px;color:#87969d;font:700 10px/1 'Barlow',Arial,sans-serif;letter-spacing:.19em;text-transform:uppercase}
      .afd-route-kicker span{color:#16e1ff}.afd-route-kicker i{color:#3c4b51;font-style:normal}.afd-route-kicker b{color:#aeb9be;font-weight:600}
      body[data-afd-route] main{isolation:isolate}
      body[data-afd-route] main:before{content:'';position:fixed;inset:0;z-index:-2;pointer-events:none;background:linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent 72%)}
      [aria-current='page']{position:relative;color:#16e1ff!important}
      [aria-current='page']:after{content:'';position:absolute;left:0;right:0;bottom:-8px;height:1px;background:#16e1ff}
      @media(max-width:768px){.afd-route-kicker{gap:7px;margin-bottom:14px;letter-spacing:.13em;flex-wrap:wrap}[aria-current='page']:after{display:none}}
    `;
    document.head.appendChild(style);
  }

  function cleanPath(){
    return window.location.pathname.replace(/\/+$/,'')||'/';
  }

  function applyPremiumFrame(){
    const path=cleanPath();
    const label=labels[path]||path.split('/').filter(Boolean).map(v=>v.replace(/-/g,' ')).join(' / ')||'Home';
    document.body.dataset.afdRoute=path==='/'?'home':path.slice(1).replace(/\//g,'-');

    document.querySelectorAll('.afd-route-kicker').forEach((el,i)=>{if(i>0)el.remove();});

    document.querySelectorAll('a[href]').forEach(a=>{
      const raw=a.getAttribute('href')||'';
      if(raw.startsWith('/')){
        const ap=(raw.split('?')[0].replace(/\/+$/,'')||'/');
        if(ap===path) a.setAttribute('aria-current','page');
        else if(a.getAttribute('aria-current')==='page') a.removeAttribute('aria-current');
      }
      if(/^https?:\/\//i.test(raw) && !raw.includes(location.hostname)){
        a.setAttribute('rel','noopener noreferrer');
      }
    });

    const main=document.querySelector('main')||document.querySelector('[role="main"]')||document.getElementById('root');
    if(!main) return;
    const h1=main.querySelector('h1');
    if(h1 && !main.querySelector('.afd-route-kicker')){
      const kicker=document.createElement('div');
      kicker.className='afd-route-kicker';
      const brand=document.createElement('span');brand.textContent='AI FOR DJS GLOBAL';
      const slash=document.createElement('i');slash.textContent='/';
      const page=document.createElement('b');page.textContent=label;
      kicker.append(brand,slash,page);
      h1.parentNode.insertBefore(kicker,h1);
    }

    document.documentElement.classList.add('afd-premium-ready');
  }

  let queued=false;
  function schedule(){
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;applyPremiumFrame();});
  }

  const push=history.pushState;
  history.pushState=function(){const r=push.apply(this,arguments);schedule();return r;};
  const replace=history.replaceState;
  history.replaceState=function(){const r=replace.apply(this,arguments);schedule();return r;};
  window.addEventListener('popstate',schedule);
  window.addEventListener('DOMContentLoaded',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})();
