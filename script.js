const canvas  = document.getElementById('screen');
const ctx     = canvas.getContext('2d');
const loadBtn = document.getElementById('loadBtn');
const romInput= document.getElementById('romInput');
const sysSel  = document.getElementById('sys');

let emu, romData, currentSys='nes', loop;

/* ---------- canvas size helper ---------- */
function setSize(w,h){canvas.width=w;canvas.height=h}
function setCanvas(w,h){
  setSize(w,h);
  const s=Math.min(window.innerWidth/w,(window.innerHeight*0.6)/h);
  canvas.style.width=(w*s)+'px'; canvas.style.height=(h*s)+'px';
}

/* ---------- NES ---------- */
function startNES(buf){
  setCanvas(256,240);
  emu = new jsnes.NES({
    onFrame: f=>ctx.putImageData(new ImageData(f,256,240),0,0),
    onAudioSample:()=>{}
  });
  emu.loadROM(buf);
  loop=()=>{emu.frame();requestAnimationFrame(loop)};
  requestAnimationFrame(loop);
}

/* ---------- Genesis ---------- */
function startGEN(buf){
  setCanvas(320,224);
  GenPlusGX({rom:buf,canvas:canvas,sound:false});
}

/* ---------- Neo-Geo ---------- */
function startNEO(buf){
  setCanvas(320,224);
  NeoGeo({rom:buf,canvas:canvas,sound:false});
}

/* ---------- loader ---------- */
function loadROM(buffer){
  romData=new Uint8Array(buffer);
  if(currentSys==='nes') startNES(romData);
  else if(currentSys==='gen') startGEN(romData);
  else startNEO(romData);
}
sysSel.onchange=()=>{currentSys=sysSel.value};

loadBtn.onclick=()=>romInput.click();
romInput.onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>loadROM(r.result);
  r.readAsArrayBuffer(f);
};

/* ---------- touch controls ---------- */
document.querySelectorAll('#touchControls button').forEach(btn=>{
  const k=parseInt(btn.dataset.key);
  ['touchstart','mousedown'].forEach(ev=>btn.addEventListener(ev,e=>{
    e.preventDefault(); if(emu&&emu.buttonDown) emu.buttonDown(1,k);
  }));
  ['touchend','mouseup'].forEach(ev=>btn.addEventListener(ev,e=>{
    e.preventDefault(); if(emu&&emu.buttonUp) emu.buttonUp(1,k);
  }));
});