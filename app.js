(function(){
  var items=['약 복용 확인','식사','산책/운동','통화 안부','병원 일정'];
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  var K='fc_day_'+dayKey(0);
  var NK='fc_note_'+dayKey(0);
  var done=JSON.parse(localStorage.getItem(K)||'[]');
  var note=localStorage.getItem(NK)||'';
  var root=document.getElementById('app');

  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
      var t=dayKey(0), y=dayKey(-1);
      if(st.last===t) return st;
      st.count=(st.last===y)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('fc_streak',JSON.stringify(st));
      return st;
    }catch(e){return {count:0};}
  }
  function weekHist(){
    var out=[];
    for(var i=6;i>=0;i--){
      var k=dayKey(-i);
      var d=JSON.parse(localStorage.getItem('fc_day_'+k)||'[]');
      out.push({k:k.slice(5), n:d.length, full:d.length>=items.length});
    }
    return out;
  }
  function render(){
    var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
    var sc=st.count||0;
    var pct=Math.round(done.length/items.length*100);
    var hist=weekHist();
    root.innerHTML='<div class="card"><b>오늘 케어</b> '+done.length+'/'+items.length+' · 완료율 '+pct+'%'
      +' <span class="chip">🔥 '+sc+'일</span>'
      +'<div class="bar"><i style="width:'+pct+'%;background:'+(pct>=100?'var(--ok)':'var(--gold)')+'"></i></div></div>'
      +'<div class="card" id="list"></div>'
      +'<div class="card"><label class="sub">오늘 메모</label><textarea id="note" rows="2" placeholder="약 시간, 특이사항…">'+note.replace(/</g,'&lt;')+'</textarea>'
      +'<button id="saveNote" class="sec" style="margin-top:6px">메모 저장</button></div>'
      +'<div class="card"><b>7일 히트맵</b><div class="row" style="margin-top:8px;gap:4px">'
      +hist.map(function(h){return '<span class="chip" style="'+(h.full?'background:#166534;color:#bbf7d0':'')+'">'+h.k+' '+h.n+'/5</span>';}).join('')
      +'</div></div>'
      +'<button id="shareCare" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">오늘 케어 공유</button>'
      +'<div style="margin-top:12px;text-align:center;font-size:12px">'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=care&utm_medium=pipe">🎮 Arcade</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/budget-pulse/?utm_source=care&utm_medium=pipe">💰 Budget</a>'
      +'</div>';

    document.getElementById('list').innerHTML=items.map(function(c,i){
      return '<label style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #2a2438"><input type="checkbox" data-i="'+i+'" '+(done.indexOf(i)>=0?'checked':'')+'> '+c+'</label>';
    }).join('');
    document.querySelectorAll('input[data-i]').forEach(function(inp){
      inp.onchange=function(){
        var i=+inp.dataset.i;
        if(inp.checked){if(done.indexOf(i)<0)done.push(i);} else done=done.filter(function(x){return x!==i;});
        localStorage.setItem(K,JSON.stringify(done));
        if(done.length>=items.length){
          bumpStreak();
          var bk='fc_bonus_'+dayKey(0);
          if(!localStorage.getItem(bk)){localStorage.setItem(bk,'1'); try{legionTrack('activate',{all:1})}catch(e){}}
        }
        render(); try{legionTrack('activate',{})}catch(e){}
      };
    });
    document.getElementById('saveNote').onclick=function(){
      note=document.getElementById('note').value||'';
      localStorage.setItem(NK,note);
      try{legionTrack('note_save',{})}catch(e){}
      var b=document.getElementById('saveNote'); b.textContent='저장됨 ✓'; setTimeout(function(){b.textContent='메모 저장';},1200);
    };
    document.getElementById('shareCare').onclick=function(){
      var text='Family Care '+done.length+'/5 · 🔥'+sc+'일 · https://hosuman08-netizen.github.io/family-care/';
      if(navigator.share) navigator.share({text:text}).catch(function(){});
      else if(navigator.clipboard) navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
