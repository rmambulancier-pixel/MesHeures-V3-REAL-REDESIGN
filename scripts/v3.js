
/* MesHeures V3 UI layer — keeps the original business engine intact. */
(function(){
  const $id = id => document.getElementById(id);
  const fmt = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(n)||0);
  const dayLabel = k => new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(new Date(k+'T12:00:00'));

  function safeHome(){
    try{
      if(typeof DB==='undefined') return;
      const name=(DB.s?.nom||'').trim().split(/\s+/)[0]||'';
      $id('mh3Name').textContent=name ? name+' 👋' : '👋';
      $id('mh3Date').textContent=new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
      const k=today(), d=cd(k);
      const type=d.t==='T'?'Journée de travail':d.t==='CP'?'Congés payés':d.t==='RC'?'Repos compensateur':d.t==='NUIT'?'Service de nuit':'Repos / non saisi';
      $id('mh3TodayTitle').textContent=type;
      $id('mh3TodayHours').textContent=d.trav?F(d.tte):'—';
      $id('mh3TodayMeta').textContent=d.trav ? 'Amplitude '+F(d.amp)+' · '+(d.pz?F(d.pz)+' de pause':'aucune pause saisie') : 'Choisis ton type de journée puis saisis tes horaires.';
      const r=calcPer(DB.per.start,DB.per.nb), G=r.G, B=brutOf(G);
      $id('mh3PeriodTTE').textContent=F(G.tte);
      $id('mh3PeriodDays').textContent=G.trav+' jour'+(G.trav>1?'s':'')+' travaillé'+(G.trav>1?'s':'');
      $id('mh3PeriodHS').textContent=F((G.h25||0)+(G.h50||0));
      $id('mh3PeriodPay').textContent=fmt(B.tot);
      const crit=r.AL.filter(a=>a.lvl==='b');
      const warn=r.AL.filter(a=>a.lvl==='w');
      const panel=$id('mh3Alerts');
      if(!crit.length&&!warn.length){
        panel.innerHTML='<div class="mh3-alert-row"><span class="mh3-alert-dot"></span><div><b>Rien de critique détecté</b><small>Les contrôles actuels de la période ne signalent aucune anomalie.</small></div></div>';
      }else{
        const items=[...crit.slice(0,2),...warn.slice(0,2)].slice(0,3);
        panel.innerHTML=items.map(a=>'<div class="mh3-alert-row"><span class="mh3-alert-dot '+(a.lvl==='b'?'bad':'warn')+'"></span><div><b>'+a.k+'</b><small>'+a.m+'</small></div></div>').join('');
      }
      const days=[];
      for(let i=6;i>=0;i--){
        const key=addD(today(),-i), x=cd(key), dd=new Date(key+'T12:00:00');
        const dow=new Intl.DateTimeFormat('fr-FR',{weekday:'short'}).format(dd).replace('.','');
        days.push('<button onclick="goToV3Day(\''+key+'\')"><small>'+dow+'</small><b>'+dd.getDate()+'</b><em>'+ (x.trav?F(x.tte):(DB.days[key]?.t||'—')) +'</em></button>');
      }
      $id('mh3Recent').innerHTML=days.join('');
    }catch(e){ console.warn('MesHeures V3 home',e); }
  }

  window.goToV3Day=function(k){
    curDate=k;curMonth=k.slice(0,7);tab('jour');
  };

  function updateDayHero(){
    try{
      if(typeof curDate==='undefined'||typeof DB==='undefined') return;
      const d=cd(curDate), el=$id('mh3DayHero'); if(!el) return;
      const title=dayLabel(curDate); const type=d.t==='T'?'Service travaillé':d.t==='CP'?'Congé payé':d.t==='RC'?'Repos compensateur':d.t==='NUIT'?'Service de nuit':'Repos / à saisir';
      el.innerHTML='<div class="left"><small>'+title+'</small><b>'+type+'</b></div><div class="right"><strong>'+ (d.trav?F(d.tte):'—') +'</strong><small>'+ (d.trav?'Temps de travail effectif':'Sélectionne un type de journée') +'</small></div>';
    }catch(e){}
  }

  function updateNav(t){
    ['home','jour','paie','audit','more'].forEach(x=>{
      const b=$id('b-'+x); if(!b)return;
      b.classList.toggle('on',x==='more'?(t==='mois'||t==='bul'||t==='romi'||t==='reg'):x===t);
    });
  }

  window.addEventListener('load',function(){
    // Preserve the original tab engine. Only home is new.
    const legacyTab=window.tab;
    window.tab=function(t){
      if(t==='home'){
        if(typeof curTab!=='undefined') curTab='home';
        ['home','jour','mois','paie','audit','bul','romi','reg'].forEach(x=>{
          const s=$id('s-'+x), b=$id('t-'+x);
          if(s)s.classList.toggle('on',x==='home');
          if(b)b.classList.toggle('on',x==='home');
        });
        safeHome();updateNav('home');window.scrollTo({top:0,behavior:'smooth'});return;
      }
      legacyTab(t);
      updateNav(t);
      if(t==='jour') setTimeout(updateDayHero,0);
    };

    // Refresh V3 cards whenever the original renderer updates the day.
    const legacyRenderDay=window.renderDay;
    if(typeof legacyRenderDay==='function'){
      window.renderDay=function(){
        const r=legacyRenderDay.apply(this,arguments);
        updateDayHero();
        return r;
      };
    }

    safeHome();
    updateDayHero();
    // Start on the new dashboard.
    window.tab('home');
  });
})();
