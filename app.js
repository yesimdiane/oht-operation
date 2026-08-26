
function q(sel){return document.querySelector(sel)}
function qa(sel){return [...document.querySelectorAll(sel)]}

qa('[data-tab]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    qa('[data-tab]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
  });
});

qa('[data-review-next]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const steps=qa('.review-step');
    let i=steps.findIndex(s=>s.classList.contains('active'));
    if(i<steps.length-1){steps[i].classList.remove('active');steps[i+1].classList.add('active');updateStep();}
  });
});
qa('[data-review-prev]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const steps=qa('.review-step');
    let i=steps.findIndex(s=>s.classList.contains('active'));
    if(i>0){steps[i].classList.remove('active');steps[i-1].classList.add('active');updateStep();}
  });
});
function updateStep(){
  const steps=qa('.review-step');
  const i=steps.findIndex(s=>s.classList.contains('active'));
  const counter=q('#review-counter');
  if(counter) counter.textContent=`${i+1} / ${steps.length}`;
}
updateStep();

qa('[data-approve]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const card=btn.closest('.decision-card');
    if(card){ card.querySelector('.status').textContent='APPROVED'; card.querySelector('.status').className='status ready'; }
  });
});
qa('[data-ready]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target=document.getElementById(btn.dataset.ready);
    if(target){target.textContent='READY TO EXECUTE';target.className='status ready';}
  });
});
