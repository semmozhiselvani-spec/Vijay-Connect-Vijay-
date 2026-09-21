const demo=[
{title:"Your Journey. Our Connection.",text:"Reliable car services across Chennai and nearby areas for city rides, hourly rentals and selected trips.",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85"},
{title:"Celebrate Every Journey.",text:"Festival campaigns and special announcements can be changed anytime from your private owner dashboard.",image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85"},
{title:"Comfort Meets Chennai.",text:"A simple, comfortable car service experience built for Chennai and its surrounding locations.",image:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=85"}];
const defaultAreas=["Tambaram","Chromepet","Pallavaram","Porur","Guindy","Adyar","Velachery","Sholinganallur","OMR","ECR","Avadi","Ambattur","Poonamallee","Sriperumbudur","Perungalathur","Chengalpattu","Kelambakkam","Mahabalipuram","Thiruvallur"];
function getActiveVijayState(){
  const live={};
  ['vijayContent','vijayImages','vijayTheme','vijayContact','vijayBooking','vijayExplore','vijayRoutes','vijaySlides','vijaySettings','vijayFestivalBanners','vijayHomePromos'].forEach(k=>{try{live[k]=JSON.parse(localStorage.getItem(k)||'null')}catch(e){live[k]=null}});
  let schedules=[];try{const many=JSON.parse(localStorage.getItem('vijaySchedules')||'[]');if(Array.isArray(many))schedules=many}catch(e){}
  try{const legacy=JSON.parse(localStorage.getItem('vijaySchedule')||'null');if(legacy?.start)schedules.push(legacy)}catch(e){}
  const now=new Date();
  schedules.sort((a,b)=>new Date(b.start)-new Date(a.start));
  const active=schedules.find(s=>s?.start && now>=new Date(s.start) && (!s.end || now<=new Date(s.end)) && s.data);
  if(active)Object.assign(live,active.data)
  return live;
}
const activeState=getActiveVijayState();
const settings=activeState.vijaySettings||JSON.parse(localStorage.getItem("vijaySettings")||"null")||{motion:"zoom",interval:5000,areas:defaultAreas,offerVisible:true};
// Large Chennai pickup/drop directory. These are searchable points, not extra orbit clutter.
const chennaiPoints=[
 ['Tambaram','Service Area'],['Chromepet','Service Area'],['Pallavaram','Service Area'],['Porur','Service Area'],['Guindy','Service Area'],['Adyar','Service Area'],['Velachery','Service Area'],['Sholinganallur','Service Area'],['OMR','Service Area'],['ECR','Service Area'],['Avadi','Service Area'],['Ambattur','Service Area'],['Poonamallee','Service Area'],['Sriperumbudur','Service Area'],['Perungalathur','Service Area'],['Chengalpattu','Service Area'],['Kelambakkam','Service Area'],['Mahabalipuram','Service Area'],['Thiruvallur','Service Area'],
 ['Chennai Airport','Airport'],['Chennai Airport Domestic Terminal','Airport'],['Chennai Airport International Terminal','Airport'],['Chennai Central Railway Station','Railway Station'],['Chennai Egmore Railway Station','Railway Station'],['Tambaram Railway Station','Railway Station'],['Guindy Railway Station','Railway Station'],['Mambalam Railway Station','Railway Station'],['Saidapet Railway Station','Railway Station'],['Avadi Railway Station','Railway Station'],['Chengalpattu Railway Station','Railway Station'],['Koyambedu CMBT Bus Stand','Bus Stand'],['Kilambakkam KCBT Bus Terminus','Bus Stand'],['Broadway Bus Stand','Bus Stand'],['Poonamallee Bus Stand','Bus Stand'],
 ['Marina Beach','Tourist Spot'],['Elliot’s Beach','Tourist Spot'],['Besant Nagar Beach','Tourist Spot'],['Kapaleeshwarar Temple','Temple'],['Parthasarathy Temple','Temple'],['San Thome Basilica','Landmark'],['Fort St. George','Landmark'],['Madras High Court','Landmark'],['MGR Memorial','Landmark'],['Anna Memorial','Landmark'],['Valluvar Kottam','Landmark'],['Government Museum Egmore','Museum'],['Birla Planetarium','Landmark'],['Guindy National Park','Park'],['Anna Nagar Tower','Landmark'],['Madhya Kailash','Landmark'],['Chennai Trade Centre','Business'],
 ['T Nagar','Shopping'],['Pondy Bazaar','Shopping'],['Nungambakkam','Shopping / Locality'],['Anna Nagar','Locality'],['Vadapalani','Locality'],['Kodambakkam','Locality'],['Koyambedu','Locality'],['Perungudi','Locality'],['Thoraipakkam','Locality'],['Navalur','Locality'],['Siruseri SIPCOT','IT / Business'],['Tidel Park','IT / Business'],['DLF IT Park Porur','IT / Business'],['Guindy Industrial Estate','Business'],
 ['Phoenix Marketcity Chennai','Mall'],['VR Chennai','Mall'],['Express Avenue Mall','Mall'],['Forum Vijaya Mall','Mall'],['Ampa Skywalk','Mall'],['Chennai Citi Centre','Mall'],['Marina Mall','Mall'],['Grand Square Mall','Mall'],['Spectrum Mall','Mall'],
 ['PVR Sathyam Cinemas','Theatre / Cinema'],['PVR Palazzo','Theatre / Cinema'],['PVR VR Chennai','Theatre / Cinema'],['Luxe Cinemas','Theatre / Cinema'],['Rohini Silver Screens','Theatre / Cinema'],['Kamala Cinemas','Theatre / Cinema'],['AGS Cinemas Navalur','Theatre / Cinema'],['EGA Theatre','Theatre / Cinema'],['Sangam Cinemas','Theatre / Cinema'],['Devi Cineplex','Theatre / Cinema'],
 ['Apollo Hospital Greams Road','Hospital'],['Kauvery Hospital Alwarpet','Hospital'],['MIOT International','Hospital'],['SIMS Hospital Vadapalani','Hospital'],['Fortis Hospital Vadapalani','Hospital'],['Rajiv Gandhi Government General Hospital','Hospital'],['Government Stanley Hospital','Hospital'],['Sri Ramachandra Hospital Porur','Hospital'],['Rela Hospital Chromepet','Hospital'],
 ['Chennai US Consulate','Consulate / Landmark'],['Anna University','College / Landmark'],['IIT Madras','College / Landmark'],['Loyola College','College / Landmark'],['Madras University','College / Landmark'],['Chennai Port','Landmark'],['Marina Lighthouse','Landmark'],['Chennai Rail Museum','Museum']
];
const pointDirectory=chennaiPoints.map(([name,category])=>({name,category}));

let data=JSON.parse(localStorage.getItem("vijaySlides")||"null")||demo,i=0,t;
const $=id=>document.getElementById(id);

function render(){
  $("slides").innerHTML="";$("dots").innerHTML="";
  document.querySelector(".hero").dataset.motion=settings.motion||"zoom";
  data.forEach((s,n)=>{
    const el=document.createElement("div");el.className="slide"+(n===0?" active":"");
    el.style.backgroundImage=s.image?`url("${s.image}")`:"linear-gradient(135deg,#24134e,#0b0910)";
    $("slides").appendChild(el);
    const q=document.createElement("i");q.className="dot"+(n===0?" active":"");q.onclick=()=>go(n);$("dots").appendChild(q);
  }); update(); renderAreas();
}
function update(){if(!data.length){$("title").textContent="Vijay Connect";$("desc").textContent="Your journey. Our connection.";return}$("title").textContent=data[i].title;$("desc").textContent=data[i].text}
function go(n){if(!data.length)return;i=(n+data.length)%data.length;document.querySelectorAll(".slide").forEach((x,k)=>x.classList.toggle("active",k===i));document.querySelectorAll(".dot").forEach((x,k)=>x.classList.toggle("active",k===i));update();restart()}
function next(){go(i+1)} function prev(){go(i-1)}
function restart(){clearInterval(t);if(data.length>1&&settings.interval>0)t=setInterval(next,Number(settings.interval)||5000)}

const areaPhotos={
 Tambaram:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88',
 Chromepet:'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=88',
 Pallavaram:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88',
 Porur:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88',
 Guindy:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=88',
 Adyar:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=88',
 Velachery:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88',
 Sholinganallur:'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=88',
 OMR:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=88',
 ECR:'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=1200&q=88',
 Avadi:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=88',
 Ambattur:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88',
 Poonamallee:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=88',
 Sriperumbudur:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88',
 Perungalathur:'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1200&q=88',
 Chengalpattu:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=88',
 Kelambakkam:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88',
 Mahabalipuram:'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=88',
 Thiruvallur:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=88'
};
const areaTags={Tambaram:'Chennai South',Chromepet:'Chennai South',Pallavaram:'Airport Corridor',Porur:'West Chennai',Guindy:'Central Chennai',Adyar:'South Chennai',Velachery:'South Chennai',Sholinganallur:'OMR',OMR:'IT Corridor',ECR:'East Coast Road',Avadi:'West Chennai',Ambattur:'West Chennai',Poonamallee:'West Chennai',Sriperumbudur:'Chennai Outskirts',Perungalathur:'GST Road',Chengalpattu:'GST Road',Kelambakkam:'OMR / ECR',Mahabalipuram:'ECR Heritage',Thiruvallur:'Chennai Outskirts'};
function getRouteForArea(name){const routes=JSON.parse(localStorage.getItem('vijayRoutes')||'null')||[];return routes.find(r=>String(r.place).toLowerCase()===String(name).toLowerCase())||null}
function showAreaPreview(name){ location.href='route-details.html?to='+encodeURIComponent(name); }
// ================= SERVICE AREA MAP (v3) =================
// Desktop: slow "solar system" orbit (3 rings, straight text, pauses on hover so it is easy to click).
// Mobile/tablet: unique tap-first layout (mini orbit + ring tabs + big area cards with distance and fare).
const AREA_RINGS=[
 {title:'Nearby',range:'up to 20 km',color:'#6d28d9',period:130,start:-50,names:['Velachery','Adyar','Chromepet','Guindy','Pallavaram']},
 {title:'Mid-range',range:'22 - 30 km',color:'#2563eb',period:190,start:-60,names:['Avadi','Sholinganallur','Ambattur','Perungalathur','Porur','Tambaram','OMR','Poonamallee']},
 {title:'Outskirts',range:'35 - 60 km',color:'#0d9488',period:270,start:-44,names:['ECR','Kelambakkam','Sriperumbudur','Chengalpattu','Thiruvallur','Mahabalipuram']}
];
const AREA_DEFAULTS={Tambaram:['24','55','699'],Chromepet:['20','45','649'],Pallavaram:['18','40','599'],Porur:['22','50','649'],Guindy:['12','30','499'],Adyar:['15','35','549'],Velachery:['16','40','549'],Sholinganallur:['28','60','749'],OMR:['30','65','799'],ECR:['35','75','899'],Avadi:['30','70','799'],Ambattur:['25','60','699'],Poonamallee:['28','65','749'],Sriperumbudur:['45','90','1,099'],Perungalathur:['28','60','749'],Chengalpattu:['60','110','1,399'],Kelambakkam:['40','85','999'],Mahabalipuram:['55','105','1,299'],Thiruvallur:['50','105','1,199']};
function areaInfo(name){
 let r=null; try{r=getRouteForArea(name)}catch(e){}
 const d=AREA_DEFAULTS[name]||['','',''];
 const km=String((r&&r.km)||d[0]).replace(/[^0-9.]/g,'');
 const dur=String((r&&r.duration)||d[1]).replace(/[^0-9.]/g,'');
 const mini=String((r&&r.mini)||d[2]).replace(/^[^0-9]+/,'');
 return {km,dur,mini,kmNum:parseFloat(km)||0};
}
function renderAreas(){
 const orbit=$('areaOrbit'), map=$('areaMap'), more=$('areaMore'); if(!orbit||!map)return;
 const card=map.closest('.areaMapCard'); if(!card)return;
 if(more) more.innerHTML='';
 card.querySelectorAll('.areaMobile,.areaLegend').forEach(n=>n.remove());
 orbit.innerHTML='';
 const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

 // ---------- desktop orbit ----------
 const ellipses=[], chips=[];
 AREA_RINGS.forEach((ring,ri)=>{
  const ell=document.createElement('i');ell.className='areaEllipse';ell.style.borderColor=ring.color+'55';orbit.appendChild(ell);ellipses.push(ell);
  const step=360/ring.names.length;
  ring.names.forEach((name,k)=>{
   const a=document.createElement('a');a.className='areaChip';a.dataset.ring=ri;a.href='route-details.html?to='+encodeURIComponent(name);a.title='View route and fare to '+name;
   const label=document.createElement('span');label.className='areaChipLabel';label.textContent=name;a.appendChild(label);orbit.appendChild(a);
   chips.push({el:a,ring:ri,ang:ring.start+step*k,speed:360/ring.period});
  });
 });
 const legend=document.createElement('div');legend.className='areaLegend';
 legend.innerHTML=AREA_RINGS.map(r=>`<span><i style="background:${r.color}"></i>${esc(r.title)} <b>${esc(r.range)}</b></span>`).join('')+'<em>Move your mouse over the map to pause it</em>';
 map.insertAdjacentElement('afterend',legend);
 const S={W:0,H:0,rx:[],ry:[],paused:false,visible:true,orbit:false,last:0};
 function place(c){const rad=c.ang*Math.PI/180;c.el.style.setProperty('--x',(S.W/2+S.rx[c.ring]*Math.cos(rad)).toFixed(1)+'px');c.el.style.setProperty('--y',(S.H/2+S.ry[c.ring]*Math.sin(rad)).toFixed(1)+'px');}
 function layout(){
  const W=map.clientWidth,H=map.clientHeight; if(!W||!H)return false;
  const core=map.querySelector('.areaCore'), coreR=(core?core.offsetWidth/2:78)+16, ch=38, pad=8;
  const mw=AREA_RINGS.map((r,ri)=>Math.max(...chips.filter(c=>c.ring===ri).map(c=>c.el.offsetWidth)));
  let rx=[coreR+mw[0]/2+10];
  for(let i=1;i<3;i++) rx[i]=rx[i-1]+1.1*(mw[i-1]+mw[i])/2+6;
  const needW=rx[2]*2+mw[2]+2*pad; if(W<needW) return false;
  const k=(W/2-mw[2]/2-pad)/rx[2]; rx=rx.map(v=>v*k);
  const ry0=coreR+ch/2+10, ry2=H/2-ch/2-pad, ry=[ry0,(ry0+ry2)/2,ry2];
  if(ry[1]-ry[0]<ch+10) return false;
  S.W=W;S.H=H;S.rx=rx;S.ry=ry;
  ellipses.forEach((e,i)=>{e.style.width=(rx[i]*2)+'px';e.style.height=(ry[i]*2)+'px'});
  chips.forEach(place); return true;
 }
 function frame(now){
  const dt=Math.min(.1,(now-S.last)/1000); S.last=now;
  if(!S.orbit||S.paused||!S.visible||reduce||document.hidden)return;
  chips.forEach(c=>{c.ang+=c.speed*dt;place(c)});
 }
 function setMode(){
  const cardW=card.clientWidth; let orbitOK=false;
  card.classList.remove('areaOrbitMode');card.classList.remove('areaListMode');
  if(cardW-44>=1000){card.classList.add('areaOrbitMode');orbitOK=layout();}
  if(!orbitOK){card.classList.remove('areaOrbitMode');card.classList.add('areaListMode');}
  S.orbit=orbitOK;
 }
 map.addEventListener('pointerenter',()=>{S.paused=true});map.addEventListener('pointerleave',()=>{S.paused=false});
 map.addEventListener('focusin',()=>{S.paused=true});map.addEventListener('focusout',()=>{S.paused=false});
 let tt;map.addEventListener('touchstart',()=>{S.paused=true;clearTimeout(tt);tt=setTimeout(()=>{S.paused=false},6000)},{passive:true});
 if('IntersectionObserver' in window){new IntersectionObserver(es=>{S.visible=es[0].isIntersecting},{threshold:.05}).observe(card);}

 // ---------- mobile / tablet: tap-first layout ----------
 const mob=document.createElement('div');mob.className='areaMobile';mob.id='areaMobile';
 const ringDia=[128,182,236], dotR=ringDia.map(d=>d/2);
 const viz=AREA_RINGS.map((ring,ri)=>{
  const dots=ring.names.map((n,k)=>`<b style="transform:rotate(${(360/ring.names.length*k).toFixed(1)}deg) translateX(${dotR[ri]}px)"></b>`).join('');
  return `<div class="amRing" data-ring="${ri}" style="--d:${ringDia[ri]}px;--dur:${ring.period/3}s;--c:${ring.color}">${dots}</div>`;
 }).join('');
 mob.innerHTML=`<div class="amViz" aria-hidden="true">${viz}<div class="amCore"><strong>CHENNAI</strong><small>Home base</small></div></div>
 <p class="amHint">Choose how far you are travelling</p>
 <div class="amTabs" role="tablist" aria-label="Distance from Chennai">${AREA_RINGS.map((r,i)=>`<button type="button" role="tab" class="amTab${i===0?' active':''}" data-ring="${i}" style="--c:${r.color}" aria-selected="${i===0}"><span>${esc(r.title)}</span><small>${esc(r.range)}</small></button>`).join('')}</div>
 <label class="amSearch"><span aria-hidden="true">&#128269;</span><input type="search" id="amSearch" placeholder="Search your area" autocomplete="off" enterkeyhint="search" aria-label="Search your area"></label>
 <div class="amList" id="amList" role="tabpanel" aria-live="polite"></div>
 <a class="amHelp" href="https://wa.me/918056631317?text=${encodeURIComponent('Hi Vijay Connect, I need a car for an area that is not listed.')}" target="_blank" rel="noopener"><span>Area not listed?</span><b>WhatsApp us &rarr;</b></a>`;
 map.insertAdjacentElement('afterend',mob);
 const list=mob.querySelector('#amList'), tabs=[...mob.querySelectorAll('.amTab')], rings=[...mob.querySelectorAll('.amRing')], input=mob.querySelector('#amSearch');
 const allNames=AREA_RINGS.flatMap((r,ri)=>r.names.map(n=>({n,ri})));
 function cardHTML(n,ri){
  const i=areaInfo(n), color=AREA_RINGS[ri].color;
  const meta=[i.km?i.km+' km':'',i.dur?'about '+i.dur+' min':''].filter(Boolean).join(' &middot; ');
  return `<a class="amCard" href="route-details.html?to=${encodeURIComponent(n)}" style="--c:${color}"><span class="amPin"></span><span class="amInfo"><strong>${esc(n)}</strong><small>${meta}</small></span><span class="amFare">${i.mini?'<small>from</small><b>&#8377;'+esc(i.mini)+'</b>':''}</span><span class="amGo" aria-hidden="true">&rsaquo;</span></a>`;
 }
 let cur=0;
 function show(){
  const q=input.value.trim().toLowerCase();
  let items=q?allNames.filter(x=>x.n.toLowerCase().includes(q)):AREA_RINGS[cur].names.map(n=>({n,ri:cur}));
  items=items.map(x=>({...x,km:areaInfo(x.n).kmNum})).sort((a,b)=>a.km-b.km);
  list.innerHTML=items.length?items.map(x=>cardHTML(x.n,x.ri)).join(''):'<div class="amEmpty">No area found. Tap <b>WhatsApp us</b> below and we will help you.</div>';
  list.classList.remove('swap');void list.offsetWidth;list.classList.add('swap');
  mob.classList.toggle('searching',!!q);
  tabs.forEach((t,i)=>{const on=!q&&i===cur;t.classList.toggle('active',on);t.setAttribute('aria-selected',on)});
  rings.forEach((r,i)=>r.classList.toggle('on',q?false:i===cur));
 }
 tabs.forEach(t=>t.addEventListener('click',()=>{input.value='';cur=Number(t.dataset.ring);show();}));
 input.addEventListener('input',show);
 show();

 // ---------- start ----------
 setMode();
 if(!renderAreas._bound){
  renderAreas._bound=true;
  let rt;const rz=()=>{clearTimeout(rt);rt=setTimeout(()=>{if(renderAreas._setMode)renderAreas._setMode()},120)};
  window.addEventListener('resize',rz);
  if('ResizeObserver' in window){new ResizeObserver(rz).observe(card);}
  const loop=t=>{requestAnimationFrame(loop);if(renderAreas._tick)renderAreas._tick(t)};requestAnimationFrame(loop);
 }
 renderAreas._tick=frame;
 renderAreas._setMode=setMode;
}

function renderExplore(){
 const fallback={title:"Explore Chennai. Ride Easy.",desc:"Popular Chennai places and simple point-to-point fares, shown as starting prices.",routeTitle:"Chennai → Your Drop",routeDesc:"Choose a destination and see a simple starting fare.",routePrice:"₹999",cards:[{name:"Chennai High Court",tag:"Heritage • George Town",price:"₹999",image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=85"},{name:"Marina Beach",tag:"Beach • City Centre",price:"₹899",image:"https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=900&q=85"},{name:"Kapaleeshwarar Temple",tag:"Culture • Mylapore",price:"₹899",image:"https://images.unsplash.com/photo-1590050752117-238cb0fb9b1c?auto=format&fit=crop&w=900&q=85"},{name:"Elliot's Beach",tag:"Beach • Besant Nagar",price:"₹999",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85"},{name:"Mahabalipuram",tag:"Heritage • ECR",price:"₹1,499",image:"https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=85"},{name:"Chennai Airport",tag:"Pickup • Drop",price:"₹799",image:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85"}]};
 const ex=activeState.vijayExplore||JSON.parse(localStorage.getItem("vijayExplore")||"null")||fallback;
 $("exploreTitle").textContent=ex.title;$("exploreDesc").textContent=ex.desc;$("routeTitle").textContent=ex.routeTitle;$("routeDesc").textContent=ex.routeDesc;$("routePrice").textContent=ex.routePrice||"₹999";
 $("exploreGrid").innerHTML=(ex.cards||[]).map(x=>{const img=String(x.image||"").replace(/"/g,"&quot;");const tag=String(x.tag||"Chennai • Car Service").replace(/</g,"&lt;");const name=String(x.name||"").replace(/</g,"&lt;");const price=String(x.price||"—").replace(/</g,"&lt;");return `<article class="exploreCard reveal"><div class="explorePhoto" style="background-image:url('${img}')"><span>${tag}</span></div><div class="exploreBody"><div><small>CHENNAI → DROP</small><h3>${name}</h3></div><div class="priceBox"><span>Starting from</span><b>${price}</b></div></div><a class="exploreBook" href="#contact" data-explore-book="${name.replace(/"/g,"&quot;")}">Book this route <span>→</span></a></article>`}).join("");
 document.querySelectorAll("[data-explore-book]").forEach(a=>a.addEventListener("click",()=>{const to=$("toPlace");if(to)to.value=a.dataset.exploreBook;}));
 const items=document.querySelectorAll("#exploreGrid .reveal");if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});items.forEach(x=>io.observe(x))}else items.forEach(x=>x.classList.add("visible"));
}
document.querySelectorAll(".navlink").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".navlink").forEach(x=>x.classList.remove("active"));a.classList.add("active")}));
render();restart();


(function(){const btn=document.getElementById('mobileMenuBtn'),menu=document.getElementById('mobileMenu'),close=document.getElementById('mobileMenuClose');if(!btn||!menu)return;function setOpen(open){menu.classList.toggle('open',open);btn.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('menu-open',open)}btn.addEventListener('click',()=>setOpen(!menu.classList.contains('open')));close&&close.addEventListener('click',()=>setOpen(false));menu.addEventListener('click',e=>{if(e.target===menu)setOpen(false);if(e.target.closest('.mobileNav a,.mobileBook'))setOpen(false)});window.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});})();

// Premium scroll reveal + subtle number animation
(function(){
 const items=document.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.15});
   items.forEach(x=>io.observe(x));
 }else items.forEach(x=>x.classList.add('visible'));
 const nums=document.querySelectorAll('[data-count]');
 const noMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function count(el){const target=Number(el.dataset.count); if(!target)return; if(noMotion){el.textContent=target+(el.textContent.includes('%')?'%':el.textContent.includes('/7')?'/7':'');return;} let start=0,step=Math.max(1,Math.ceil(target/28)); const timer=setInterval(()=>{start=Math.min(target,start+step); el.textContent=start+(target===24?'/7':target===100?'%':''); if(start>=target)clearInterval(timer)},35)}
 const nio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){count(e.target);nio.unobserve(e.target)}}),{threshold:.8}); nums.forEach(x=>nio.observe(x));
})();


