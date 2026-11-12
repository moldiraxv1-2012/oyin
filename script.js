(() => {
  'use strict';
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlay = document.getElementById('overlay');
  const titleEl = document.getElementById('overlayTitle');
  const textEl = document.getElementById('overlayText');
  const iconEl = document.getElementById('overlayIcon');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const SIZE = 21, CELL = canvas.width / SIZE;
  const KEY = 'jilan-oyini-best-score';
  let snake, food, direction, nextDirection, score, best = Number(localStorage.getItem(KEY)) || 0;
  let running = false, paused = false, timer = null, speed = 130;
  bestEl.textContent = best;

  function randomFood() {
    let p;
    do { p = {x: Math.floor(Math.random()*SIZE), y: Math.floor(Math.random()*SIZE)}; }
    while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  }
  function reset() {
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    direction = {x:1,y:0}; nextDirection = {...direction};
    score = 0; speed = 130; scoreEl.textContent = score; food = randomFood();
  }
  function draw() {
    ctx.fillStyle = '#081321'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(83,125,157,.13)'; ctx.lineWidth = 1;
    for(let i=0;i<=SIZE;i++){const p=i*CELL;ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(canvas.width,p);ctx.stroke();}
    ctx.shadowBlur=17;ctx.shadowColor='#ff6489';ctx.fillStyle='#ff6489';
    ctx.beginPath();ctx.arc((food.x+.5)*CELL,(food.y+.5)*CELL,CELL*.31,0,Math.PI*2);ctx.fill();
    snake.forEach((part,i)=>{ctx.shadowColor='#42f5c5';ctx.shadowBlur=i===0?19:9;ctx.fillStyle=i===0?'#8affdf':'#42dcb5';const r=i===0?7:5;roundRect(ctx,part.x*CELL+2,part.y*CELL+2,CELL-4,CELL-4,r);ctx.fill();});
    ctx.shadowBlur=0;
    const head=snake[0];ctx.fillStyle='#06241d';ctx.beginPath();ctx.arc((head.x+.5)*CELL-4,(head.y+.5)*CELL-2,1.8,0,7);ctx.arc((head.x+.5)*CELL+4,(head.y+.5)*CELL-2,1.8,0,7);ctx.fill();
  }
  function roundRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);}
  function step() {
    if(!running||paused)return;
    direction=nextDirection;
    const head={x:snake[0].x+direction.x,y:snake[0].y+direction.y};
    const hitWall=head.x<0||head.y<0||head.x>=SIZE||head.y>=SIZE;
    const eating=head.x===food.x&&head.y===food.y;
    const body=eating?snake:snake.slice(0,-1);
    if(hitWall||body.some(s=>s.x===head.x&&s.y===head.y)){gameOver();return;}
    snake.unshift(head);
    if(eating){score+=10;scoreEl.textContent=score;food=randomFood();if(score>best){best=score;bestEl.textContent=best;localStorage.setItem(KEY,String(best));}speed=Math.max(65,130-Math.floor(score/30)*4);clearInterval(timer);timer=setInterval(step,speed);}else snake.pop();
    draw();
  }
  function showOverlay(icon,title,message,button){iconEl.textContent=icon;titleEl.textContent=title;textEl.textContent=message;startBtn.innerHTML=button+' <span>→</span>';overlay.classList.remove('hidden');}
  function start(){clearInterval(timer);reset();running=true;paused=false;pauseBtn.disabled=false;pauseBtn.textContent='Ⅱ TÍNÍS ALÍW';overlay.classList.add('hidden');draw();timer=setInterval(step,speed);}
  function gameOver(){running=false;clearInterval(timer);pauseBtn.disabled=true;showOverlay('🏁','OYÍN TAMAMLANDÍ',`Siz ${score} ball jıynadıńız. Taǵı bir márte sınap kóriń!`,'QAYTADAN OYNAW');}
  function togglePause(){if(!running)return;paused=!paused;if(paused){pauseBtn.textContent='▶ DAWAM ETIW';showOverlay('Ⅱ','TÍNÍS ALÍW','Dem alıń. Tayın bolsańız, oyındı dawam etiń.','DAWAM ETIW');}else{overlay.classList.add('hidden');pauseBtn.textContent='Ⅱ TÍNÍS ALÍW';}}
  function setDirection(name){const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};const d=dirs[name];if(!d||d.x===-direction.x&&d.y===-direction.y)return;nextDirection=d;}
  startBtn.addEventListener('click',()=>{if(paused){paused=false;overlay.classList.add('hidden');pauseBtn.textContent='Ⅱ TÍNÍS ALÍW';}else start();});
  pauseBtn.addEventListener('click',togglePause);
  document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();const map={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};if(map[k]){e.preventDefault();setDirection(map[k]);}if(k===' '){e.preventDefault();togglePause();}});
  document.querySelectorAll('[data-dir]').forEach(btn=>btn.addEventListener('click',()=>setDirection(btn.dataset.dir)));
  let touchStart=null;canvas.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY};},{passive:true});canvas.addEventListener('touchend',e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;if(Math.max(Math.abs(dx),Math.abs(dy))>24)setDirection(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touchStart=null;},{passive:true});
  reset();draw();
})();
