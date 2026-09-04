const papers = [
  {id:1,title:'Attention Is All You Need',author:'Vaswani et al. · 2017',tag:'人工智能',status:'reading',progress:72,color:'#3e6653',favorite:true},
  {id:2,title:'The Design of Everyday Things',author:'Donald A. Norman · 2013',tag:'人机交互',status:'reading',progress:46,color:'#b86549',favorite:false},
  {id:3,title:'Situated Learning: Legitimate Peripheral Participation',author:'Lave & Wenger · 1991',tag:'认知科学',status:'unread',progress:0,color:'#68798a',favorite:true},
  {id:4,title:'Research Design: Qualitative, Quantitative, and Mixed Methods',author:'John W. Creswell · 2018',tag:'研究方法',status:'done',progress:100,color:'#8b7456',favorite:false},
  {id:5,title:'Human–AI Interaction Guidelines',author:'Amershi et al. · 2019',tag:'人机交互',status:'unread',progress:0,color:'#586e65',favorite:false},
  {id:6,title:'How People Learn II: Learners, Contexts, and Cultures',author:'National Academies · 2018',tag:'教育技术',status:'done',progress:100,color:'#76687e',favorite:true}
];

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const labels={reading:'在读',unread:'待读',done:'已完成'};
function renderContinue(){ $('#continueGrid').innerHTML=papers.filter(p=>p.status==='reading').map(p=>`<article class="continue-card"><div class="paper-cover" style="background:${p.color}"><small>${p.tag.toUpperCase()}</small><span>${p.title}</span></div><div class="continue-info"><span class="category">${p.tag}</span><h3>${p.title}</h3><p>${p.author}</p><div class="reading-progress"><div class="progress"><i style="width:${p.progress}%"></i></div><small>${p.progress}%</small></div><button onclick="advance(${p.id})">继续阅读 →</button></div></article>`).join('') }
function rows(filter='all'){return papers.filter(p=>filter==='all'||p.status===filter).map(p=>`<article class="paper-row"><div class="paper-icon">文</div><div><h3>${p.title}</h3><p>${p.author} · ${p.tag}</p></div><span class="status ${p.status}">${labels[p.status]}</span></article>`).join('')||'<div style="padding:35px;text-align:center;color:var(--muted)">没有符合条件的文献</div>'}
function renderLibrary(filter='all',query=''){let data=papers.filter(p=>(filter==='all'||(filter==='favorite'?p.favorite:p.status===filter))&&(p.title+p.author+p.tag).toLowerCase().includes(query.toLowerCase()));$('#paperCount').textContent=`共 ${data.length} 篇`;$('#libraryGrid').innerHTML=data.map(p=>`<article class="library-card"><button class="favorite ${p.favorite?'active':''}" onclick="toggleFavorite(${p.id})">${p.favorite?'♥':'♡'}</button><div class="paper-icon" style="background:${p.color}20;color:${p.color}">文</div><span class="category">${p.tag}</span><h3>${p.title}</h3><p>${p.author}</p><footer><span class="status ${p.status}">${labels[p.status]}</span><small>${p.progress}%</small></footer></article>`).join('')}
function renderRows(filter='all'){ $('#paperList').innerHTML=rows(filter) }
function toggleFavorite(id){let p=papers.find(x=>x.id===id);p.favorite=!p.favorite;renderLibrary(currentLibrary,$('#globalSearch').value);toast(p.favorite?'已收藏':'已取消收藏')}
function advance(id){let p=papers.find(x=>x.id===id);p.progress=Math.min(100,p.progress+4);if(p.progress===100)p.status='done';renderContinue();renderRows();toast(`阅读进度已更新至 ${p.progress}%`)}
function toast(msg){let t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
renderContinue();renderRows();renderLibrary();

$$('.nav-link').forEach(a=>a.onclick=()=>{let id=a.dataset.page;$$('.nav-link').forEach(x=>x.classList.toggle('active',x===a));$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$('#sidebar').classList.remove('open');window.scrollTo(0,0)});
$('.view-all').onclick=e=>{$('.nav-link[data-page="library"]').click()};
$$('[data-filter]').forEach(b=>b.onclick=()=>{$$('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderRows(b.dataset.filter)});
let currentLibrary='all';$$('[data-library]').forEach(b=>b.onclick=()=>{$$('[data-library]').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentLibrary=b.dataset.library;renderLibrary(currentLibrary,$('#globalSearch').value)});
$('#globalSearch').oninput=e=>{renderLibrary(currentLibrary,e.target.value);if(e.target.value){$('.nav-link[data-page="library"]').click()}};
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();$('#globalSearch').focus()}if(e.key==='Escape')$('#addModal').classList.remove('open')});
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');$('#themeBtn').onclick=()=>document.body.classList.toggle('dark');
$('#addBtn').onclick=()=>$('#addModal').classList.add('open');$('#closeModal').onclick=()=>$('#addModal').classList.remove('open');$('#addModal').onclick=e=>{if(e.target.id==='addModal')e.currentTarget.classList.remove('open')};
$('#confirmAdd').onclick=()=>{let title=$('#newTitle').value.trim();if(!title)return toast('请填写文献标题');papers.unshift({id:Date.now(),title,author:$('#newAuthor').value.trim()||'未知作者',tag:$('#newTag').value,status:'unread',progress:0,color:'#496b5a',favorite:false});renderRows();renderLibrary();$('#addModal').classList.remove('open');$('#newTitle').value='';$('#newAuthor').value='';toast('文献已添加')};
$('#saveNote').onclick=()=>{localStorage.setItem('zhiye-note',JSON.stringify({title:$('#noteTitle').value,body:$('#noteBody').value}));$('#saveStatus').textContent='刚刚保存';toast('笔记已保存到本地')};
try{let n=JSON.parse(localStorage.getItem('zhiye-note'));if(n){$('#noteTitle').value=n.title;$('#noteBody').value=n.body}}catch(e){}
let seconds=1500,timerId=null;$('#focusBtn').onclick=()=>{if(timerId){clearInterval(timerId);timerId=null;$('#focusBtn').textContent='继续专注'}else{timerId=setInterval(()=>{if(seconds<=0){clearInterval(timerId);timerId=null;toast('完成一次专注阅读！');seconds=1500}else seconds--;$('#timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`},1000);$('#focusBtn').textContent='暂停'}};
const days=['一','二','三','四','五','六','日'],values=[32,45,28,54,45,0,0];$('#chart').innerHTML=values.map((v,i)=>`<div class="bar-wrap"><div class="bar" data-value="${v}" style="height:${v?Math.max(v/60*90,8):2}%"></div><span>周${days[i]}</span></div>`).join('');