// Smart Chennai point picker for From / To fields.
(function(){
 const from=document.getElementById('fromPlace'), to=document.getElementById('toPlace'); if(!from||!to)return;
 const setup=(input,box)=>{
   const norm=v=>String(v||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
   function draw(){
     const q=norm(input.value); if(!q){box.innerHTML='';box.classList.remove('open');return;}
     const hits=pointDirectory.filter(p=>norm(p.name+' '+p.category).includes(q)).slice(0,9);
     box.innerHTML=hits.map(p=>`<button type="button" data-value="${p.name.replace(/"/g,'&quot;')}"><strong>${p.name}</strong><small>${p.category}</small></button>`).join('');
     box.classList.toggle('open',hits.length>0);
     box.querySelectorAll('button').forEach(b=>b.addEventListener('mousedown',e=>{e.preventDefault();input.value=b.dataset.value;box.classList.remove('open');}));
   }
   input.addEventListener('input',draw); input.addEventListener('focus',draw); input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('open'),180));
 };
 setup(from,document.getElementById('fromSuggestions')); setup(to,document.getElementById('toSuggestions'));
})();

// Quick booking: two-step flow — trip details first, vehicle/fare second, then confirmed booking + WhatsApp.
(function(){
 const form=document.getElementById('bookingForm'); if(!form)return;
 const tabs=[...document.querySelectorAll('.serviceTab')], service=document.getElementById('bookingService');
 const from=document.getElementById('fromPlace'),to=document.getElementById('toPlace'),date=document.getElementById('travelDate'),time=document.getElementById('pickupTime');
 const oneWayRow=document.getElementById('oneWayRow'),retRow=document.getElementById('returnRow'),rentRow=document.getElementById('rentalRow'),ret=document.getElementById('returnDate');
 const stepOne=document.getElementById('bookingStepOne'), continueBtn=document.getElementById('bookingContinue'), vehicleStep=document.getElementById('bookingVehicleStep'), backBtn=document.getElementById('bookingBack');
 const vehicleCards=[...document.querySelectorAll('[data-booking-vehicle]')];
 const selectedCarField=document.getElementById('selectedCarBooking');
 const today=new Date(); const iso=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 date.min=iso; ret.min=iso; if(!date.value) date.value=iso;
 let selectedVehicle='sedan'; let selectedPrice='Price on request';
 function pretty(v){return v ? v.charAt(0).toUpperCase()+v.slice(1) : '';}
 function setService(name){
   service.value=name; tabs.forEach(x=>x.classList.toggle('active',x.dataset.service===name));
   const rental=name==='Hourly Rental', out=name==='Outstation', oneWay=name==='One Way Trip'; oneWayRow.hidden=!oneWay; retRow.hidden=!out; rentRow.hidden=!rental;
   to.required=!rental; from.placeholder=rental?'Pickup / starting location':'Pickup location'; to.placeholder=rental?'Optional destination / local':'Drop location';
   if(rental && !to.value) to.value='';
 }
 tabs.forEach(t=>t.addEventListener('click',()=>setService(t.dataset.service)));
 document.querySelectorAll('[data-book-service]').forEach(a=>a.addEventListener('click',()=>setService(a.dataset.bookService)));
 setService('One Way Trip');
 const params=new URLSearchParams(location.search);
 const queryRoute=params.get('route'); const queryVehicle=params.get('vehicle'); const queryRouteMode=params.get('routeMode')==='1';
 if(queryRoute){localStorage.setItem('vijayRouteTo',queryRoute);localStorage.setItem('vijayRouteMode','1');}
 if(queryVehicle){localStorage.setItem('vijayVehicle',queryVehicle.toLowerCase());}
 const savedRoute=localStorage.getItem('vijayRouteTo');
 const routeMode=queryRouteMode || localStorage.getItem('vijayRouteMode')==='1';
 if(savedRoute && to){to.value=savedRoute;}
 const savedVehicle=queryVehicle || localStorage.getItem('vijayVehicle'); if(savedVehicle){selectedVehicle=String(savedVehicle).toLowerCase();}
 const routeSelection=(queryVehicle || localStorage.getItem('vijayRouteSelection')==='1') && !routeMode;
 if(!['mini','sedan','suv'].includes(selectedVehicle)) selectedVehicle='sedan';
 if(routeMode){
   if(from && !from.value) from.value='Chennai';
   if(to && savedRoute) to.value=savedRoute;
   if(continueBtn){
     const txt=continueBtn.querySelector('span'); if(txt) txt.textContent='Confirm Booking';
   }
   if(vehicleStep) vehicleStep.hidden=true;
   if(stepOne) stepOne.hidden=false;
   const actions=continueBtn?.closest('.bookingStepActions'); if(actions) actions.hidden=false;
   const progress=document.getElementById('bookingProgress'); if(progress){const spans=progress.querySelectorAll('span');if(spans[0])spans[0].classList.add('active');if(spans[1])spans[1].classList.remove('active');}
 }
 if(routeSelection){
   updateSummary();
   if(stepOne) stepOne.hidden=true;
   if(vehicleStep) vehicleStep.hidden=false;
   const actions=continueBtn?.closest('.bookingStepActions'); if(actions) actions.hidden=true;
   const progress=document.getElementById('bookingProgress'); if(progress){const spans=progress.querySelectorAll('span');if(spans[0])spans[0].classList.remove('active');if(spans[1])spans[1].classList.add('active');}
 }
 localStorage.removeItem('vijayRouteTo'); localStorage.removeItem('vijayVehicle'); localStorage.removeItem('vijayRouteMode'); localStorage.removeItem('vijayRouteSelection');
 function findFare(){
   const target=String(to.value||'').trim().toLowerCase();
   let routes=[]; try{routes=activeState.vijayRoutes||JSON.parse(localStorage.getItem('vijayRoutes')||'[]');}catch(e){routes=[]}
   const r=routes.find(x=>String(x.place||'').trim().toLowerCase()===target);
   if(r)return r;
   const defaults=[['Tambaram','₹699','₹799','₹999'],['Chromepet','₹649','₹749','₹949'],['Pallavaram','₹599','₹699','₹899'],['Porur','₹649','₹749','₹949'],['Guindy','₹499','₹599','₹799'],['Adyar','₹549','₹649','₹849'],['Velachery','₹549','₹649','₹849'],['Sholinganallur','₹749','₹899','₹1,099'],['OMR','₹799','₹949','₹1,149'],['ECR','₹899','₹1,049','₹1,249'],['Avadi','₹799','₹949','₹1,149'],['Ambattur','₹699','₹849','₹999'],['Poonamallee','₹749','₹899','₹1,099'],['Sriperumbudur','₹1,099','₹1,299','₹1,499'],['Perungalathur','₹749','₹899','₹1,099'],['Chengalpattu','₹1,399','₹1,599','₹1,899'],['Kelambakkam','₹999','₹1,149','₹1,349'],['Mahabalipuram','₹1,299','₹1,499','₹1,799'],['Thiruvallur','₹1,199','₹1,399','₹1,699'],['Chennai Airport','₹599','₹699','₹899'],['Chennai Central Railway Station','₹399','₹499','₹699'],['Chennai Egmore Railway Station','₹399','₹499','₹699'],['Koyambedu CMBT Bus Stand','₹499','₹599','₹799'],['Kilambakkam KCBT Bus Terminus','₹999','₹1,149','₹1,349'],['Tambaram Railway Station','₹699','₹799','₹999'],['Guindy Railway Station','₹499','₹599','₹799'],['T Nagar','₹399','₹499','₹699'],['Anna Nagar','₹449','₹549','₹749'],['Chennai Trade Centre','₹549','₹649','₹849'],['Siruseri SIPCOT','₹899','₹1,049','₹1,249'],['Marina Beach','₹449','₹549','₹749']];
   const d=defaults.find(x=>x[0].toLowerCase()===target);
   return d?{place:d[0],mini:d[1],sedan:d[2],suv:d[3]}:null;
 }
 function money(v){
   const raw=String(v??'').trim(); if(!raw)return 'Price on request';
   return /^₹/.test(raw)?raw:('₹'+raw);
 }
 function updateVehiclePrices(){
   const r=findFare();
   const prices={mini:r&&r.mini?money(r.mini):'Price on request',sedan:r&&r.sedan?money(r.sedan):'Price on request',suv:r&&r.suv?money(r.suv):'Price on request'};
   ['mini','sedan','suv'].forEach(v=>{const el=document.getElementById('booking'+pretty(v)+'Price');if(el)el.textContent=prices[v];});
   if(r){const hint=document.getElementById('bookingFareHint');if(hint)hint.textContent='Starting fare for this route. Final fare is confirmed by Vijay Connect.';}
   else {const hint=document.getElementById('bookingFareHint');if(hint)hint.textContent='Select a car. Final fare will be confirmed by Vijay Connect.';}
   selectedPrice=prices[selectedVehicle];
   const sel=document.getElementById('bookingSelectedPrice'); if(sel)sel.textContent=selectedPrice;
   const lab=document.getElementById('bookingSelectedLabel'); if(lab)lab.textContent=pretty(selectedVehicle);
   if(selectedCarField)selectedCarField.value=pretty(selectedVehicle);
   vehicleCards.forEach(c=>c.classList.toggle('selected',c.dataset.bookingVehicle===selectedVehicle));
 }
 function updateSummary(){
   const el=document.getElementById('bookingTripSummary'); if(el)el.textContent=(from.value.trim()||'Pickup')+' → '+(to.value.trim()||'Local / flexible rental');
   updateVehiclePrices();
 }
 vehicleCards.forEach(card=>card.addEventListener('click',()=>{selectedVehicle=card.dataset.bookingVehicle;updateVehiclePrices();}));
 continueBtn.addEventListener('click',()=>{
   if(!form.checkValidity()){form.reportValidity();return;}
   if(routeMode){
     // Route booking already has destination + vehicle; submit directly to WhatsApp.
     form.dispatchEvent(new Event('submit', {cancelable:true}));
     return;
   }
   updateSummary(); stepOne.hidden=true; vehicleStep.hidden=false; continueBtn.closest('.bookingStepActions').hidden=true;
   const prog=document.getElementById('bookingProgress'); if(prog){const spans=prog.querySelectorAll('span');if(spans[0])spans[0].classList.remove('active');if(spans[1])spans[1].classList.add('active');}
   vehicleStep.scrollIntoView({behavior:'smooth',block:'start'});
 });
 backBtn.addEventListener('click',()=>{vehicleStep.hidden=true;stepOne.hidden=false;continueBtn.closest('.bookingStepActions').hidden=false;document.getElementById('bookingProgress')?.querySelectorAll('span')[1]?.classList.remove('active');document.getElementById('bookingProgress')?.querySelectorAll('span')[0]?.classList.add('active');continueBtn.scrollIntoView({behavior:'smooth',block:'center'});});
 [from,to].forEach(el=>el.addEventListener('input',()=>{if(!vehicleStep.hidden)updateSummary();}));
 updateVehiclePrices();
 form.addEventListener('submit',async e=>{
   e.preventDefault();
   if(!form.checkValidity()){form.reportValidity();return;}
   const phone=document.getElementById('customerPhone').value.trim();
   const svc=service.value, fromV=from.value.trim(), toV=to.value.trim()||'Local / flexible rental';
   const selectedCar=pretty(selectedVehicle)||'Sedan';
   updateVehiclePrices();
   const fare=selectedPrice||'Price on request';
   const bookingId='VC-'+Date.now().toString(36).slice(-6).toUpperCase();
   let msg=`Hi Vijay Connect, I want to book a car.%0ABooking ID: ${bookingId}%0A%0AService: ${encodeURIComponent(svc)}%0AVehicle: ${encodeURIComponent(selectedCar)}%0AFare shown: ${encodeURIComponent(fare)}%0AFrom: ${encodeURIComponent(fromV)}%0ATo: ${encodeURIComponent(toV)}%0ATravel Date: ${encodeURIComponent(date.value)}%0APickup Time: ${encodeURIComponent(time.value)}`;
   if(svc==='Outstation') msg+=`%0AReturn Date: ${encodeURIComponent(ret.value||'Not specified')}`;
   if(svc==='Hourly Rental') msg+=`%0ARental Hours: ${encodeURIComponent(document.getElementById('rentalHours').value)}%0APassengers: ${encodeURIComponent(document.getElementById('rentalPassengers').value)}`;
   if(svc==='Outstation') msg+=`%0APassengers: ${encodeURIComponent(document.getElementById('outstationPassengers').value)}`;
   if(svc==='One Way Trip') msg+=`%0APassengers: ${encodeURIComponent(document.getElementById('oneWayPassengers').value)}`;
   msg+=`%0AMobile: ${encodeURIComponent(phone)}`;
   const note=document.getElementById('specialRequest').value.trim(); if(note) msg+=`%0ASpecial Request: ${encodeURIComponent(note)}`;
   const waUrl=`https://wa.me/918056631317?text=${msg}`;
   // Reserve a browser tab from the user's click so WhatsApp can open automatically after confirmation.
   let waWindow=null; try{waWindow=window.open('about:blank','_blank');}catch(_){waWindow=null;}
   const booking={id:bookingId,service:svc,vehicle:selectedCar,fare,from:fromV,to:toV,date:date.value,time:time.value,mobile:phone,status:'Request created'};
   try{const customerSession=JSON.parse(localStorage.getItem('vcCustomerSession')||'null'); if(customerSession?.access_token&&customerSession?.user?.id&&window.VC_customerSaveBooking){ await VC_customerSaveBooking(customerSession.access_token,booking,customerSession.user.id); }}catch(e){console.warn('Cloud booking save:',e);}
   try{
     const history=JSON.parse(localStorage.getItem('vcCustomerBookings')||'[]');
     history.unshift(booking); localStorage.setItem('vcCustomerBookings',JSON.stringify(history.slice(0,20))); if(window.VC_refreshBookings) setTimeout(()=>window.VC_refreshBookings(),250);
   }catch(_){}
   const success=document.getElementById('vcBookingSuccess'), idEl=document.getElementById('vcSuccessBookingId'), summary=document.getElementById('vcSuccessSummary'), wa=document.getElementById('vcSuccessWhatsapp'), track=document.getElementById('vcSuccessTrack');
   if(idEl) idEl.textContent=bookingId;
   if(summary) summary.innerHTML=`<div><span>Journey</span><b>${fromV.replace(/</g,'&lt;')} → ${toV.replace(/</g,'&lt;')}</b></div><div><span>Car</span><b>${selectedCar}</b></div><div><span>Date & time</span><b>${date.value} • ${time.value}</b></div><div><span>Contact</span><b>${phone.replace(/</g,'&lt;')}</b></div>`;
   if(wa) wa.href=waUrl;
   if(track) track.onclick=()=>{window.location.href='track.html?booking='+encodeURIComponent(bookingId);};
   const successTitle=document.getElementById('vcBookingSuccessTitle'); if(successTitle) successTitle.textContent='Almost done — send it on WhatsApp';
   if(success){success.classList.add('is-open');success.setAttribute('aria-hidden','false');document.body.classList.add('vc-modal-open');}
   // Open WhatsApp automatically with the booking message. Browsers cannot silently press Send; the customer must tap Send.
   setTimeout(()=>{try{if(waWindow&&!waWindow.closed){waWindow.location.href=waUrl;}else{window.location.href=waUrl;}}catch(_){window.location.href=waUrl;}},450);
 });
})();

