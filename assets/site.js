
(function(){
  var doc=document, root=doc.documentElement;
  var SUN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>', MOON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
  function isDark(){return root.getAttribute('data-theme')==='dark';}
  function updateThemeBtn(){var b=doc.querySelector('[data-theme-toggle]');if(!b)return;
    var d=isDark();b.setAttribute('aria-label',d?'Switch to light theme':'Switch to dark theme');
    b.innerHTML=d?SUN:MOON;}
  doc.addEventListener('click',function(e){
    var tt=e.target.closest('[data-theme-toggle]');
    if(tt){root.setAttribute('data-theme',isDark()?'light':'dark');updateThemeBtn();return;}
    var nt=e.target.closest('[data-nav-toggle]');
    if(nt){var l=doc.getElementById('nav-links');if(l){var o=l.classList.toggle('open');
      nt.setAttribute('aria-expanded',o);}return;}
  });
  var header=doc.querySelector('.site-header');
  function onScroll(){if(header)header.classList.toggle('is-scrolled',window.scrollY>4);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var io=null;
  function initReveal(){var els=doc.querySelectorAll('.reveal:not(.is-visible)');
    if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('is-visible');});return;}
    if(!io){io=new IntersectionObserver(function(en){en.forEach(function(x){
      if(x.isIntersecting){x.target.classList.add('is-visible');io.unobserve(x.target);}});},
      {rootMargin:'0px 0px -8% 0px',threshold:.08});}
    els.forEach(function(el){io.observe(el);});}
  function initForms(){doc.querySelectorAll('[data-form]').forEach(function(f){
    if(f.__bound)return;f.__bound=true;
    f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
      f.querySelectorAll('[required]').forEach(function(i){if(!String(i.value).trim()){ok=false;
        i.setAttribute('aria-invalid','true');}else i.removeAttribute('aria-invalid');});
      if(!ok){var fi=f.querySelector('[aria-invalid="true"]');if(fi)fi.focus();return;}
      var s=f.parentNode.querySelector('[data-success]');if(s)s.classList.add('show');
      try{f.reset();}catch(_){} f.style.display='none';});});}
  function initSearch(){var inp=doc.getElementById('search-input');if(!inp)return;
    var res=doc.getElementById('search-results'),count=doc.getElementById('search-count'),
        empty=doc.getElementById('search-empty'),none=doc.getElementById('search-none');
    var cards=res?[].slice.call(res.children):[];var activeCat='all';
    function apply(){var q=inp.value.trim().toLowerCase();var shown=0;
      cards.forEach(function(c){var hay=c.getAttribute('data-haystack')||'';var cat=c.getAttribute('data-cat')||'';
        var vis=(!q||hay.indexOf(q)>-1)&&(activeCat==='all'||cat===activeCat);
        c.style.display=vis?'':'none';if(vis)shown++;});
      if(count)count.textContent=(q||activeCat!=='all')?(shown+' '+(shown===1?'result':'results')):'';
      if(empty)empty.style.display=(!q&&activeCat==='all')?'':'none';
      if(none)none.style.display=((q||activeCat!=='all')&&shown===0)?'':'none';}
    inp.addEventListener('input',apply);
    doc.querySelectorAll('[data-chip]').forEach(function(ch){ch.addEventListener('click',function(){
      activeCat=ch.getAttribute('data-chip');
      doc.querySelectorAll('[data-chip]').forEach(function(x){x.setAttribute('aria-pressed',x===ch);});
      apply();});});
    var pre=new URLSearchParams(window.location.search).get('q');if(pre){inp.value=pre;}
    apply();}
  function initYear(){doc.querySelectorAll('[data-year]').forEach(function(e){
    e.textContent=new Date().getFullYear();});}
  function initPage(){initReveal();initForms();initSearch();initYear();updateThemeBtn();}
  window.__initPage=initPage;
  if(doc.readyState!=='loading')initPage();else doc.addEventListener('DOMContentLoaded',initPage);
})();
