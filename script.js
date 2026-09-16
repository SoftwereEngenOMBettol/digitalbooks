var EN = {"navBooks":"Books","navHow":"How it works","navWhy":"Why us","navAbout":"About","navCta":"Explore the books ↘","eyebrow":"Digital products made for enjoyment","h1a":"Your free time can be","h1b":"far more creative.","heroP":"Coloring books for kids and adults, plus practical digital guides — open it, start, enjoy.","ctaPrimary":"See the collection ↓","ctaSecondary":"How buying works","trust1":"Instant download after payment","trust2":"Secure checkout on Gumroad","trust3":"Print-ready PDF file","noteA":"Take a break","noteB":"and color something beautiful.","collection":"The collection","booksH2a":"Pick your","booksH2b":"favorite book.","booksP":"A collection built for different moments: from coloring and relaxing to learning how to build and sell a digital product.","buy":"View product & buy ↗","preview":"Preview pages inside","coverSlot":"Drop the Book 3 cover image here","howEyebrow":"How it works","howH2":"Three steps between choosing a book and coloring your first page.","step1t":"Choose your book","step1d":"Browse the collection and preview pages from inside before you buy.","step2t":"Check out on Gumroad","step2d":"You are taken to the product page on Gumroad to pay securely.","step3t":"Download and color","step3d":"The PDF arrives right after payment — print it or color it on your device.","whyEyebrow":"More than a book","whyH2a":"Make your own","whyH2b":"moment.","whyP":"A coloring book is not only for children. You will find easy levels and more detailed ones, so you can match your time and your mood.","f1t":"Kids and adults","f1d":"Simple levels and more challenging ones.","f2t":"Anywhere","f2d":"Home, the bus, travel, a café, or while waiting.","f3t":"Time away from screens","f3d":"A quiet, creative activity when you want to change the routine.","ctaH2a":"Something small today,","ctaH2b":"makes a difference in your time.","ctaP":"Choose your book, hit buy, and you will be taken to its Gumroad page to complete the payment.","ctaBtn":"Browse the collection ↗","previewEyebrow":"Inside the book","previewNote":"Sample pages from the book. Drop real page images here to build buyer confidence.","slot1":"Sample page 1","slot2":"Sample page 2","slot3":"Sample page 3","b0t":"Coloring Book 1","b0d":"Varied drawings with easy and more challenging levels, for kids and adults alike.","b1t":"Coloring Book 2","b1d":"Creative time for anyone who wants to color, relax, or try a harder level.","b2t":"Coloring Book 3","b2d":"Open it at home, while travelling, on the bus, on holiday, or whenever you have a free moment.","b3t":"From Idea to First Sale","b3d":"A practical guide from the idea to building the product, Gumroad, and social media marketing."};
var AR = {};
document.querySelectorAll('[data-i18n]').forEach(function(el){ AR[el.dataset.i18n] = el.innerHTML; });

function setLang(lang){
  var html = document.documentElement;
  html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  var dict = lang === 'ar' ? AR : EN;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v = dict[el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  });
  document.getElementById('lang').textContent = lang === 'ar' ? 'EN' : 'ع';
  try { localStorage.setItem('herewe-lang', lang); } catch(e){}
}
var saved = 'ar';
try { saved = localStorage.getItem('herewe-lang') || 'ar'; } catch(e){}
if (saved === 'en') setLang('en');
document.getElementById('lang').addEventListener('click', function(){
  setLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
});

var BOOKS = [{"url":"https://herewe.gumroad.com/l/coloringbook1","ar":"كتاب التلوين 1","en":"Coloring Book 1"},{"url":"https://herewe.gumroad.com/l/coloringbook2","ar":"كتاب التلوين 2","en":"Coloring Book 2"},{"url":"https://herewe.gumroad.com/l/colorinbook3","ar":"كتاب التلوين 3","en":"Coloring Book 3"},{"url":"https://herewe.gumroad.com/l/digitalbook","ar":"من فكرة إلى بيع منتج رقمي","en":"From Idea to First Sale"}];
var modal = document.getElementById('modal');
function openModal(i){
  var lang = document.documentElement.lang;
  document.getElementById('modal-title').textContent = lang === 'ar' ? BOOKS[i].ar : BOOKS[i].en;
  document.getElementById('modal-buy').href = BOOKS[i].url;
  modal.hidden = false;
}
document.querySelectorAll('.prev').forEach(function(btn){
  btn.addEventListener('click', function(){ openModal(+btn.dataset.book); });
});
document.getElementById('close').addEventListener('click', function(){ modal.hidden = true; });
modal.addEventListener('click', function(e){ if (e.target === modal) modal.hidden = true; });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') modal.hidden = true; });

document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
  });
});