// Booking success modal controls.
(function(){
  const modal=document.getElementById('vcBookingSuccess'); if(!modal)return;
  const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
  modal.querySelectorAll('[data-booking-success-close]').forEach(b=>b.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
})();

// Premium customer helpers: rebook, saved places, trip sharing and rating.
function vcCustomerLocal(){try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}}
function vcSavedPlaces(){try{return JSON.parse(localStorage.getItem('vcSavedPlaces')||'{}')}catch(e){return {}}}
function vcSavePlace(kind,value){if(!value)return;const p=vcSavedPlaces();p[kind]=value;localStorage.setItem('vcSavedPlaces',JSON.stringify(p));const q=document.getElementById('vcSavedQuick');if(q)q.hidden=false;}
function vcShowSavedQuick(){const q=document.getElementById('vcSavedQuick');if(q){const p=vcSavedPlaces();q.hidden=!document.getElementById('fromPlace')?.value?.trim();q.querySelectorAll('[data-save-place]').forEach(b=>{b.textContent=p[b.dataset.savePlace]?'✓ '+(b.dataset.savePlace==='home'?'Home saved':'Work saved'):'＋ Save pickup as '+(b.dataset.savePlace==='home'?'Home':'Work');});}}
function vcBookingTimeline(status){const states=['Request created','Confirmed','Driver Assigned','On the Way','Arrived','Trip Started','Completed'];const current=states.indexOf(status);return '<div class="vcTimeline">'+states.map((x,i)=>'<div class="vcTimelineStep '+(i<=Math.max(current,0)?'done':'')+'"><span>'+(i<=Math.max(current,0)?'✓':i+1)+'</span><b>'+x+'</b></div>').join('')+'</div>';}
function vcShareBooking(b){const id=b.booking_id||b.id||'';const text=`Vijay Connect booking ${id}: ${b.pickup||b.from||'Pickup'} → ${b.dropoff||b.to||'Drop'}. Vehicle: ${b.vehicle||'Car'}. Date: ${b.travel_date||b.date||''} ${b.pickup_time||b.time||''}.`;if(navigator.share){navigator.share({title:'Vijay Connect trip',text}).catch(()=>{});}else{navigator.clipboard?.writeText(text);alert('Trip details copied.');}}
function vcRebook(b){const from=document.getElementById('fromPlace'),to=document.getElementById('toPlace'),date=document.getElementById('travelDate'),time=document.getElementById('pickupTime');if(from)from.value=b.pickup||b.from||'';if(to)to.value=b.dropoff||b.to||'';if(date)date.value='';if(time)time.value='';document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'center'});const vehicle=b.vehicle?.toLowerCase();document.querySelectorAll('[data-booking-vehicle]').forEach(x=>x.classList.toggle('selected',x.dataset.bookingVehicle===vehicle));}
function vcRateBooking(id){const r=prompt('Rate your Vijay Connect ride (1–5):','5');if(r===null)return;const n=Math.max(1,Math.min(5,Number(r)||5));const ratings=JSON.parse(localStorage.getItem('vcRatings')||'{}');ratings[id]=n;localStorage.setItem('vcRatings',JSON.stringify(ratings));if(window.VC_refreshBookings)window.VC_refreshBookings();}

