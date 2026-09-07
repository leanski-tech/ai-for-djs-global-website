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

  function cleanPath(){
    let p=window.location.pathname.replace(/\/+$/,'')||'/';
    return p;
  }

  function applyPremiumFrame(){
    const path=cleanPath();
    const label=labels[path]||path.split('/').filter(Boolean).map(v=>v.replace(/-/g,' ')).join(' / ')||'Home';
    document.body.dataset.afdRoute=path==='/'?'home':path.slice(1).replace(/\//g,'-');

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
      kicker.innerHTML='<span>AI FOR DJS GLOBAL</span><i>/</i><b>'+label.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</b>';
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
