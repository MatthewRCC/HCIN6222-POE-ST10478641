const TOTAL=24;
const bays=[];
const occupiedStart=[2,4,5,8,10,12,14,15,17,19,21,23];
for(let i=1;i<=TOTAL;i++){const area=i<=12?'A':'B';const n=String(i<=12?i:i-12).padStart(2,'0');bays.push({id:area+n,area,occupied:occupiedStart.includes(i)});}
let selected=bays.find(b=>!b.occupied).id;
const $=id=>document.getElementById(id);
const status=b=>b.occupied?'Occupied':'Available';
function renderBays(){
  $('bays').innerHTML='';
  bays.filter(b=>$('area').value==='all'||b.area===$('area').value).forEach(b=>{
    const btn=document.createElement('button');btn.type='button';
    btn.className='bay'+(b.occupied?' occupied':'')+(b.id===selected?' selected':'');
    btn.setAttribute('aria-pressed',String(b.id===selected));
    btn.setAttribute('aria-label',`Bay ${b.id}, ${status(b)}. Select to view details.`);
    btn.innerHTML=`<span aria-hidden="true">${b.occupied?'▰':'P'}</span><span>${b.id}</span><span class="state">${status(b)}</span>`;
    btn.addEventListener('click',()=>{selected=b.id;render();$('live').textContent=`Bay ${b.id} selected. Status: ${status(b)}.`;});
    $('bays').appendChild(btn);
  });
}
function renderStats(){
  const occ=bays.filter(b=>b.occupied).length,free=TOTAL-occ,pct=Math.round(occ/TOTAL*100);
  $('available').textContent=free;$('occupied').textContent=occ;$('total').textContent=TOTAL;$('occupancy').textContent=pct;
  $('progress-fill').style.width=pct+'%';$('progress').setAttribute('aria-valuenow',pct);
}
function renderDetails(){
  const b=bays.find(x=>x.id===selected)||bays[0];
  $('bay-name').textContent='Bay '+b.id;$('bay-area').textContent='Area '+b.area;$('bay-number').textContent=b.id;
  $('bay-status').textContent=status(b);$('bay-status').className='pill'+(b.occupied?' occupied-pill':'');
  $('find').textContent=b.occupied?'Find an available bay':'Find another available bay';
}
function render(){renderBays();renderStats();renderDetails();}
function timestamp(message){$('last-updated').textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});$('live').textContent=message;}
$('area').addEventListener('change',()=>{const visible=bays.find(b=>$('area').value==='all'||b.area===$('area').value);if(visible&&!bays.find(b=>b.id===selected&&($('area').value==='all'||b.area===$('area').value)))selected=visible.id;render();$('live').textContent=$('area').value==='all'?'Showing all parking areas.':'Showing Area '+$('area').value+'.';});
$('refresh').addEventListener('click',()=>{const choices=bays.filter(b=>b.id!==selected);const b=choices[Math.floor(Math.random()*choices.length)];b.occupied=!b.occupied;render();timestamp(`Demo update: Bay ${b.id} is now ${status(b)}. These are simulated sensor readings.`);});
$('find').addEventListener('click',()=>{const b=bays.find(x=>!x.occupied&&x.id!==selected)||bays.find(x=>!x.occupied);if(!b){$('live').textContent='No available bays are shown in this demo.';return;}selected=b.id;$('area').value='all';render();$('live').textContent=`Available bay found: ${b.id}, Area ${b.area}.`;});
render();
