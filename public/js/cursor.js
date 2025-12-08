// Custom cursor + particle trail on a canvas (no libs)
(() => {
  const cursor = document.getElementById('cursor');
  const cvs = document.getElementById('cursorTrail');
  if (!cursor || !cvs) return;

  const ctx = cvs.getContext('2d');
  let w, h; const DPR = Math.min(2, window.devicePixelRatio || 1);
  const particles = [];
  function resize(){
    w = cvs.width = innerWidth * DPR;
    h = cvs.height = innerHeight * DPR;
    cvs.style.width = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
    ctx.scale(DPR, DPR);
  }
  resize(); addEventListener('resize', resize);

  let x = innerWidth/2, y = innerHeight/2;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    for (let i=0;i<2;i++){
      particles.push({
        x, y, vx:(Math.random()-.5)*.8, vy:(Math.random()-.5)*.8,
        life: 1, r: Math.random()*2+1
      });
    }
  });

  function step(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      ctx.globalAlpha = Math.max(p.life,0);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = '#272D2D'; ctx.fill();
    });
    for (let i=particles.length-1;i>=0;i--) if (particles[i].life<=0) particles.splice(i,1);
    requestAnimationFrame(step);
  }
  step();
})();
