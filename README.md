# HEREWE Digital Store

موقع Static عربي RTL مع مبدّل عربي/إنجليزي، حديث ومتجاوب.

## الملفات
- `index.html` — الصفحة الرئيسية
- `style.css` — التنسيقات
- `script.js` — تبديل اللغة، معاينة الصفحات، التمرير السلس
- `assets/` — صور الأغلفة وصورة الدليل

## المحتوى
أربعة منتجات، وأزرار الشراء مرتبطة مباشرة بصفحات Gumroad:

| المنتج | السعر | الرابط |
| --- | --- | --- |
| كتاب التلوين 1 | $19 | https://herewe.gumroad.com/l/coloringbook1 |
| كتاب التلوين 2 | $20 | https://herewe.gumroad.com/l/coloringbook2 |
| كتاب التلوين 3 | $19 | https://herewe.gumroad.com/l/colorinbook3 |
| من فكرة إلى بيع منتج رقمي | $20 | https://herewe.gumroad.com/l/digitalbook |

## ما زال ناقصًا
- غلاف **كتاب التلوين 3**: ضع الصورة في `assets/cover-book3.png` ثم استبدل `<div class="slot">` في بطاقة الكتاب الثالث بـ `<img src="assets/cover-book3.png" alt="">`.
- **صفحات نموذجية** داخل نافذة المعاينة: أضف الصور إلى `assets/` واستبدل عناصر `.pages div` بصور فعلية.

## التعديل
- نصوص الموقع العربية موجودة في `index.html`، والترجمة الإنجليزية في الكائن `EN` أعلى `script.js` — أي نص جديد يحتاج `data-i18n="key"` في HTML ومفتاحًا مطابقًا في `EN`.
- الألوان في `:root` أعلى `style.css`.

## النشر
ارفع محتويات المجلد كما هي إلى الفرع `main`، ثم فعّل GitHub Pages من Settings → Pages → Branch: main / root.
يعمل أيضًا على Netlify أو Vercel بدون أي إعدادات.