document.querySelectorAll('[data-save-place]').forEach(b=>b.addEventListener('click',()=>{const v=document.getElementById('fromPlace')?.value?.trim();if(v){vcSavePlace(b.dataset.savePlace,v);vcShowSavedQuick();}})); document.getElementById('fromPlace')?.addEventListener('input',vcShowSavedQuick); vcShowSavedQuick();
// Customer booking history: cloud-first, local fallback, with a Flipkart-style order-list experience.
(function(){
 const modal=document.getElementById('vcBookingsModal'), list=document.getElementById('vcBookingsList'), openBtn=document.getElementById('vcHeaderBookings'), mobileBtn=document.getElementById('vcMobileBookings');
 if(!modal||!list||!openBtn)return;
 const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const session=()=>{try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}};
 const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
 function render(items){
   if(!items.length){list.innerHTML='<div class="vcBookingEmpty"><strong>No bookings yet</strong><br><span>Once you book a Vijay Connect cab, your trips will appear here.</span></div>';return;}
   list.innerHTML=items.map(b=>{
     const id=b.booking_id||b.id||'—', from=b.pickup||b.from||'Pickup', to=b.dropoff||b.to||'Drop', vehicle=b.vehicle||'—', service=b.service||'—', fare=b.fare||'Price on request', date=b.travel_date||b.date||'—', time=b.pickup_time||b.time||'—', status=b.status||'Request created';
     return `<article class="vcBookingItem"><div class="vcBookingItemTop"><strong>Booking ${esc(id)}</strong><span class="vcBookingStatus">✓ ${esc(status)}</span></div><div class="vcBookingRoute">${esc(from)} → ${esc(to)}</div><div class="vcBookingMeta"><span>Vehicle<b>${esc(vehicle)}</b></span><span>Service<b>${esc(service)}</b></span><span>Date & time<b>${esc(date)} • ${esc(time)}</b></span><span>Fare<b>${esc(fare)}</b></span></div>${vcBookingTimeline(status)}<div class="vcBookingActions"><a class="vcBookingTrack" href="track.html?booking=${encodeURIComponent(id)}">Track Cab</a><button type="button" data-share-booking="${esc(id)}">Share Trip</button><button type="button" data-rebook="${esc(id)}">Book Again</button><button type="button" data-rate-booking="${esc(id)}">Rate Ride</button></div></article>`;
   }).join('');
 }
 async function load(){
   list.innerHTML='<div class="vcBookingEmpty">Loading your bookings…</div>';
   const s=session(); let items=[];
   if(s?.access_token&&s?.user?.id&&window.VC_customerGetBookings){
     try{items=await VC_customerGetBookings(s.access_token,s.user.id);}catch(e){console.warn('Booking history cloud load:',e);}
   }
   if(!items.length){try{items=JSON.parse(localStorage.getItem('vcCustomerBookings')||'[]');}catch(e){items=[];}}
   render(items);
 }
 function open(){
   const s=session();
   if(!(s?.access_token&&s?.user?.id)){
     document.getElementById('vcHeaderAuth')?.click();
     return;
   }
   modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('vc-modal-open');load();
 }
 openBtn.addEventListener('click',open);
 if(mobileBtn)mobileBtn.addEventListener('click',()=>{open();document.getElementById('mobileMenu')?.classList.remove('is-open');document.getElementById('mobileMenu')?.setAttribute('aria-hidden','true');});
 modal.querySelectorAll('[data-bookings-close]').forEach(x=>x.addEventListener('click',close)); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
 window.VC_syncBookingsButton=function(){openBtn.hidden=false;if(mobileBtn)mobileBtn.hidden=false;};
 window.VC_refreshBookings=load;
 VC_syncBookingsButton();
})();

