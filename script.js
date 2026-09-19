/* =========================================================
   Color Your World — منطق الموقع
   كل الحركات محصورة في transform / opacity للحفاظ على 60fps+
   ========================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var PALETTE = ['#ff6b9d', '#4ecdc4', '#a78bfa', '#feca57'];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* =======================================================
     1) المحتوى
     ======================================================= */
  var BOOKS = [
    {
      cover: 'assets/cover-adult-kids.webp',
      price: '$10',
      url: 'https://herewe.gumroad.com/l/coloringbook1',
      ar: { t: 'كتاب التلوين 1', d: 'رسومات متنوعة بمستويات سهلة وأخرى أكثر تحديًا، للصغار والكبار على حد سواء.' },
      en: { t: 'Coloring Book 1', d: 'Varied drawings with easy and more challenging levels, for kids and adults alike.' }
    },
    {
      cover: 'assets/cover-kids.webp',
      price: '$10',
      url: 'https://herewe.gumroad.com/l/coloringbook2',
      ar: { t: 'كتاب التلوين 2', d: 'وقت إبداعي لكل من يرغب في التلوين أو الاسترخاء أو تجربة مستوى أصعب.' },
      en: { t: 'Coloring Book 2', d: 'Creative time for anyone who wants to color, relax, or try a harder level.' }
    },
    {
      cover: null, /* الغلاف غير متوفر بعد — يُولَّد ماندالا بديلة */
      price: '$10',
      url: 'https://herewe.gumroad.com/l/colorinbook3',
      ar: { t: 'كتاب التلوين 3', d: 'افتحه في البيت، أثناء السفر، في الحافلة، أو في أي لحظة فراغ.' },
      en: { t: 'Coloring Book 3', d: 'Open it at home, while travelling, on the bus, or whenever you have a free moment.' }
    },
    {
      cover: 'assets/guide-idea-to-sale.webp',
      price: '$20',
      url: 'https://herewe.gumroad.com/l/digitalbook',
      ar: { t: 'من فكرة إلى بيع منتج رقمي', d: 'دليل عملي من الفكرة إلى بناء المنتج، ثم Gumroad والتسويق عبر وسائل التواصل.' },
      en: { t: 'From Idea to First Sale', d: 'A practical guide from the idea to building the product, Gumroad, and social marketing.' }
    }
  ];

  var EN = {
    brand: 'Digital Books',
    navHome: 'Home', navBooks: 'Books', navStudio: 'Try coloring', navAbout: 'About', navCatalogue: 'Request catalogue',
    heroKicker: 'A coloring book store',
    heroTitle: 'Set your <em>creativity</em> free in color',
    heroSub: 'A refined, hand-picked coloring experience',
    heroBtn1: 'Explore the collection', heroBtn2: 'Try coloring',
    t1: 'Instant download after payment', t2: 'Secure checkout on Gumroad', t3: 'Print-ready PDF file',
    booksEyebrow: 'The collection', booksTitle: 'Pick your favorite book',
    booksSub: 'A collection built for different moments: from coloring and relaxing to learning how to build and sell a digital product.',
    studioEyebrow: 'Live demo', studioTitle: 'Move your cursor — watch the color spread',
    studioSub: 'Colour settles inside the black lines as you move, exactly as if you were colouring the page by hand.',
    artHint: 'Press and drag over the drawing to colour it', artClear: 'Clear colours',
    artAlt: 'A calm balcony scene with an armchair, potted plants, a lantern and a side table, ready to colour',
    aboutEyebrow: 'More than a book', aboutTitle: 'Make your own moment',
    f1t: 'Kids and adults', f1d: 'Simple levels and more challenging ones, to match your time and your mood.',
    f2t: 'Anywhere', f2d: 'At home, while travelling, in a café, or while waiting.',
    f3t: 'Time away from screens', f3d: 'A quiet, creative activity when you want to change the routine.',
    catTitle: 'Request the full catalogue', catSub: 'Leave your email and we will send you the whole collection with sample pages.',
    catLabel: 'Email address', catBtn: 'Send me the catalogue',
    buyNow: 'Buy now ↗',
    brushLabel: 'Brush size', swAuto: 'Cycling colours', swPick: 'Pick a colour',
    pickTitle: 'Solid colour', pickHue: 'Hue', pickHex: 'Hex value',
    rights: '© 2026 All rights reserved.'
  };

  /* حفظ النص العربي من الصفحة نفسها، فلا يُكرَّر في مكانين */
  var AR = {}, AR_ALT = {};
  $$('[data-i18n]').forEach(function (el) { AR[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-alt]').forEach(function (el) { AR_ALT[el.dataset.i18nAlt] = el.getAttribute('alt') || ''; });

  var lang = 'ar';
  try { lang = localStorage.getItem('cyw-lang') === 'en' ? 'en' : 'ar'; } catch (e) {}

  function applyLang(next) {
    lang = next;
    var dict = next === 'ar' ? AR : EN;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = next === 'ar' ? '' : "'Outfit','Cairo',system-ui,sans-serif";
    $$('[data-i18n]').forEach(function (el) {
      var v = dict[el.dataset.i18n];
      if (v !== undefined) el.innerHTML = v;
    });
    /* النصوص البديلة للصور تُترجَم أيضًا، وإلا بقي وصف الصورة بلغة واحدة */
    $$('[data-i18n-alt]').forEach(function (el) {
      var k = el.dataset.i18nAlt;
      var v = next === 'ar' ? AR_ALT[k] : EN[k];
      if (v !== undefined) el.setAttribute('alt', v);
    });
    var btn = $('#lang');
    if (btn) btn.textContent = next === 'ar' ? 'EN' : 'ع';
    if (typeof syncNavInd === 'function') requestAnimationFrame(syncNavInd);
    try { localStorage.setItem('cyw-lang', next); } catch (e) {}
    renderCards();
  }

  /* =======================================================
     2) خلفية السوائل (WebGL)
     تُرسم بدقة منخفضة ثم تُمدّ، فتبدو كألوان مائية ناعمة.
     ======================================================= */
  function initFluid() {
    var canvas = $('#fluid');
    if (!canvas || REDUCED) { if (canvas) canvas.style.display = 'none'; return; }

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false })
          || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.style.display = 'none'; return; }

    var VS = 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';

    var FS = [
      'precision mediump float;',
      'varying vec2 uv;',
      'uniform vec2 res;uniform float time;uniform vec2 mouse;uniform float force;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
      'return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}',
      'void main(){',
      '  float ar=res.x/max(res.y,1.);',
      '  vec2 st=vec2(uv.x*ar,uv.y);',
      '  vec2 ms=vec2(mouse.x*ar,mouse.y);',
      '  float d=distance(st,ms);',
      '  float push=force*exp(-d*d*7.0);',           /* دفعة سائلة حول المؤشر */
      '  float t=time*0.05;',
      '  vec2 q=vec2(fbm(st*1.15+t),fbm(st*1.15+vec2(5.2,1.3)-t));',
      '  vec2 r=vec2(fbm(st*1.35+3.6*q+vec2(1.7,9.2)+t*1.25+push*2.2),',
      '              fbm(st*1.35+3.6*q+vec2(8.3,2.8)-t*1.05+push*2.2));',
      '  float f=fbm(st*1.05+3.8*r);',
      /* الغسلة: اللون يظهر في بقع متفرقة، ويبقى معظم السطح ورقًا أبيض */
      '  float wash=smoothstep(0.50,0.88,f);',
      '  vec3 col=vec3(1.0);',
      '  col=mix(col,vec3(1.00,0.42,0.62),clamp(q.x*1.5,0.,1.)*wash);',
      '  col=mix(col,vec3(0.31,0.80,0.77),clamp(q.y*1.4,0.,1.)*wash);',
      '  col=mix(col,vec3(0.65,0.55,0.98),clamp(r.x*1.5,0.,1.)*wash);',
      '  col=mix(col,vec3(1.00,0.79,0.34),clamp(r.y*1.2,0.,1.)*wash);',
      '  col=mix(vec3(1.0),col,clamp(0.58+push*0.42,0.,1.));',
      '  gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, VS);
    var fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'res');
    var uTime = gl.getUniformLocation(prog, 'time');
    var uMouse = gl.getUniformLocation(prog, 'mouse');
    var uForce = gl.getUniformLocation(prog, 'force');

    var SCALE = 0.34; /* دقة منخفضة + تمديد = نعومة مائية بتكلفة زهيدة */
    function resize() {
      var w = Math.max(1, Math.round(window.innerWidth * SCALE));
      var h = Math.max(1, Math.round(window.innerHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, force = 0, visible = true;

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX / window.innerWidth;
      ty = 1 - e.clientY / window.innerHeight;
      force = 1;
    }, { passive: true });

    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

    var start = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      mx = lerp(mx, tx, 0.06);          /* تتبّع بطيء = إحساس بلزوجة السائل */
      my = lerp(my, ty, 0.06);
      force *= 0.982;                    /* تلاشٍ خلال ~1.2 ثانية */
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uForce, force);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(frame);
    /* تعطيل التدرج الاحتياطي حتى لا تتضاعف الألوان فوق بعضها */
    document.documentElement.classList.add('has-fluid');
    requestAnimationFrame(function () { canvas.classList.add('on'); });
  }

  /* =======================================================
     2b) فيديو الخلفية — تحميل مؤجَّل ومشروط
     الفيديو ثقيل (6.7MB / H.264)، لذا لا يُطلب إطلاقًا قبل أن تُرسم
     الصفحة، ولا يُطلب أبدًا على اتصال موفِّر للبيانات أو بطيء.
     طبقة السوائل تغطي المشهد إلى أن يصبح الفيديو جاهزًا، فلا وميض أبيض.
     ======================================================= */
  function initVideo() {
    var wrap = $('.bg-video'), vid = $('#bgvid');
    if (!wrap || !vid) return;

    if (REDUCED) { wrap.remove(); return; }

    var net = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (net) {
      if (net.saveData) { wrap.remove(); return; }
      if (/(^|-)2g$/.test(net.effectiveType || '')) { wrap.remove(); return; }
    }

    function load() {
      var settled = false;
      function giveUp() { if (settled) return; settled = true; wrap.remove(); }

      vid.addEventListener('canplay', function () {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});
        wrap.classList.add('on');
      }, { once: true });

      /* الخطأ يُرفع على <video> فقط حين يُضبط src مباشرة؛ لو وُضع <source>
         ابنًا لارتفع الخطأ عليه هو ولما وصلنا هنا. فلا نستخدم <source>. */
      vid.addEventListener('error', giveUp, { once: true });

      /* تحميل متعثّر: لا نُبقي طلبًا معلّقًا إلى ما لا نهاية */
      var timer = setTimeout(giveUp, 12000);

      vid.src = 'assets/colors.mp4';
      vid.load();
    }

    /* بعد أول رسم كامل، وفي وقت خمول إن توفّر */
    function schedule() {
      if (window.requestIdleCallback) window.requestIdleCallback(load, { timeout: 2500 });
      else setTimeout(load, 900);
    }
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  }

  /* =======================================================
     3) التدرجات المبتكرة — كتل ضبابية تدور ببطء
     ======================================================= */
  function initMesh() {
    if (REDUCED) return;
    var blobs = $$('.blob');
    if (!blobs.length) return;

    if (window.gsap) {
      blobs.forEach(function (b, i) {
        window.gsap.to(b, {
          xPercent: (i % 2 ? -1 : 1) * 14,
          yPercent: (i % 3 ? 1 : -1) * 12,
          scale: 1.14,
          duration: 16 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });
      return;
    }
    /* بديل بلا مكتبات */
    blobs.forEach(function (b, i) {
      b.animate([
        { transform: 'translate3d(0,0,0) scale(1)' },
        { transform: 'translate3d(' + (i % 2 ? -7 : 7) + '%,' + (i % 3 ? 6 : -6) + '%,0) scale(1.14)' },
        { transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: (16 + i * 3) * 1000, iterations: Infinity, easing: 'ease-in-out' });
    });
  }

  /* =======================================================
     4) المؤشر السائل — أثر لوني يتلاشى خلال ثانية
     ======================================================= */
  function initTrail() {
    var host = $('#trail');
    if (!host || REDUCED || !window.matchMedia('(pointer: fine)').matches) {
      if (host) host.style.display = 'none';
      return;
    }
    var POOL = 22, drops = [], idx = 0, last = 0, ci = 0;
    for (var i = 0; i < POOL; i++) {
      var d = document.createElement('span');
      d.className = 'drop';
      host.appendChild(d);
      drops.push(d);
    }
    window.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (now - last < 30) return;       /* تهدئة: ~33 قطرة/ثانية كحد أقصى */
      last = now;
      var d = drops[idx = (idx + 1) % POOL];
      d.style.background = PALETTE[ci = (ci + 1) % PALETTE.length];
      d.animate([
        { transform: 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0) scale(.55)', opacity: 0.5 },
        { transform: 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0) scale(2.4)', opacity: 0 }
      ], { duration: 1000, easing: EASE, fill: 'forwards' });
    }, { passive: true });
  }

  /* =======================================================
     5) غلاف ماندالا مولّد (للكتاب الذي لا صورة له بعد)
     ======================================================= */
  function mandalaSVG(seed) {
    var out = '', i, j, ring, ang, x, y;
    [22, 46, 70, 92].forEach(function (r) {
      out += '<circle cx="100" cy="100" r="' + r + '"/>';
    });
    [{ n: 8, r: 30, rx: 6, ry: 15 },
     { n: 12, r: 54, rx: 7, ry: 17 },
     { n: 18, r: 78, rx: 6, ry: 14 },
     { n: 24, r: 96, rx: 3, ry: 7 }].forEach(function (g, k) {
      for (i = 0; i < g.n; i++) {
        ang = (360 / g.n) * i + seed * 5 + k * 4;
        x = 100 + Math.cos(ang * Math.PI / 180) * g.r;
        y = 100 + Math.sin(ang * Math.PI / 180) * g.r;
        out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + g.rx +
               '" ry="' + g.ry + '" transform="rotate(' + (ang + 90).toFixed(1) + ' ' +
               x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
      }
    });
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="presentation">' +
      '<defs><radialGradient id="mg' + seed + '" cx="50%" cy="46%" r="56%">' +
      '<stop offset="0%" stop-color="#ff7aa8"/><stop offset="32%" stop-color="#feca57"/>' +
      '<stop offset="62%" stop-color="#4ecdc4"/><stop offset="100%" stop-color="#a78bfa"/>' +
      '</radialGradient></defs>' +
      '<rect width="200" height="200" fill="#14141c"/>' +
      '<g fill="none" stroke="url(#mg' + seed + ')" stroke-width="1.15" opacity=".95">' + out + '</g>' +
      '</svg>';
  }

  /* =======================================================
     6) بطاقات الكتب + الإمالة ثلاثية الأبعاد
     ======================================================= */
  var grid = $('#grid');

  function coverMarkup(b, i) {
    return b.cover
      ? '<img src="' + b.cover + '" alt="" loading="lazy" decoding="async">'
      : mandalaSVG(i + 1);
  }

  function renderCards() {
    if (!grid) return;
    grid.innerHTML = '';
    BOOKS.forEach(function (b, i) {
      var txt = b[lang] || b.ar;
      var card = document.createElement('article');
      card.className = 'card reveal';
      card.dataset.book = String(i);
      card.innerHTML =
        '<div class="card-cover">' + coverMarkup(b, i) + '</div>' +
        '<h3 class="card-title">' + txt.t + '</h3>' +
        '<p class="card-price">' + b.price + '</p>' +
        '<a class="card-buy" href="' + b.url + '" target="_blank" rel="noopener">' +
          (lang === 'ar' ? 'شراء الآن ↗' : 'Buy now ↗') + '</a>';
      grid.appendChild(card);
      observeReveal(card);
      tilt(card);
      /* الزر يذهب مباشرة إلى صفحة الشراء؛ بقية البطاقة تفتح صفحة المنتج */
      $('.card-buy', card).addEventListener('click', function (e) { e.stopPropagation(); });
      card.addEventListener('click', function () { openSheet(i, card); });
    });
  }

  /* إمالة خفيفة تتبع المؤشر — transform فقط */
  function tilt(el) {
    if (REDUCED || !window.matchMedia('(pointer: fine)').matches) return;
    var rx = 0, ry = 0, tRx = 0, tRy = 0, raf = null, lift = 0, tLift = 0;

    function loop() {
      rx = lerp(rx, tRx, 0.14); ry = lerp(ry, tRy, 0.14); lift = lerp(lift, tLift, 0.14);
      el.style.transform = 'perspective(900px) translate3d(0,' + lift.toFixed(2) + 'px,0) rotateX(' +
                           rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      if (Math.abs(rx - tRx) > 0.01 || Math.abs(ry - tRy) > 0.01 || Math.abs(lift - tLift) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      tRy = ((e.clientX - r.left) / r.width - 0.5) * 12;
      tRx = -((e.clientY - r.top) / r.height - 0.5) * 12;
      tLift = -10;
      kick();
    }, { passive: true });

    el.addEventListener('pointerleave', function () { tRx = 0; tRy = 0; tLift = 0; kick(); }, { passive: true });
  }

  /* =======================================================
     7) انتقال العناصر المشتركة (FLIP) إلى صفحة المنتج
     الغلاف يكبر بمرونة ليصبح عنوان صفحة المنتج.
     ======================================================= */
  var sheet = $('#sheet'), sheetCover = $('#sheet-cover'), scrim = $('.sheet-scrim'),
      panel = $('.sheet-panel'), lastFocus = null, sourceCover = null;

  /* إلغاء الحركات السابقة حتى لا تتراكم عبر عمليات الفتح والإغلاق */
  function resetAnims(el) {
    if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); });
  }

  function openSheet(i, card) {
    if (!sheet) return;
    var b = BOOKS[i], txt = b[lang] || b.ar;
    lastFocus = document.activeElement;

    $('#sheet-eyebrow').textContent = lang === 'ar' ? 'كتاب تلوين' : 'Coloring book';
    $('#sheet-title').textContent = txt.t;
    $('#sheet-desc').textContent = txt.d;
    $('#sheet-price').textContent = b.price;
    $('#sheet-buy').href = b.url;
    $('#sheet-buy').textContent = lang === 'ar' ? 'شراء الآن ↗' : 'Buy now ↗';
    sheetCover.innerHTML = coverMarkup(b, i);

    sheet.hidden = false;
    document.body.classList.add('sheet-open');
    resetAnims(panel); resetAnims(scrim);

    sourceCover = card ? $('.card-cover', card) : null;
    var from = sourceCover ? sourceCover.getBoundingClientRect() : null;
    var to = sheetCover.getBoundingClientRect();

    scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EASE, fill: 'forwards' });

    if (REDUCED || !from || !from.width) {
      panel.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }],
        { duration: 380, easing: EASE, fill: 'forwards' });
      $('.sheet-close').focus();
      return;
    }

    /* العنصر الطائر: يبدأ عند مكان الغلاف في الشبكة وينتهي في مكانه بالصفحة */
    var flyer = document.createElement('div');
    flyer.className = 'flyer';
    flyer.innerHTML = sourceCover.innerHTML;
    flyer.style.left = to.left + 'px';
    flyer.style.top = to.top + 'px';
    flyer.style.width = to.width + 'px';
    flyer.style.height = to.height + 'px';
    document.body.appendChild(flyer);

    sourceCover.style.opacity = '0';
    sheetCover.style.opacity = '0';

    var dx = from.left - to.left, dy = from.top - to.top, s = from.width / to.width;
    var fly = flyer.animate([
      { transform: 'translate3d(' + dx + 'px,' + dy + 'px,0) scale(' + s + ')' },
      { transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration: 480, easing: EASE, fill: 'forwards' });

    panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: EASE, fill: 'forwards' });

    fly.finished.then(function () {
      sheetCover.style.opacity = '';
      flyer.remove();
    }).catch(function () { sheetCover.style.opacity = ''; flyer.remove(); });

    $('.sheet-close').focus();
  }

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    var to = sheetCover.getBoundingClientRect();
    var from = sourceCover ? sourceCover.getBoundingClientRect() : null;

    var settled = false;
    function done() {
      if (settled) return;            /* يُنفَّذ مرة واحدة مهما تعدّدت المنادِح */
      settled = true;
      sheet.hidden = true;
      document.body.classList.remove('sheet-open');
      if (sourceCover) sourceCover.style.opacity = '';
      sourceCover = null;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 360, easing: EASE, fill: 'forwards' });

    if (REDUCED || !from || !from.width) {
      panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: EASE, fill: 'forwards' })
        .finished.then(done).catch(done);
      return;
    }

    var flyer = document.createElement('div');
    flyer.className = 'flyer';
    flyer.innerHTML = sheetCover.innerHTML;
    flyer.style.left = to.left + 'px';
    flyer.style.top = to.top + 'px';
    flyer.style.width = to.width + 'px';
    flyer.style.height = to.height + 'px';
    document.body.appendChild(flyer);
    sheetCover.style.opacity = '0';

    var dx = from.left - to.left, dy = from.top - to.top, s = from.width / to.width;
    panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: EASE, fill: 'forwards' });

    function finish() { flyer.remove(); sheetCover.style.opacity = ''; done(); }

    flyer.animate([
      { transform: 'translate3d(0,0,0) scale(1)' },
      { transform: 'translate3d(' + dx + 'px,' + dy + 'px,0) scale(' + s + ')' }
    ], { duration: 440, easing: EASE, fill: 'forwards' })
      .finished.then(finish).catch(finish);

    /* شبكة أمان: الإغلاق لا يعلق أبدًا لو تأخّر وعد الحركة */
    setTimeout(finish, 700);
  }

  $$('[data-close]').forEach(function (el) { el.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* =======================================================
     8) استوديو التلوين
     الرسمة PNG بخلفية شفافة (الخطوط سوداء، الورق شفاف)، فتظهر
     الألوان الموضوعة تحتها وكأنها داخل الخطوط. القطرات تتراكم
     مع حركة المؤشر لتعطي إحساس التلوين المباشر.
     ======================================================= */

  /* --- تحويلات الألوان --- */
  function hsvToRgb(h, sat, v) {
    h = ((h % 360) + 360) % 360 / 60;
    var c = v * sat, x = c * (1 - Math.abs(h % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 1)      { r = c; g = x; }
    else if (h < 2) { r = x; g = c; }
    else if (h < 3) { g = c; b = x; }
    else if (h < 4) { g = x; b = c; }
    else if (h < 5) { r = x; b = c; }
    else            { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map(function (n) {
      return ('0' + clamp(Math.round(n), 0, 255).toString(16)).slice(-2);
    }).join('').toUpperCase();
  }
  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) return null;
    var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHsv(rgb) {
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) {
      if (mx === r)      h = 60 * (((g - b) / d) % 6);
      else if (mx === g) h = 60 * ((b - r) / d + 2);
      else               h = 60 * ((r - g) / d + 4);
    }
    return [((h % 360) + 360) % 360, mx ? d / mx : 0, mx];
  }

  var SWATCHES = ['#FF3B6B', '#FF6B9D', '#FF9F43', '#FECA57', '#7BD389',
                  '#4ECDC4', '#45AAF2', '#5B8DEF', '#A78BFA', '#D980FA',
                  '#8B5E3C', '#16161F'];

  function initArt() {
    var stage = $('#stage'), paint = $('#paint'), clearBtn = $('#art-clear');
    if (!stage || !paint) return;

    var POOL = 90, blobs = [], idx = -1, ci = 0, lastX = -1e4, lastY = -1e4, i;
    var colour = null;       /* null = وضع الألوان المتعاقبة */
    var brush = 9;           /* نسبة مئوية من عرض اللوحة */

    for (i = 0; i < POOL; i++) {
      var b = document.createElement('span');
      b.className = 'ink';
      paint.appendChild(b);
      blobs.push(b);
    }

    /* وضع قطرة: المقاس والموضع يُكتبان مرة واحدة عند الإنشاء،
       أما الحركة فـ transform و opacity فقط. */
    function drop(xPct, yPct, animate) {
      var r = stage.getBoundingClientRect();
      var b = blobs[idx = (idx + 1) % POOL];
      b.style.background = colour || PALETTE[ci = (ci + 1) % PALETTE.length];
      b.style.width = brush + '%';
      b.style.margin = (-brush / 2) + '% 0 0 ' + (-brush / 2) + '%';
      b.style.filter = 'blur(' + Math.max(4, r.width * brush / 100 * 0.12).toFixed(1) + 'px) saturate(125%)';
      b.style.left = xPct.toFixed(2) + '%';
      b.style.top = yPct.toFixed(2) + '%';
      b.getAnimations().forEach(function (a) { a.cancel(); });
      if (!animate) {
        b.style.opacity = '.85';
        b.style.transform = 'translate3d(0,0,0) scale(1)';
        return;
      }
      b.style.opacity = '';
      b.style.transform = '';
      b.animate([
        { transform: 'translate3d(0,0,0) scale(.25)', opacity: 0 },
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 0.85 }
      ], { duration: 520, easing: EASE, fill: 'forwards' });
    }

    /* ---------- الأدوات ---------- */
    var swatchBox = $('#swatches'), addBtn = $('#sw-add'), autoBtn = $('#sw-auto');
    var picker = $('#picker'), sv = $('#sv'), svDot = $('#sv-dot'),
        hue = $('#hue'), hex = $('#hex'), pv = $('#pv');
    var brushIn = $('#brush'), brushDot = $('#brush-dot');
    var hsv = [340, 0.58, 1];

    /* أزرار الألوان الجاهزة تُبنى قبل زر الإضافة */
    if (swatchBox && addBtn) {
      SWATCHES.forEach(function (c) {
        var s2 = document.createElement('button');
        s2.type = 'button';
        s2.className = 'sw';
        s2.style.background = c;
        s2.setAttribute('aria-label', c);
        s2.setAttribute('aria-pressed', 'false');
        s2.addEventListener('click', function () { pick(c, s2); });
        swatchBox.insertBefore(s2, addBtn);
      });
    }

    function markOn(el) {
      $$('.sw', swatchBox).forEach(function (s2) {
        var on = s2 === el;
        s2.classList.toggle('is-on', on);
        if (s2.hasAttribute('aria-pressed')) s2.setAttribute('aria-pressed', String(on));
      });
    }
    function pick(c, el) {
      colour = c;
      markOn(el || null);
      if (brushDot) brushDot.style.color = c;
      syncPicker(c);
    }
    if (autoBtn) {
      autoBtn.addEventListener('click', function () {
        colour = null;
        markOn(autoBtn);
        if (brushDot) brushDot.style.color = '';
      });
    }

    /* حجم الفرشاة: المعاينة تكبر بـ transform فقط */
    function syncBrush() {
      brush = parseFloat(brushIn.value) || 9;
      if (brushDot) brushDot.style.transform = 'scale(' + (0.18 + brush / 40 * 0.82).toFixed(3) + ')';
    }
    if (brushIn) { brushIn.addEventListener('input', syncBrush); syncBrush(); }

    /* ---------- المنتقي ---------- */
    function syncPicker(c) {
      var rgb = hexToRgb(c);
      if (!rgb) return;
      hsv = rgbToHsv(rgb);
      paintPicker(false);
    }
    function currentHex() { return rgbToHex(hsvToRgb(hsv[0], hsv[1], hsv[2])); }

    function paintPicker(updateColour) {
      var c = currentHex();
      if (sv) sv.style.setProperty('--hue', rgbToHex(hsvToRgb(hsv[0], 1, 1)));
      if (svDot) svDot.style.transform = 'translate3d(' +
        (hsv[1] * sv.clientWidth).toFixed(1) + 'px,' +
        ((1 - hsv[2]) * sv.clientHeight).toFixed(1) + 'px,0)';
      if (hue) hue.value = String(Math.round(hsv[0]));
      if (pv) pv.style.background = c;
      if (hex && document.activeElement !== hex) hex.value = c;
      if (updateColour) {
        colour = c;
        markOn(null);
        if (addBtn) { addBtn.style.background = c; addBtn.classList.add('is-on'); }
        if (brushDot) brushDot.style.color = c;
      }
    }

    if (sv) {
      var svDrag = false;
      function svAt(e) {
        var r = sv.getBoundingClientRect();
        hsv[1] = clamp((e.clientX - r.left) / r.width, 0, 1);
        hsv[2] = 1 - clamp((e.clientY - r.top) / r.height, 0, 1);
        paintPicker(true);
      }
      sv.addEventListener('pointerdown', function (e) {
        svDrag = true; sv.setPointerCapture(e.pointerId); svAt(e);
      });
      sv.addEventListener('pointermove', function (e) { if (svDrag) svAt(e); });
      sv.addEventListener('pointerup', function () { svDrag = false; });
      sv.addEventListener('pointercancel', function () { svDrag = false; });
    }
    if (hue) hue.addEventListener('input', function () { hsv[0] = parseFloat(hue.value); paintPicker(true); });
    if (hex) {
      hex.addEventListener('input', function () {
        var rgb = hexToRgb(hex.value);
        if (!rgb) return;                       /* مدخل ناقص أثناء الكتابة: تُتجاهل بهدوء */
        hsv = rgbToHsv(rgb);
        paintPicker(true);
      });
      hex.addEventListener('blur', function () { hex.value = currentHex(); });
    }

    if (addBtn && picker) {
      addBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = picker.hidden;
        picker.hidden = !open;
        addBtn.setAttribute('aria-expanded', String(open));
        if (open) paintPicker(false);
      });
      /* يُستمَع لـ pointerdown لا click: السحب من مربع الألوان قد ينتهي
         خارج المنتقي، فيكون هدف الـ click هو الصفحة ويُغلق المنتقي بغير حق. */
      document.addEventListener('pointerdown', function (e) {
        if (picker.hidden || picker.contains(e.target) || addBtn.contains(e.target)) return;
        picker.hidden = true;
        addBtn.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !picker.hidden) {
          picker.hidden = true;
          addBtn.setAttribute('aria-expanded', 'false');
          addBtn.focus();
        }
      });
    }

    /* ---------- التلوين ---------- */
    if (REDUCED) {
      [[30, 22], [68, 34], [46, 56], [24, 72], [72, 68], [52, 86]]
        .forEach(function (q) { drop(q[0], q[1], false); });
      return;
    }

    var painting = false;

    function paintAt(e, force) {
      var r = stage.getBoundingClientRect();
      if (!r.width) return;
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (!force) {
        var dx = x - lastX, dy = y - lastY;
        var min = r.width * (brush / 100) * 0.23;   /* التباعد يتبع حجم الفرشاة */
        if (dx * dx + dy * dy < min * min) return;
      }
      lastX = x; lastY = y;
      drop(x / r.width * 100, y / r.height * 100, true);
    }

    /* التلوين بالضغط والسحب فقط — المرور المجرّد لا يلوّن */
    stage.addEventListener('pointerdown', function (e) {
      painting = true;
      lastX = -1e4; lastY = -1e4;
      if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (err) {} }
      paintAt(e, true);
    });
    stage.addEventListener('pointermove', function (e) { if (painting) paintAt(e, false); }, { passive: true });
    function stop() { painting = false; lastX = -1e4; lastY = -1e4; }
    stage.addEventListener('pointerup', stop);
    stage.addEventListener('pointercancel', stop);
    /* لا يُوقَف التلوين عند pointerleave: التقاط المؤشر يُطلق حدث مغادرة
       فور الضغط، وكان ذلك ينهي السحب في لحظته. الإحداثيات تُقصّ داخل
       paintAt على أي حال، فالخروج عن اللوحة لا يرسم شيئًا. */
    window.addEventListener('pointerup', stop);

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        blobs.forEach(function (b2) {
          var cur = parseFloat(getComputedStyle(b2).opacity) || 0;
          if (cur <= 0.001) return;
          var fade = b2.animate([{ opacity: cur }, { opacity: 0 }],
            { duration: 420, easing: EASE, fill: 'forwards' });
          function reset() {
            b2.getAnimations().forEach(function (a) { a.cancel(); });
            b2.style.opacity = ''; b2.style.transform = '';
          }
          fade.finished.then(reset).catch(reset);
        });
        idx = -1; lastX = -1e4; lastY = -1e4;
      });
    }
  }

  /* =======================================================
     9) البارالاكس + الظهور عند التمرير + حالة الشريط
     ======================================================= */
  var parallaxItems = [];
  function initParallax() {
    if (REDUCED) return;
    parallaxItems = $$('[data-parallax]').map(function (el) {
      return {
        el: el,
        f: parseFloat(el.dataset.parallax) || 0,
        rot: parseFloat(el.dataset.rot) || 0,   /* دوران أصلي يجب ألا يضيع */
        y: 0, t: 0
      };
    });
    if (!parallaxItems.length) return;

    var ticking = false;
    function update() {
      var sy = window.scrollY || window.pageYOffset;
      parallaxItems.forEach(function (it) {
        it.t = sy * it.f;
        it.y = lerp(it.y, it.t, 0.18);
        it.el.style.transform = 'translate3d(0,' + it.y.toFixed(2) + 'px,0)' +
                                (it.rot ? ' rotate(' + it.rot + 'deg)' : '');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  var revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en, i) {
          if (!en.isIntersecting) return;
          en.target.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
          en.target.classList.add('revealed');
          obs.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    : null;

  function observeReveal(el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('revealed');
  }

  var syncNavInd = null;

  function initNav() {
    var nav = $('#nav'), burger = $('#burger'), links = $('#nav-links');
    var ind = $('#nav-ind');

    /* المؤشر المنزلق يتبع الرابط النشط، ويسبق المؤشر عند المرور */
    function moveInd(el) {
      if (!ind || !el || !links) return;
      if (window.matchMedia('(max-width:860px)').matches) { ind.classList.remove('on'); return; }
      var a = el.getBoundingClientRect(), b = links.getBoundingClientRect();
      if (!a.width) return;
      ind.style.width = a.width + 'px';
      ind.style.transform = 'translate3d(' + (a.left - b.left) + 'px,0,0)';
      ind.classList.add('on');
    }
    function indToActive() { moveInd($('.nav-link.is-active', links)); }
    syncNavInd = indToActive;

    if (ind && links) {
      $$('.nav-link', links).forEach(function (a) {
        a.addEventListener('pointerenter', function () { moveInd(a); }, { passive: true });
      });
      links.addEventListener('pointerleave', indToActive, { passive: true });
      window.addEventListener('resize', indToActive, { passive: true });
      /* بعد تحميل الخطوط تتغيّر عروض الروابط، فيُعاد الضبط */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(indToActive).catch(function () {});
      requestAnimationFrame(indToActive);
    }

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', (window.scrollY || 0) > 20);
    }, { passive: true });

    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
      links.addEventListener('click', function (e) {
        if (e.target.classList.contains('nav-link')) {
          links.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* تمرير سلس مع تعويض ارتفاع الشريط */
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + (window.scrollY || 0) - 90;
        window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
      });
    });

    /* الرابط النشط */
    if ('IntersectionObserver' in window) {
      var navLinks = $$('.nav-link');
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
          });
          indToActive();
        });
      }, { threshold: 0.4 });
      ['top', 'books', 'studio', 'about', 'catalogue'].forEach(function (id) {
        var s = document.getElementById(id);
        if (s) spy.observe(s);
      });
    }
  }

  /* =======================================================
     10) الكتاب ثلاثي الأبعاد — انثناء ناعم يتبع المؤشر
     ======================================================= */
  /* =======================================================
     10) مروحة الأغلفة — إمالة ناعمة تتبع المؤشر
     ======================================================= */
  function initShowcase() {
    var box = $('#showcase');
    if (!box || REDUCED || !window.matchMedia('(pointer: fine)').matches) return;
    var rx = 0, ry = 0, tRx = 0, tRy = 0, raf = null;

    function loop() {
      rx = lerp(rx, tRx, 0.08); ry = lerp(ry, tRy, 0.08);
      box.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      if (Math.abs(rx - tRx) > 0.02 || Math.abs(ry - tRy) > 0.02) raf = requestAnimationFrame(loop);
      else raf = null;
    }
    window.addEventListener('pointermove', function (e) {
      tRy = (e.clientX / window.innerWidth - 0.5) * 16;
      tRx = -(e.clientY / window.innerHeight - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* =======================================================
     11) نموذج الكتالوج
     ======================================================= */
  function initForm() {
    var form = $('#cat-form'), note = $('#cat-note');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#cat-email');
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      note.classList.toggle('err', !ok);
      note.textContent = ok
        ? (lang === 'ar' ? 'تم التسجيل — سيصلك الكتالوج قريبًا.' : 'You are on the list — the catalogue is on its way.')
        : (lang === 'ar' ? 'من فضلك أدخل بريدًا إلكترونيًا صحيحًا.' : 'Please enter a valid email address.');
      if (ok) form.reset();
    });
  }

  /* =======================================================
     التشغيل
     ======================================================= */
  function boot() {
    applyLang(lang);
    initFluid();
    initVideo();
    initMesh();
    initTrail();
    initArt();
    initParallax();
    initNav();
    initShowcase();
    initForm();
    $$('.reveal').forEach(observeReveal);

    var langBtn = $('#lang');
    if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'ar' ? 'en' : 'ar'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
