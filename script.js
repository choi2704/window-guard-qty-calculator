(()=>{"use strict";
const T=window.WINDOW_GUARD_PRICE_TABLE;
const $=id=>document.getElementById(id);
let material="SUS201";
let items=[];
const e={mat:$("materialOptions"),w:$("widthInput"),h:$("heightInput"),q:$("qtyInput"),minus:$("minusBtn"),plus:$("plusBtn"),add:$("addWindow"),tbody:document.querySelector("#windowTable tbody"),empty:$("emptyText"),curA:$("currentAmount"),totP:$("totalPyeong"),totA:$("totalAmount"),copy:$("copyBtn"),order:$("orderBtn")};
function comma(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,",")}
function won(n){return comma(n)+" 원"}
function band(v){v=Number(v)||0;if(v<=0||v>3000)return -1;if(v<=900)return 0;return Math.ceil((v-900)/100)}
function calc201(w,h){
  const s=T.sus201,row=band(h),col=band(w),valid=row>=0&&col>=0;
  if(!valid)return{valid:false,a:0,basis:"1~3000mm 입력"};
  const rowUpper=row===0?900:900+row*100,colUpper=col===0?900:900+col*100;
  const tableQty=Math.round((rowUpper*colUpper*6)/90000),tableUnit=tableQty*1000;
  const smartMax=2200,useSmart=w<=smartMax&&h<=smartMax;
  const widthCm=Math.max(90,Math.min(220,Math.ceil(w/10)));
  const heightCm=Math.max(90,Math.min(220,Math.ceil(h/10)));
  const widthOptionCm=widthCm;
  const base=s.basePrice||54400;
  const widthExtra=s.widthOptions[String(widthOptionCm)]||0;
  const heightExtra=s.heightOptions[String(heightCm)]||0;
  const smartUnit=base+widthExtra+heightExtra;
  const boundaryWidthCm=Math.max(90,Math.min(220,Math.ceil(Math.min(w,smartMax)/10)));
  const boundaryHeightCm=Math.max(90,Math.min(220,Math.ceil(Math.min(h,smartMax)/10)));
  const boundaryWidthOptionCm=boundaryWidthCm;
  const boundaryUnit=base+(s.widthOptions[String(boundaryWidthOptionCm)]||0)+(s.heightOptions[String(boundaryHeightCm)]||0);
  const unit=useSmart?smartUnit:Math.max(tableUnit,boundaryUnit);
  return{valid:true,a:unit,basis:useSmart?"스마트스토어 옵션가":`대형 맞춤 ${tableQty}×1,000`,detail:useSmart?`기본 ${won(base)} + 가로 ${widthOptionCm}cm ${won(widthExtra)} + 세로 ${heightCm}cm ${won(heightExtra)}`:`표 ${won(tableUnit)} / 2200 기준 ${won(boundaryUnit)}`};
}
function calc304(w,h){
  const row=band(h),col=band(w),valid=row>=0&&col>=0;
  if(!valid)return{valid:false,a:0,basis:"1~3000mm 입력"};
  const qty=T.sus304QtyTable[row][col],unit=qty*(T.sus304UnitPrice||1000);
  return{valid:true,a:unit,basis:`표 ${qty}×${comma(T.sus304UnitPrice||1000)}`,detail:`표 적용 수량 ${qty} × ${won(T.sus304UnitPrice||1000)}`};
}
function calc(w,h,mat=material){
  w=Number(w)||0;h=Number(h)||0;
  if(!w||!h)return{valid:false,a:0,basis:"규격 입력"};
  return mat==="SUS304"?calc304(w,h):calc201(w,h);
}
function renderMat(){
  e.mat.innerHTML="";
  ["SUS201","SUS304"].forEach(name=>{const div=document.createElement("div");div.className="radio-item"+(name===material?" active":"");div.innerHTML='<span class="radio-dot"></span><span>'+name+'</span>';div.onclick=()=>{material=name;renderMat();renderAll()};e.mat.appendChild(div)})
}
function current(){
  const r=calc(e.w.value,e.h.value,material),qty=Math.max(1,Number(e.q.value||1));
  e.curA.textContent=r.valid?won(r.a*qty):"0 원";
}
function addItem(){
  const w=Number(e.w.value),h=Number(e.h.value),q=Math.max(1,Number(e.q.value||1)),r=calc(w,h,material);
  if(!w||!h){alert("가로와 세로를 입력해주세요.");return}
  if(!r.valid){alert("가로와 세로를 1~3000mm 범위로 입력해주세요.");return}
  for(let i=0;i<q;i++)items.push({w,h,material});
  e.w.value="";e.h.value="";e.q.value=1;renderAll();
}
function renderAll(){
  current();e.tbody.innerHTML="";let ta=0;
  items.forEach((it,i)=>{const r=calc(it.w,it.h,it.material);ta+=r.a;const tr=document.createElement("tr");tr.innerHTML=`<td>${i+1}</td><td>${it.material}</td><td>${it.w}</td><td>${it.h}</td><td>${won(r.a)}</td><td><button class="del-btn" type="button">삭제</button></td>`;tr.querySelector("button").onclick=()=>{items.splice(i,1);renderAll()};e.tbody.appendChild(tr)});
  e.empty.style.display=items.length?"none":"flex";e.totP.textContent=items.length+" 개";e.totA.textContent=won(ta);
}
function text(){
  let ta=0;let lines=["강동자바라 스텐 방범창 견적",""];
  items.forEach((it,i)=>{const r=calc(it.w,it.h,it.material);ta+=r.a;lines.push(`No.${i+1} ${it.material} ${it.w} × ${it.h}mm`,`${won(r.a)}`,"")});
  lines.push("----------------",`총 수량: ${items.length}개`,`총 예상금액: ${won(ta)}`,"","※ 가로·세로 입력범위: 1~3000mm","문의: 010-7595-0484");return lines.join("\n")
}
async function copyText(){const t=text();try{await navigator.clipboard.writeText(t);alert("견적내용이 복사되었습니다.")}catch(err){prompt("아래 내용을 복사해주세요.",t)}}
async function orderGo(ev){ev.preventDefault();try{await navigator.clipboard.writeText(text())}catch(err){}window.open("https://kdjavara.kr/product/%ED%85%8C%EC%8A%A4%ED%8A%B8-sus-%EC%85%80%ED%94%84-%EC%8B%9C%EA%B3%B5-304%EC%8A%A4%ED%85%8C%EC%9D%B8%EB%A6%AC%EC%8A%A4-%EB%B0%A9%EB%B2%94%EC%B0%BD-%EC%99%84%EC%A1%B0%EB%A6%BD%EC%A0%9C%ED%92%88-%EC%8A%A4%ED%85%90-%EC%B0%BD%EB%AC%B8-%EC%85%80%ED%94%84-%EC%84%A4%EC%B9%98-%EB%A7%9E%EC%B6%A4-%EC%A0%9C%EC%9E%91/775/category/52/display/1/","_blank")}
function bind(){["input","change"].forEach(ev=>{e.w.addEventListener(ev,renderAll);e.h.addEventListener(ev,renderAll);e.q.addEventListener(ev,renderAll)});e.minus.onclick=()=>{e.q.value=Math.max(1,Number(e.q.value||1)-1);renderAll()};e.plus.onclick=()=>{e.q.value=Number(e.q.value||1)+1;renderAll()};e.add.onclick=addItem;e.copy.onclick=copyText;e.order.onclick=orderGo}
document.addEventListener("DOMContentLoaded",()=>{renderMat();bind();renderAll()});
})();
