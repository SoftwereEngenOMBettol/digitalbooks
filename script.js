/* ============================================================
   1. ✅ جديد: مؤشر الماوس السائل
============================================================ */
(function initCursor(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.getElementById('cursor-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var palette = ['#ffb4a2','#f5c6d6','#e8d5a8','#f0c9a8','#e8b4a0','#ff6b9d','#a78bfa'];
  var particles = [];

  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function(e){
    if (Math.random() < 0.5) {
      particles.push({
        x: e.clientX + (Math.random()-.5)*10,
        y: e.clientY + (Math.random()-.5)*10,
        r: 14 + Math.random()*22,
        life: 1,
        decay: 0.016 + Math.random()*0.014,
        color: palette[(Math.random()*palette.length)|0],
        vx: (Math.random()-.5)*0.7,
        vy: (Math.random()-.5)*0.7
      });
    }
  });

  (function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(function(p){ return p.life > 0; });
    particles.forEach(function(p){
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      var rad = p.r * (0.4 + p.life*0.6);
      var g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);
      g.addColorStop(0, p.color);
      g.addColorStop(1, 'transparent');
      ctx.globalAlpha = p.life * 0.35;
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   2. ✅ جديد: بيانات الكتب (عدّل الروابط والعناوين من هنا)
   ⚠️ ضع اسم صورة الغلاف في cover، وإذا تركتها فارغة ''
       سيظهر مربع رمادي مكتوب عليه "ضع صورة الغلاف هنا"
============================================================ */
var BOOKS = {
  kids: [
    { title_ar:'تلوين الصغار 1', title_en:'Kids Coloring 1', price:'$15',
      desc_ar:'رسومات بسيطة ومحببة للأطفال الصغار.', desc_en:'Simple, lovable drawings for young children.',
      cover:'assets/cover-kids.png', url:'https://herewe.gumroad.com/l/coloringbook1' },
    { title_ar:'تلوين الصغار 2', title_en:'Kids Coloring 2', price:'$17',
      desc_ar:'حيوانات، فواكه، ومركبات لتلوينها بمرح.', desc_en:'Animals, fruits, and vehicles to color happily.',
      cover:'', url:'https://herewe.gumroad.com/l/coloringbook2' },
    { title_ar:'تلوين الصغار 3', title_en:'Kids Coloring 3', price:'$19',
      desc_ar:'مستوى متوسط مع تفاصيل أكثر تشويقًا.', desc_en:'Intermediate level with more exciting details.',
      cover:'', url:'https://herewe.gumroad.com/l/colorinbook3' }
  ],
  adults: [
    { title_ar:'تلوين الكبار 1', title_en:'Adult Coloring 1', price:'$20',
      desc_ar:'ماندالا وأنماط هندسية للاسترخاء.', desc_en:'Mandalas and geometric patterns to relax.',
      cover:'assets/cover-adult-kids.png', url:'https://herewe.gumroad.com/l/coloringbook1' },
    { title_ar:'تلوين الكبار 2', title_en:'Adult Coloring 2', price:'$22',
      desc_ar:'زخارف إسلامية وتفاصيل دقيقة.', desc_en:'Islamic ornaments and fine details.',
      cover:'', url:'https://herewe.gumroad.com/l/coloringbook2' },
    { title_ar:'تلوين الكبار 3', title_en:'Adult Coloring 3', price:'$24',
      desc_ar:'طبيعة ومناظر هادئة بأسلوب فني.', desc_en:'Nature and calm scenes in artistic style.',
      cover:'', url:'https://herewe.gumroad.com/l/colorinbook3' }
  ],
  digital: [
    { title_ar:'من فكرة إلى بيع منتج رقمي', title_en:'From Idea to First Sale', price:'$20',
      desc_ar:'دليل عملي من الفكرة إلى Gumroad والتسويق.', desc_en:'Practical guide from idea to Gumroad and marketing.',
      cover:'assets/guide-idea-to-sale.png', url:'https://herewe.gumroad.com/l/digitalbook' }
  ]
};

/* ============================================================
   3. ✅ جديد: بناء البطاقات ديناميكيًا
============================================================ */
function cardHTML(b, i, group){
  var lang = document.documentElement.lang || 'ar';
  var title = lang === 'ar' ? b.title_ar : b.title_en;
  var desc  = lang === 'ar' ? b.desc_ar  : b.desc_en;
  var cover = b.cover
    ? '<img src="' + b.cover + '" alt="' + title + '" onerror="this.outerHTML=\'<div class=&quot;slot&quot;>ضع صورة الغلاف هنا</div>\'">'
    : '<div class="slot">ضع صورة الغلاف هنا</div>';
  return '<article class="card">' +
    '<div class="cover">' + cover + '<span class="tag">DIGITAL</span></div>' +
    '<div class="info">' +
      '<div class="row"><h3>' + title + '</h3><span class="price">' + b.price + '</span></div>' +
      '<p>' + desc + '</p>' +
      '<div class="btns">' +
        '<a class="buy" href="' + b.url + '" target="_blank" rel="noopener" data-i18n="buy">شاهد المنتج واشترِ ↗</a>' +
        '<button class="prev" data-group="' + group + '" data-i="' + i + '" data-i18n="preview">معاينة صفحات من الكتاب</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function renderGrids(){
  var map = { kids:'gridKids', adults:'gridAdults', digital:'gridDigital' };
  Object.keys(map).forEach(function(g){
    var el = document.getElementById(map[g]);
    if(!el) return;
    el.innerHTML = BOOKS[g].map(function(b,i){ return cardHTML(b,i,g); }).join('');
  });
  bindPreviewButtons();
}

/* ============================================================
   4. الترجمة (مع إضافة الكلمات الجديدة)
============================================================ */
var EN = {
  navHome:"Home",navBooks:"Books",navKids:"Kids Coloring",navAdults:"Adult Coloring",
  navHow:"How it works",navAbout:"About",navCta:"Explore books ↘",
  eyebrow:"Digital products made for enjoyment",
  h1a:"Your free time can be",h1b:"far more creative.",
  heroP:"Coloring books for kids and adults, plus practical digital guides — open it, start, enjoy.",
  ctaPrimary:"See the collection ↓",ctaSecondary:"How buying works",
  trust1:"Instant download after payment",trust2:"Secure checkout on Gumroad",trust3:"Print-ready PDF file",
  noteA:"Take a break",noteB:"and color something beautiful.",
  collection:"Digital products",
  booksH2a:"Practical",booksH2b:"guides.",
  booksP:"A practical guide that walks you step by step from idea to building a digital product and selling it on Gumroad.",
  kidsEyebrow:"For little artists",kidsH2a:"Coloring books for",kidsH2b:"kids.",
  kidsP:"Simple, joyful drawings with easy levels, specially designed for children's hands and imagination.",
  adultsEyebrow:"Relax & create",adultsH2a:"Coloring books for",adultsH2b:"adults.",
  adultsP:"Rich details, mandalas, and ornaments that take you to a world of calm and focus away from the noise.",
  buy:"View product & buy ↗",preview:"Preview pages inside",
  coverSlot:"Drop the cover image here",
  howEyebrow:"How it works",
  howH2:"Three steps between choosing a book and coloring your first page.",
  step1t:"Choose your book",step1d:"Browse the collection and preview pages from inside before you buy.",
  step2t:"Check out on Gumroad",step2d:"You are taken to the product page on Gumroad to pay securely.",
  step3t:"Download and color",step3d:"The PDF arrives right after payment — print it or color it on your device.",
  ctaH2a:"Something small today,",ctaH2b:"makes a difference in your time.",
  ctaP:"Choose your book, hit buy, and you will be taken to its Gumroad page to complete the payment.",
  ctaBtn:"Browse the collection ↗",
  previewEyebrow:"Inside the book",
  previewNote:"Sample pages from the book. Drop real page images here to build buyer confidence.",
  slot1:"Sample page 1",slot2:"Sample page 2",slot3:"Sample page 3",
  b0t:"Coloring Book 1",b0d:"Varied drawings with easy and more challenging levels.",
  b1t:"Coloring Book 2",b1d:"Creative time for anyone who wants to color or relax.",
  b2t:"Coloring Book 3",b2d:"Open it at home, while travelling, or whenever you have a free moment.",
  b3t:"From Idea to First Sale",b3d:"A practical guide from idea to building the product, Gumroad, and marketing."
};
var AR = {};
document.querySelectorAll('[data-i18n]').forEach(function(el){ AR[el.dataset.i18n] = el.innerHTML; });

function applyLang(lang){
  var html = document.documentElement;
  html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  var dict = lang === 'ar' ? AR : EN;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v = dict[el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  });
  var btn = document.getElementById('lang');
  if(btn) btn.textContent = lang === 'ar' ? 'EN' : 'ع';
}

function setLang(lang){
  applyLang(lang);
  try { localStorage.setItem('herewe-lang', lang); } catch(e){}
  renderGrids();
}

var saved = 'ar';
try { saved = localStorage.getItem('herewe-lang') || 'ar'; } catch(e){}
document.getElementById('lang').addEventListener('click', function(){
  setLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
});

/* ============================================================
   5. نافذة المعاينة
============================================================ */
var modal = document.getElementById('modal');
function openModal(group, i){
  var b = BOOKS[group][i];
  var lang = document.documentElement.lang;
  document.getElementById('modal-title').textContent = lang === 'ar' ? b.title_ar : b.title_en;
  document.getElementById('modal-buy').href = b.url;
  modal.hidden = false;
}
function bindPreviewButtons(){
  document.querySelectorAll('.prev').forEach(function(btn){
    btn.onclick = function(){ openModal(btn.dataset.group, +btn.dataset.i); };
  });
}
document.getElementById('close').addEventListener('click', function(){ modal.hidden = true; });
modal.addEventListener('click', function(e){ if (e.target === modal) modal.hidden = true; });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') modal.hidden = true; });

/* ============================================================
   6. التمرير السلس
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
  });
});

/* ============================================================
   7. التشغيل
============================================================ */
renderGrids();
if (saved === 'en') setLang('en');