// Owner full-site editor: apply saved theme/content/image/contact settings.
(function(){
 const q=id=>document.getElementById(id); const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
 const c=activeState.vijayContent||get('vijayContent')||{}, im=activeState.vijayImages||get('vijayImages')||{}, th=activeState.vijayTheme||get('vijayTheme')||{}, co=activeState.vijayContact||get('vijayContact')||{}, bk=activeState.vijayBooking||get('vijayBooking')||{}, settings=activeState.vijaySettings||get('vijaySettings')||{};
 Object.keys(c).forEach(k=>{const el=q(k);if(el)el.innerHTML=c[k];document.querySelectorAll('[data-mirror="'+k+'"]').forEach(m=>{m.innerHTML=c[k]});});
 Object.keys(im).forEach(k=>{const el=q(k);if(el&&im[k])el.src=im[k]});
 const cssImageMap={trip1Photo:'.p1',trip2Photo:'.p2',trip3Photo:'.p3'};
 Object.keys(cssImageMap).forEach(k=>{if(im[k]) document.querySelectorAll(cssImageMap[k]).forEach(el=>{el.style.backgroundImage='url(\"'+String(im[k]).replaceAll('\"','%22')+'\")'});});
 if(im.logoImg) document.querySelectorAll('.logoImg,.footerBrand img').forEach(el=>el.src=im.logoImg);
 if(q('siteTitle')&&c.siteTitle)document.title=c.siteTitle.replace(/<[^>]*>/g,'');
 if(th.accent){document.documentElement.style.setProperty('--purple',th.accent);document.documentElement.style.setProperty('--purple2',th.accent);}
 if(th.bg)document.body.style.backgroundColor=th.bg;if(th.text)document.body.style.color=th.text;
 if(th.font)document.querySelectorAll('h1,h2,h3,.brandName,.btn').forEach(x=>x.style.fontFamily=th.font);
 if(th.bodyFont)document.body.style.fontFamily=th.bodyFont;
 if(q('bookingTitle')&&bk.title)q('bookingTitle').innerHTML=bk.title;if(q('bookingDesc')&&bk.desc)q('bookingDesc').innerHTML=bk.desc;
 if(co.phone){document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.href='tel:'+co.phone.replace(/\D/g,''));}
 if(co.email){document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+co.email;a.textContent=co.email})}
 if(co.address){const candidates=[...document.querySelectorAll('p')].filter(x=>x.textContent.includes('TNHM colony'));candidates.forEach(x=>x.textContent=co.address)}
 const hero=document.querySelector('.hero'); if(hero&&th.motion)hero.dataset.motion=th.motion; const offerSection=q('updatesSection'); if(offerSection) offerSection.style.display=settings.offerVisible===true?'block':'none';
})();

