const tabs=[...document.querySelectorAll('.tab')];
const panels=[...document.querySelectorAll('.panel')];
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  tabs.forEach(item=>item.classList.toggle('active',item===tab));
  panels.forEach(panel=>panel.classList.toggle('active',panel.id===tab.dataset.tab));
}));

let installPrompt=null;
const installButton=document.querySelector('#installButton');
const installHelp=document.querySelector('#installHelp');
const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
if(isStandalone){
  installButton.textContent='Installed';
  installButton.disabled=true;
}
window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  installPrompt=event;
});
installButton.addEventListener('click',async()=>{
  if(isStandalone)return;
  if(installPrompt){
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt=null;
    return;
  }
  installHelp.hidden=false;
});
document.querySelector('#closeHelp').addEventListener('click',()=>installHelp.hidden=true);
installHelp.addEventListener('click',event=>{if(event.target===installHelp)installHelp.hidden=true});

if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    const registration=await navigator.serviceWorker.register('/service-worker.js',{scope:'/'});
    registration.update();
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      const toast=document.querySelector('#updateToast');
      toast.hidden=false;
      setTimeout(()=>toast.hidden=true,1800);
    });
  });
}
