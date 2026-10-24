(function(){
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var root=document.documentElement, reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tema claro/escuro */
  var btnTema=$('#tema');
  function rotulo(){btnTema.textContent=root.dataset.tema==='escuro'?'Modo claro':'Modo escuro'}
  rotulo();
  btnTema.addEventListener('click',function(){
    root.dataset.tema=root.dataset.tema==='escuro'?'claro':'escuro';
    try{localStorage.setItem('tema',root.dataset.tema)}catch(e){}
    rotulo();
  });

  /* Menu mobile */
  var menu=$('#menu'), btnMenu=$('#btnMenu');
  btnMenu.addEventListener('click',function(){
    var a=menu.classList.toggle('aberto'); btnMenu.setAttribute('aria-expanded',a);
  });
  $$('a',menu).forEach(function(l){l.addEventListener('click',function(){menu.classList.remove('aberto');btnMenu.setAttribute('aria-expanded',false)})});

  /* Cabeçalho com fundo ao rolar + ano automático */
  var topo=$('#topo');
  function rolou(){topo.classList.toggle('scrolled',scrollY>20)}
  addEventListener('scroll',rolou,{passive:true}); rolou();
  $('#ano').textContent=new Date().getFullYear();

  /* Elementos aparecem ao rolar */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}})},{threshold:.12});
  $$('.rev').forEach(function(el){io.observe(el)});

  /* Hero: brilho e foto seguem o cursor */
  var hero=$('#inicio'), foto=$('#foto');
  if(!reduz && matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove',function(e){
      var r=hero.getBoundingClientRect();
      hero.style.setProperty('--mx',(e.clientX-r.left)+'px');
      hero.style.setProperty('--my',(e.clientY-r.top)+'px');
      var x=(e.clientX/innerWidth-.5)*10, y=(e.clientY/innerHeight-.5)*10;
      foto.style.transform='perspective(800px) rotateY('+x+'deg) rotateX('+(-y)+'deg)';
    });
    hero.addEventListener('pointerleave',function(){foto.style.transform=''});
  }

  /* Imagens ausentes: mostra aviso do arquivo esperado */
  $$('img[data-fallback]').forEach(function(img){
    function falhou(){(img.closest('[data-arquivo]')||img.parentElement).classList.add('missing');}
    if(img.complete && img.naturalWidth===0) falhou();
    img.addEventListener('error',falhou);
  });

  /* Foto de perfil ausente: some e deixa as iniciais */
  var fp=$('img',foto); fp.addEventListener('error',function(){fp.remove()});

  /* Animação: toca quando visível, pausa quando sai */
  var vid=$('video[data-autoplay]');
  new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){var p=vid.play(); if(p&&p.catch)p.catch(function(){})} else vid.pause();
  })},{threshold:.5}).observe(vid);

  /* Música: disco e equalizador reagem ao play/pause */
  var pl=$('#player'), palco=$('#palco');
  pl.addEventListener('play',function(){palco.classList.add('tocando')});
  ['pause','ended'].forEach(function(ev){pl.addEventListener(ev,function(){palco.classList.remove('tocando')})});

  /* Infográfico ampliado */
  var dlg=$('#zoomDlg');
  function abrir(){if(dlg.showModal)dlg.showModal()}
  $('#ampliar').addEventListener('click',abrir);
  $('#infoImg').addEventListener('click',abrir);
  $('#fechar').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
})();