/* V31: opening banner is shown once per website session. sessionStorage survives route-page navigation and resets when the tab/window is closed. */
(function(){
  const splash=document.getElementById('festivalSplash');
  if(!splash)return;
  let alreadyShown=false;
  try{alreadyShown=sessionStorage.getItem('vcWelcomeSplashShown')==='1';}catch(e){}
  if(alreadyShown){splash.remove();return;}
  try{sessionStorage.setItem('vcWelcomeSplashShown','1');}catch(e){}
  const now=Date.now();
  let banners=[];
  try{banners=Array.isArray(activeState.vijayFestivalBanners)?activeState.vijayFestivalBanners:[]}catch(e){banners=[]}
  const active=banners.find(b=>b && b.enabled===true && b.start && b.end && now>=new Date(b.start).getTime() && now<new Date(b.end).getTime());
  const legacy=active ? null : (settings.splashEnabled===true && (!settings.splashStart||now>=new Date(settings.splashStart).getTime()) && (!settings.splashEnd||now<new Date(settings.splashEnd).getTime()) ? {name:'Vijay Connect Festival Special',image:'festival-drive-poster.webp',duration:settings.splashDuration||1000}:null);
  const item=active||legacy||{name:'Welcome to Vijay Connect',image:'festival-drive-poster.webp',duration:1000};
  const img=splash.querySelector('img');
  const mark=splash.querySelector('.splashMark');
  if(img&&item.image)img.src=item.image;
  if(img&&item.name)img.alt='Vijay Connect '+item.name+' banner';
  if(mark)mark.textContent='VIJAY CONNECT • '+String(item.name||'FESTIVAL SPECIAL').toUpperCase();
  const duration=Math.max(500,Math.min(10000,Number(item.duration||1000)));
  setTimeout(()=>splash.classList.add('hide'),duration);
  setTimeout(()=>splash.remove(),duration+400);
  const campaign=document.getElementById('festivalCampaign');
  if(campaign) campaign.classList.toggle('is-visible', settings.offerVisible===true);
})();

function renderHomePromos(){
 const fallback={visible:true,title:"Latest offers & celebrations",desc:"Special fares, festival announcements and limited-time offers from Vijay Connect.",hero:[{id:"default",title:"Celebrate the journey",desc:"Festival rides, special offers and easy booking from Vijay Connect.",image:"festival-drive-poster.webp",button:"Book Now",link:"#contact",enabled:true}]};
 let p; try{p=activeState.vijayHomePromos||JSON.parse(localStorage.getItem("vijayHomePromos")||"null")||fallback}catch(e){p=fallback}
 const sec=document.getElementById("festivalCampaign"); if(!sec)return; sec.style.display=p.visible===false?"none":"block";
 const title=document.getElementById("promoTitle"),desc=document.getElementById("promoDesc"); if(title)title.textContent=p.title||fallback.title;if(desc)desc.textContent=p.desc||fallback.desc;
 const hr=document.getElementById("promoHeroRail"); if(!hr)return;
 const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const slides=(p.hero||[]).filter(x=>x.enabled!==false).slice(0,5);
 hr.innerHTML=slides.map((x,i)=>`<article class="promoHeroCard promoHeroSlide" data-slide="${i}"><img src="${esc(x.image)}" alt="${esc(x.title||'Vijay Connect offer')}" loading="lazy" onerror="this.onerror=null;this.src='festival-drive-poster.webp';"><div class="promoHeroShade"></div><div class="promoHeroCopy"><span>VIJAY CONNECT • SPECIAL OFFER</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>${x.link?`<a href="${esc(x.link)}">${esc(x.button||'Book Now')} <b>→</b></a>`:""}</div></article>`).join("");
 if(slides.length>1){ let i=0; const show=()=>{const cards=hr.querySelectorAll('.promoHeroSlide');cards.forEach((c,n)=>c.classList.toggle('active',n===i));i=(i+1)%cards.length;}; show(); clearInterval(window.vcPromoTimer); window.vcPromoTimer=setInterval(show,5000); } else { clearInterval(window.vcPromoTimer); const c=hr.querySelector('.promoHeroSlide'); if(c)c.classList.add('active'); }
}

document.addEventListener("DOMContentLoaded",renderHomePromos);
window.addEventListener("pageshow",renderHomePromos);

