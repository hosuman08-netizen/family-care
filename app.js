
(function(){
  var items=['약 복용 확인','식사','산책/운동','통화 안부','병원 일정'];
  var K='fc_day_'+new Date().toDateString();
  var done=JSON.parse(localStorage.getItem(K)||'[]');
  var root=document.getElementById('app');
  function render(){
    root.innerHTML='<div class="card"><b>오늘 케어</b> '+done.length+'/'+items.length+'<div class="bar"><i style="width:'+(done.length/items.length*100)+'%"></i></div></div><div class="card" id="list"></div>';
    document.getElementById('list').innerHTML=items.map(function(c,i){
      return '<label style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #2a2438"><input type="checkbox" data-i="'+i+'" '+(done.indexOf(i)>=0?'checked':'')+'> '+c+'</label>';
    }).join('');
    document.querySelectorAll('input').forEach(function(inp){
      inp.onchange=function(){
        var i=+inp.dataset.i;
        if(inp.checked){if(done.indexOf(i)<0)done.push(i);} else done=done.filter(function(x){return x!==i;});
        localStorage.setItem(K,JSON.stringify(done)); 
        if(done.length>=items.length){
          var bk='fc_bonus_'+new Date().toDateString();
          if(!localStorage.getItem(bk)){localStorage.setItem(bk,'1'); try{legionTrack('activate',{all:1})}catch(e){}}
        }
        render(); try{legionTrack('activate',{})}catch(e){}
      };
    });
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