// Customer account popup: email/password registration + Google sign-in.
(function(){
  function initCustomerAuth(){
    const modal=document.getElementById('vcAuthModal'), form=document.getElementById('vcAuthForm');
    const email=document.getElementById('vcAuthEmail'), password=document.getElementById('vcAuthPassword');
    const confirm=document.getElementById('vcAuthConfirm'), confirmField=document.getElementById('vcConfirmField');
    const status=document.getElementById('vcAuthStatus'), submit=document.getElementById('vcAuthSubmit');
    const google=document.getElementById('vcGoogleBtn'), facebook=document.getElementById('vcFacebookBtn'), divider=document.getElementById('vcAuthDivider');
    const googleText=document.getElementById('vcGoogleText'), facebookText=document.getElementById('vcFacebookText');
    const forgot=document.getElementById('vcForgotPassword');
    const registerBtn=document.getElementById('vcRegisterMode'), loginBtn=document.getElementById('vcLoginMode');
    const lead=document.getElementById('vcAuthLead'), foot=document.getElementById('vcAuthFootnote'), switchBox=document.getElementById('vcAuthSwitch');
    if(!modal||!form||!email||!password) return;

    let mode='register';
    const authDismissed=()=>{try{return sessionStorage.getItem('vcAuthDismissed')==='1'}catch(e){return false}};
    const markAuthDismissed=()=>{try{sessionStorage.setItem('vcAuthDismissed','1')}catch(e){}};
    const clearAuthDismissed=()=>{try{sessionStorage.removeItem('vcAuthDismissed')}catch(e){}};
    const session=()=>{try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}};
    const tokenPayload=token=>{try{
      const part=String(token||'').split('.')[1]; if(!part)return null;
      const b=part.replace(/-/g,'+').replace(/_/g,'/');
      return JSON.parse(decodeURIComponent(atob(b.padEnd(Math.ceil(b.length/4)*4,'=')).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    }catch(e){return null}};
    const isSignedIn=()=>{
      const s=session(); if(!s?.access_token)return false;
      const p=tokenPayload(s.access_token); return !p?.exp||p.exp*1000>Date.now()+15000;
    };
    const getUserName=()=>{
      const s=session(); return String(s?.profile?.full_name||s?.user?.user_metadata?.full_name||s?.user?.email?.split('@')[0]||'').trim();
    };
    const syncAuthButtons=()=>{
      const signed=isSignedIn();
      const header=document.getElementById('vcHeaderAuth'), mobile=document.getElementById('vcMobileSignIn');
      [header,mobile].forEach(b=>{if(!b)return;b.textContent='Login / Sign up';b.hidden=signed;});
      window.VC_syncBookingsButton?.();
      updateGreeting(signed ? getUserName() : '');
    };
    const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
    const open=()=>{
      if(isSignedIn()) return;
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('vc-modal-open');
      setTimeout(()=>{email?.focus()},80);
    };
    const setMode=m=>{
      mode=m;
      const reg=m==='register';
      const title=document.getElementById('vcAuthTitle');
      confirmField.hidden=!reg; confirm.required=reg;
      registerBtn.classList.toggle('active',reg); loginBtn.classList.toggle('active',!reg);
      if(title) title.textContent=reg ? 'Create your account' : 'Welcome back';
      lead.textContent=reg ? 'Create your Vijay Connect account with your email and password.' : 'Login with your Vijay Connect email and password.';
      submit.textContent=reg?'Signup':'Login';
      forgot.hidden=reg;
      googleText.textContent=reg?'Signup with Google':'Login with Google';
      facebookText.textContent=reg?'Signup with Facebook':'Login with Facebook';
      switchBox.innerHTML=reg ? 'Already have an account? <button type="button" data-switch-login>Login</button>' : "Don't have an account? <button type='button' data-switch-signup>Signup</button>";
      switchBox.querySelector('[data-switch-login]')?.addEventListener('click',()=>setMode('login'));
      switchBox.querySelector('[data-switch-signup]')?.addEventListener('click',()=>setMode('register'));
      status.textContent=''; status.className='vcAuthStatus';
      foot.textContent=reg?'Use a real email address. You will receive a verification email before your first email/password login.':'Use the same email and password you used when creating your Vijay Connect account.';
      [email,password,confirm].forEach(x=>{if(x){x.value='';x.readOnly=false;}});
      password.autocomplete=reg?'new-password':'current-password';
      password.placeholder=reg?'Create password':'Enter password';
      if(confirm) { confirm.autocomplete='new-password'; confirm.placeholder='Confirm password'; }
      if(confirmField) confirmField.style.display=reg?'':'none';
    };
    [registerBtn,loginBtn].forEach(b=>b&&b.addEventListener('click',()=>setMode(b===registerBtn?'register':'login')));
    [document.getElementById('vcHeaderAuth'),document.getElementById('vcMobileSignIn')].forEach(b=>b&&b.addEventListener('click',open));
    document.querySelectorAll('[data-auth-dismiss]').forEach(b=>b.addEventListener('click',()=>{markAuthDismissed();close();syncAuthButtons();}));
    document.querySelectorAll('[data-auth-skip]').forEach(b=>b.addEventListener('click',()=>{close();syncAuthButtons();}));
    const startOAuth=(provider)=>{
      try{ status.textContent=`Opening ${provider==='google'?'Google':'Facebook'}…`; status.className='vcAuthStatus';
        provider==='google'?VC_customerGoogleSignIn():VC_customerFacebookSignIn();
      }catch(err){ const raw=String(err?.message||''); const msg=/provider.*not.*enabled|unsupported provider|provider is not enabled/i.test(raw)?`${provider==='google'?'Google':'Facebook'} login is not enabled in the Supabase Auth provider settings yet.`:(raw||`${provider} sign in is unavailable.`); status.textContent='⚠️ '+msg; status.className='vcAuthStatus warn'; }
    };
    google?.addEventListener('click',()=>startOAuth('google'));
    facebook?.addEventListener('click',()=>startOAuth('facebook'));
    forgot?.addEventListener('click',async()=>{
      const em=String(email.value||'').trim().toLowerCase();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){status.textContent='⚠️ Enter your email first.';status.className='vcAuthStatus warn';return;}
      try{await VC_customerResetPassword(em,location.origin+location.pathname);status.textContent=`✓ Password reset email sent to ${em}.`;status.className='vcAuthStatus good';}
      catch(err){status.textContent='⚠️ '+(err.message||'Could not send reset email.');status.className='vcAuthStatus warn';}
    });

    async function finishSession(j,created){
      if(!j?.access_token||!j?.user?.id) throw new Error('Authentication response was incomplete. Please try again.');
      const sess={access_token:j.access_token,refresh_token:j.refresh_token||'',user:j.user};
      localStorage.setItem('vcCustomerSession',JSON.stringify(sess));
      // Profile name/DOB are kept in Supabase Auth user metadata; no phone is required here.
      try{
        const profile=await VC_customerGetProfile(j.access_token,j.user.id);
        if(profile) sess.profile=profile;
      }catch(e){}
      localStorage.setItem('vcCustomerSession',JSON.stringify(sess));
      clearAuthDismissed(); syncAuthButtons();
      showGreeting(getUserName(),created?'account':'sign in');
      status.textContent=created?'✓ Account created successfully':'✓ Signed in successfully';
      status.className='vcAuthStatus good';
      setTimeout(close,650);
    }

    form.addEventListener('submit',async e=>{
      e.preventDefault(); submit.disabled=true; status.className='vcAuthStatus'; status.textContent='';
      try{
        const em=String(email.value||'').trim().toLowerCase();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('Enter a valid email address.');
        if(mode==='register'){
          if(String(confirm.value||'')!==String(password.value||'')) throw new Error('Passwords do not match.');
          const j=await VC_customerSignUp(em,password.value);
          const confirmed=!!(j?.user?.email_confirmed_at||j?.user?.confirmed_at||j?.user?.email_verified_at);
          if(!j?.access_token || !confirmed){
            setMode('login'); email.value=em; password.value=''; confirm.value='';
            status.textContent=`✓ Verification email sent to ${em}. Open it and click the verification link, then login.`;
            status.className='vcAuthStatus good'; return;
          }
          await finishSession(j,true);
        }else{
          const j=await VC_customerSignIn(em,password.value);
          await finishSession(j,false);
        }
      }catch(err){
        let msg=err?.message||'Please try again.';
        if(/email not confirmed/i.test(msg)) msg='Please verify your email first, then sign in.';
        else if(/invalid login credentials/i.test(msg)) msg='Email or password is incorrect.';
        status.textContent='⚠️ '+msg; status.className='vcAuthStatus warn';
      }finally{submit.disabled=false;}
    });

    setMode('register');

    // Supabase OAuth returns the access token in the URL hash for the implicit flow.
    (async function handleOAuthCallback(){
      const hash=new URLSearchParams(location.hash.replace(/^#/,''));
      const access=hash.get('access_token'), refresh=hash.get('refresh_token');
      if(!access) return;
      try{
        const payload=tokenPayload(access);
        const callbackType=hash.get('type')||'';
        const sess={access_token:access,refresh_token:refresh||'',user:{
          id:payload?.sub,
          email:payload?.email||'',
          user_metadata:payload?.user_metadata||payload?.app_metadata||{}
        }};
        localStorage.setItem('vcCustomerSession',JSON.stringify(sess));
        history.replaceState(null,'',location.pathname+location.search);
        syncAuthButtons();
        showGreeting(getUserName(),callbackType==='signup'?'verified':'sign in');
      }catch(e){ status.textContent='⚠️ Social sign in could not be completed. Please try again.'; status.className='vcAuthStatus warn'; }
    })();

    (async()=>{
      const s=session();
      if(s?.refresh_token){
        try{
          const j=await VC_customerRefresh(s.refresh_token);
          if(j?.access_token){
            s.access_token=j.access_token; s.refresh_token=j.refresh_token||s.refresh_token; s.user=j.user||s.user;
            localStorage.setItem('vcCustomerSession',JSON.stringify(s));
          }
        }catch(e){localStorage.removeItem('vcCustomerSession');}
      }
      syncAuthButtons();
    })();
  }

  function greetingText(name){
    const hour=new Date().getHours();
    const period=hour<12?'Good morning':hour<17?'Good afternoon':hour<21?'Good evening':'Good night';
    return {period, message:`${period}, ${name || 'welcome'}!`, hour};
  }
  function updateGreeting(name){
    const bar=document.getElementById('vcGreetingBar'), text=document.getElementById('vcGreetingBarText');
    const mobile=document.getElementById('vcMobileGreeting');
    if(!bar||!text)return;
    if(!name){bar.hidden=true;if(mobile)mobile.hidden=true;return;}
    const g=greetingText(name);
    text.textContent=g.message; bar.hidden=false;
    if(mobile){mobile.textContent=g.message;mobile.hidden=false;}
  }
  function showGreeting(name,reason){
    if(!name)return;
    const g=greetingText(name);
    const popup=document.getElementById('vcGreetingPopup'), title=document.getElementById('vcGreetingTitle');
    const time=document.getElementById('vcGreetingTime'), msg=document.getElementById('vcGreetingText');
    if(!popup)return;
    time.textContent=g.period.toUpperCase();
    title.textContent=g.message;
    msg.textContent=reason==='account'
      ? 'Welcome to Vijay Connect. Your account is ready.'
      : reason==='verified'
      ? 'Your email has been verified successfully.'
      : 'Welcome back to Vijay Connect.';
    popup.classList.add('is-open'); popup.setAttribute('aria-hidden','false');
    document.body.classList.add('vc-modal-open');
    clearTimeout(window.vcGreetingTimer);
    window.vcGreetingTimer=setTimeout(()=>closeGreeting(),1000);
  }
  function closeGreeting(){
    const popup=document.getElementById('vcGreetingPopup');
    if(popup){popup.classList.remove('is-open');popup.setAttribute('aria-hidden','true');}
    document.body.classList.remove('vc-modal-open');
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('vcGreetingClose')?.addEventListener('click',closeGreeting);
    document.querySelectorAll('#vcGreetingPopup [id="vcGreetingClose"]').forEach(x=>x.addEventListener('click',closeGreeting));
  });
  window.vcGreetingClose=closeGreeting;
  window.vcUpdateGreeting=updateGreeting;
  document.addEventListener('DOMContentLoaded',initCustomerAuth);
})();

/* Vijay Connect — current location pickup. Browser owns the native permission dialog. */
(function(){
  if(!('geolocation' in navigator)) return;
  let requestedThisVisit=false, map=null, marker=null, accuracyCircle=null, current=null;
  const $=id=>document.getElementById(id);
  const AUTO_LOCATION_KEY='vcLocationAutoPromptShown';
  function autoPromptAlreadyShown(){try{return sessionStorage.getItem(AUTO_LOCATION_KEY)==='1';}catch(e){return false;}}
  function markAutoPromptShown(){try{sessionStorage.setItem(AUTO_LOCATION_KEY,'1');}catch(e){}}
  async function permissionState(){try{if(!navigator.permissions?.query)return 'unknown';const p=await navigator.permissions.query({name:'geolocation'});return p.state;}catch(e){return 'unknown';}}
  function setStatus(msg,good=false){const el=$('vcLocationStatus');if(el){el.textContent=msg;el.style.color=good?'#15803d':'#64748b';}}
  function initMap(lat,lng){
    const box=$('vcCurrentLocationCard'); if(!box||typeof L==='undefined') return;
    box.hidden=false;
    if(!map){
      map=L.map('vcMiniMap',{zoomControl:true,scrollWheelZoom:false}).setView([lat,lng],16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
      marker=L.marker([lat,lng]).addTo(map).bindPopup('<b>Your current location</b>');
      accuracyCircle=L.circle([lat,lng],{radius:Math.max(current?.accuracy||30,20),weight:1,fillOpacity:.12}).addTo(map);
    }else{map.setView([lat,lng],16);marker.setLatLng([lat,lng]);accuracyCircle.setLatLng([lat,lng]).setRadius(Math.max(current?.accuracy||30,20));}
    setTimeout(()=>map.invalidateSize(),80);
  }
  async function reverseGeocode(lat,lng){
    try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+encodeURIComponent(lat)+'&lon='+encodeURIComponent(lng)+'&zoom=18&addressdetails=1',{headers:{'Accept':'application/json'}});if(!r.ok)throw new Error('reverse geocode failed');const d=await r.json();const a=d.address||{};const parts=[a.road,a.neighbourhood||a.suburb,a.city||a.town||a.village].filter(Boolean);return parts.slice(0,3).join(', ')||d.display_name||'';}catch(e){return '';}
  }
  async function handlePosition(position){
    const lat=position.coords.latitude,lng=position.coords.longitude;current={lat,lng,accuracy:position.coords.accuracy,timestamp:Date.now()};window.vijayConnectCurrentLocation=current;window.dispatchEvent(new CustomEvent('vijayconnect:location',{detail:current}));
    const coord=$('vcCurrentLocationCoords');if(coord)coord.textContent=lat.toFixed(6)+', '+lng.toFixed(6)+' • ±'+Math.round(position.coords.accuracy)+' m';setStatus('✓ Location enabled',true);initMap(lat,lng);
    const name=await reverseGeocode(lat,lng);const title=$('vcCurrentLocationName');if(title)title.textContent=name||'Current location detected';const from=$('fromPlace');if(from&&(!from.value.trim()||from.dataset.vcLocation==='true')){from.value=name||('Current location ('+lat.toFixed(5)+', '+lng.toFixed(5)+')');from.dataset.vcLocation='true';from.dataset.vcLastLocation=from.value;from.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  async function requestLocation(force=false){
    if(requestedThisVisit)return;
    if(!force&&autoPromptAlreadyShown())return;
    if(!force)markAutoPromptShown();
    requestedThisVisit=true;
    if(window.isSecureContext===false&&location.protocol!=='file:'){setStatus('Location needs HTTPS or localhost. Please open the website on a secure address.');requestedThisVisit=false;return;}
    const state=await permissionState();
    if(!force&&(state==='granted'||state==='denied')){if(state==='granted')navigator.geolocation.getCurrentPosition(handlePosition,()=>{setStatus('Location permission is enabled, but the current location could not be read. Please check your device Location Services.');},{enableHighAccuracy:true,timeout:20000,maximumAge:60000});else setStatus('Location permission is blocked for this site. Tap the browser site settings and set Location to Allow.');requestedThisVisit=false;return;}
    setStatus('Requesting location permission…');
    navigator.geolocation.getCurrentPosition(handlePosition,function(err){requestedThisVisit=false;if(err&&err.code===1)setStatus('Location permission was blocked. Open browser site settings → Location → Allow, then tap Use my current location again.');else if(err&&err.code===2)setStatus('Your location could not be detected. Please try again.');else if(err&&err.code===3)setStatus('Location request timed out. Please try again.');else setStatus('Could not get your location. Please try again.');},{enableHighAccuracy:true,timeout:20000,maximumAge:0});
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    const btn=$('vcUseLocationBtn');if(btn)btn.addEventListener('click',()=>{requestedThisVisit=false;requestLocation(true);});
    const clear=$('vcClearLocationBtn');
    const from=$('fromPlace');
    if(clear&&from) clear.addEventListener('click',()=>{from.value='';from.dataset.vcLocation='';from.focus();from.dispatchEvent(new Event('input',{bubbles:true}));setStatus('Pickup cleared. Enter another place or use your current location.');});
    if(from) from.addEventListener('input',()=>{ if(from.dataset.vcLocation==='true' && from.value.trim()!==from.dataset.vcLastLocation) from.dataset.vcLocation=''; });
    const center=$('vcLocationCenterBtn');if(center)center.addEventListener('click',()=>{if(current&&map){map.setView([current.lat,current.lng],17);marker.openPopup();}});
    const state=await permissionState();
    if(state==='granted'){ requestedThisVisit=false; requestLocation(true); }
    else if(!autoPromptAlreadyShown()) document.addEventListener('pointerdown',()=>requestLocation(false),{once:true,passive:true});
  });
})();
