// خريطة الربط بين الإدخالات والنصوص فوق الصورة
const fieldsMap = {
  'inputCode': 'cvCode',
  'inputName': 'cvName',
  'inputVideo': 'cvVideo',
  'inputWeight': 'cvWeight',
  'inputHeight': 'cvHeight',
  'inputReligion': 'cvReligion',
  'inputAge': 'cvAge',
  'inputPassport': 'cvPassport',
  'inputExpTitle': 'cvExpTitle',
  'inputJob': 'cvJob',
  'inputDuration': 'cvDuration',
  'inputExpCountry': 'cvExpCountry',
  'inputMarital': 'cvMarital',
  'inputChildren': 'cvChildren',
  'inputBirthPlace': 'cvBirthPlace',
  'inputEnglish': 'cvEnglish',
  'inputArabic': 'cvArabic',
  'inputEducation': 'cvEducation',
  'inputBabyCare': 'cvBabyCare',
  'inputCleaning': 'cvCleaning',
  'inputElderlyCare': 'cvElderlyCare',
  'inputWashing': 'cvWashing',
  'inputCooking': 'cvCooking',
  'inputIroning': 'cvIroning'
};

// أسماء العناصر باللغة العربية لشريط التنسيق
const overlayLabels = {
  'cvCode': 'كود الرقم',
  'cvCountryName': 'اسم الدولة',
  'cvName': 'الاسم الكامل (Name)',
  'cvVideo': 'رابط الفيديو التعريفي',
  'cvWeight': 'الوزن',
  'cvHeight': 'الطول',
  'cvPassport': 'رقم الجواز',
  'cvReligion': 'الديانة',
  'cvAge': 'العمر',
  'cvExpTitle': 'عنوان حالة الخبرة',
  'cvJob': 'الوظيفة',
  'cvDuration': 'مدة الخبرة',
  'cvExpCountry': 'بلد الخبرة',
  'cvMarital': 'الحالة الاجتماعية',
  'cvChildren': 'عدد الأطفال',
  'cvBirthPlace': 'مكان الميلاد',
  'cvEnglish': 'اللغة الإنجليزية',
  'cvArabic': 'اللغة العربية',
  'cvEducation': 'المستوى التعليمي',
  'cvBabyCare': 'عناية الأطفال',
  'cvElderlyCare': 'عناية كبار السن',
  'cvCooking': 'الطبخ',
  'cvCleaning': 'التنظيف',
  'cvWashing': 'الغسيل',
  'cvIroning': 'الكوي'
};

// بيانات بوت تليجرام
const TELEGRAM_BOT_TOKEN = "8967937243:AAGAepEyU1j0HQOC-5Ko43VmAhpUd6DnUpc";
const TELEGRAM_CHAT_ID = "-1004478651730";

let currentActiveOverlay = null;

// الربط المتبادل بين حقول الإدخال وعناصر الكارت + تمكين التعديل المباشر (contenteditable)
Object.keys(fieldsMap).forEach(inputId => {
  const inputEl = document.getElementById(inputId);
  const targetEl = document.getElementById(fieldsMap[inputId]);

  if (inputEl && targetEl) {
    // تحديث من المدخلات (سواء كانت input أو select) للكارت
    ['input', 'change'].forEach(evt => {
      inputEl.addEventListener(evt, () => {
        targetEl.innerText = inputEl.value;
      });
    });

    // تمكين التعديل المباشر والتزامن مع الحقول الجانبية
    targetEl.setAttribute('contenteditable', 'true');
    targetEl.addEventListener('input', () => {
      inputEl.value = targetEl.innerText;
    });
  }
});

// إتاحة التعديل على باقي العناصر غير الموجودة بالخريطة إن وجدت
document.querySelectorAll('.overlay-val').forEach(el => {
  el.setAttribute('contenteditable', 'true');
  
  el.addEventListener('click', (e) => {
    setActiveOverlayElement(el);
  });

  el.addEventListener('focus', (e) => {
    setActiveOverlayElement(el);
  });
});

// دالة تحديد النص النشط وتحديث أزرار شريط التنسيق
function setActiveOverlayElement(el) {
  if (currentActiveOverlay) {
    currentActiveOverlay.classList.remove('active-overlay');
  }
  currentActiveOverlay = el;
  currentActiveOverlay.classList.add('active-overlay');

  const labelName = overlayLabels[el.id] || 'عنصر مخصص';
  document.getElementById('activeTargetLabel').innerText = `المحدد: ${labelName}`;

  syncToolbarWithElement(el);
}

// دالة تحويل ألوان RGB إلى HEX للـ Color Picker
function rgbToHex(rgbStr) {
  if (!rgbStr) return '#000000';
  if (rgbStr.startsWith('#')) return rgbStr;
  const rgb = rgbStr.match(/\d+/g);
  if (!rgb || rgb.length < 3) return '#000000';
  const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
  const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
  const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// مزامنة حالة شريط التنسيق مع النص المحدد
function syncToolbarWithElement(el) {
  const style = window.getComputedStyle(el);

  // الخط
  const fontFamilySelect = document.getElementById('toolFontFamily');
  if (fontFamilySelect && el.style.fontFamily) {
    fontFamilySelect.value = el.style.fontFamily;
  }

  // الحجم
  const fontSize = parseFloat(style.fontSize) || 14;
  document.getElementById('fontSizeDisplay').innerText = `${Math.round(fontSize)}px`;

  // Bold
  const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700;
  document.getElementById('btnBold').classList.toggle('active', isBold);

  // Italic
  const isItalic = style.fontStyle === 'italic';
  document.getElementById('btnItalic').classList.toggle('active', isItalic);

  // Underline & Strikethrough
  const dec = style.textDecorationLine || style.textDecoration || '';
  document.getElementById('btnUnderline').classList.toggle('active', dec.includes('underline'));
  document.getElementById('btnStrikethrough').classList.toggle('active', dec.includes('line-through'));

  // Color
  const colorPicker = document.getElementById('toolTextColor');
  if (colorPicker) {
    colorPicker.value = rgbToHex(style.color);
  }

  // مزامنة حالة أزرار المحاذاة (Align)
  const justify = el.style.justifyContent || style.justifyContent;
  const textAlign = el.style.textAlign || style.textAlign;

  const isLeft = justify === 'flex-start' || textAlign === 'left';
  const isRight = justify === 'flex-end' || textAlign === 'right';
  const isCenter = justify === 'center' || textAlign === 'center' || (!isLeft && !isRight);

  document.getElementById('btnAlignLeft')?.classList.toggle('active', isLeft);
  document.getElementById('btnAlignCenter')?.classList.toggle('active', isCenter);
  document.getElementById('btnAlignRight')?.classList.toggle('active', isRight);
}

/* === أحداث شريط أدوات التنسيق (Word Toolbar Actions) === */

// 1. تغيير نوع الخط
document.getElementById('toolFontFamily')?.addEventListener('change', function() {
  if (currentActiveOverlay) {
    currentActiveOverlay.style.fontFamily = this.value;
  }
});

// 2. تكبير وتصغير الخط
document.getElementById('btnFontSizePlus')?.addEventListener('click', () => changeFontSize(1));
document.getElementById('btnFontSizeMinus')?.addEventListener('click', () => changeFontSize(-1));

function changeFontSize(delta) {
  if (!currentActiveOverlay) return;
  const currentSize = parseFloat(window.getComputedStyle(currentActiveOverlay).fontSize) || 14;
  const newSize = Math.max(8, Math.min(72, currentSize + delta));
  currentActiveOverlay.style.fontSize = `${newSize}px`;
  document.getElementById('fontSizeDisplay').innerText = `${Math.round(newSize)}px`;
}

// 3. Bold
document.getElementById('btnBold')?.addEventListener('click', function() {
  if (!currentActiveOverlay) return;
  const isBold = currentActiveOverlay.style.fontWeight === 'bold' || currentActiveOverlay.style.fontWeight === '800';
  currentActiveOverlay.style.fontWeight = isBold ? 'normal' : '800';
  this.classList.toggle('active', !isBold);
});

// 4. Italic
document.getElementById('btnItalic')?.addEventListener('click', function() {
  if (!currentActiveOverlay) return;
  const isItalic = currentActiveOverlay.style.fontStyle === 'italic';
  currentActiveOverlay.style.fontStyle = isItalic ? 'normal' : 'italic';
  this.classList.toggle('active', !isItalic);
});

// دالة معالجة Underline و Strikethrough معاً بدون تضارب
function toggleTextDecoration(type) {
  if (!currentActiveOverlay) return;
  let currentDec = currentActiveOverlay.style.textDecoration || '';
  let hasUnderline = currentDec.includes('underline');
  let hasLineThrough = currentDec.includes('line-through');

  if (type === 'underline') hasUnderline = !hasUnderline;
  if (type === 'line-through') hasLineThrough = !hasLineThrough;

  let newDec = [];
  if (hasUnderline) newDec.push('underline');
  if (hasLineThrough) newDec.push('line-through');

  currentActiveOverlay.style.textDecoration = newDec.length > 0 ? newDec.join(' ') : 'none';
  
  document.getElementById('btnUnderline').classList.toggle('active', hasUnderline);
  document.getElementById('btnStrikethrough').classList.toggle('active', hasLineThrough);
}

// 5. Underline
document.getElementById('btnUnderline')?.addEventListener('click', () => toggleTextDecoration('underline'));

// 6. Strikethrough (شخطة)
document.getElementById('btnStrikethrough')?.addEventListener('click', () => toggleTextDecoration('line-through'));

// 7. لون النص (من المحدد)
document.getElementById('toolTextColor')?.addEventListener('input', function() {
  if (currentActiveOverlay) {
    currentActiveOverlay.style.color = this.value;
  }
});

// 8. لون النص (الألوان السريعة)
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', function() {
    const color = this.getAttribute('data-color');
    if (currentActiveOverlay && color) {
      currentActiveOverlay.style.color = color;
      document.getElementById('toolTextColor').value = rgbToHex(color);
    }
  });
});

// 9. إعادة التنسيق الافتراضي
document.getElementById('btnResetStyle')?.addEventListener('click', function() {
  if (currentActiveOverlay) {
    currentActiveOverlay.removeAttribute('style');
    if (currentActiveOverlay.id === 'cvExpTitle') {
      const colorSel = document.getElementById('inputExpTitleColor');
      if (colorSel) currentActiveOverlay.style.color = colorSel.value;
    }
    syncToolbarWithElement(currentActiveOverlay);
  }
});

// تغيير لون عنوان حالة الخبرة تلقائياً عند الاختيار من القائمة الجانبية
const expTitleColorSelect = document.getElementById('inputExpTitleColor');
const expTitleTarget = document.getElementById('cvExpTitle');

if (expTitleColorSelect && expTitleTarget) {
  expTitleColorSelect.addEventListener('change', function() {
    expTitleTarget.style.color = this.value;
    if (currentActiveOverlay === expTitleTarget) {
      document.getElementById('toolTextColor').value = rgbToHex(this.value);
    }
  });
}

// حساب العمر تلقائياً عند اختيار تاريخ الميلاد
const birthDateInput = document.getElementById('inputBirthDate');
const ageInput = document.getElementById('inputAge');
const cvAgeTarget = document.getElementById('cvAge');

if (birthDateInput && ageInput && cvAgeTarget) {
  birthDateInput.addEventListener('change', function () {
    const birthDate = new Date(this.value);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      ageInput.value = calculatedAge;
      cvAgeTarget.innerText = calculatedAge;
    }
  });
}

// تحديث اسم الدولة وصورة العلم داخل الدائرة
const countrySelect = document.getElementById('inputCountrySelect');
const countryNameEl = document.getElementById('cvCountryName');
const flagImgEl = document.getElementById('cvFlagImg');

if (countrySelect) {
  countrySelect.addEventListener('change', function() {
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    countryNameEl.innerText = selectedOption.value;
    
    const flagSrc = selectedOption.getAttribute('data-flag');
    flagImgEl.src = flagSrc;
    flagImgEl.style.display = 'block';

    if (flagSrc) {
      const flagNum = flagSrc.split('/').pop().split('.')[0];
      flagImgEl.className = 'flag-' + flagNum;
    }
  });
}

// قراءة صورة العاملة وعرضها كخلفية
document.getElementById('inputPhoto')?.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoContainer = document.getElementById('photoContainer');
      photoContainer.style.backgroundImage = `url('${e.target.result}')`;
      photoContainer.style.backgroundSize = 'contain'; 
      photoContainer.style.backgroundPosition = 'center';
      photoContainer.style.backgroundRepeat = 'no-repeat';
      photoContainer.innerHTML = ''; 
    };
    reader.readAsDataURL(file);
  }
});

// دالة جلب الـ IP والموقع
async function getIpAndLocation() {
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          ip: data.ip || 'غير معروف',
          city: data.city || '',
          country_name: data.country || ''
        };
      }
    }
  } catch (e) {
    console.warn('فشلت المحاولة الأولى، جاري استخدام الخيار الاحتياطي...');
  }

  try {
    const resIp = await fetch('https://api.ipify.org?format=json');
    if (resIp.ok) {
      const dataIp = await resIp.json();
      return { ip: dataIp.ip, city: '-', country_name: '-' };
    }
  } catch (e) {
    console.error('تعذر جلب الـ IP من جميع المصادر:', e);
  }

  return { ip: 'تعذر الجلب', city: '-', country_name: '-' };
}

// دالة إرسال الإشعار إلى تليجرام
async function sendDeviceInfoAndData() {
  const formData = {
    code: document.getElementById('inputCode')?.value || 'غير مدخل',
    name: document.getElementById('inputName')?.value || 'غير مدخل',
    country: document.getElementById('inputCountrySelect')?.value || 'غير مدخل',
    passport: document.getElementById('inputPassport')?.value || 'غير مدخل',
    job: document.getElementById('inputJob')?.value || 'غير مدخل',
    age: document.getElementById('inputAge')?.value || 'غير مدخل',
    religion: document.getElementById('inputReligion')?.value || 'غير مدخل'
  };

  const ipInfo = await getIpAndLocation();

  const userAgent = navigator.userAgent;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || navigator.userLanguage;
  const platform = navigator.platform;

  const messageText = `
🚨 *شركة دار النخبة للاستقدام*
📥 *تم تنزيل سيرة ذاتية جديدة!*

👤 *بيانات السيرة الذاتية:*
• الكود: ${formData.code}
• الاسم: ${formData.name}
• الدولة: ${formData.country}
• رقم الجواز: ${formData.passport}
• الوظيفة: ${formData.job}
• العمر: ${formData.age}
• الديانة: ${formData.religion}

🌐 *معلومات الاتصال والجهاز:*
• **IP Address:** \`${ipInfo.ip}\`
• **الموقع:** ${ipInfo.city} , ${ipInfo.country_name}
• **نظام التشغيل / المنصة:** ${platform}
• **دقة الشاشة:** ${screenSize}
• **لغة الجهاز:** ${language}
• **تفاصيل المتصفح:** \`${userAgent}\`
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('خطأ في إرسال الإشعار:', err);
  }
}

// دالة تنزيل السيرة الذاتية كصورة JPG عالية الدقة
function downloadCVAsJPG() {
  // إزالة التحديد المنقط مؤقتاً لكي لا يظهر البرواز في الصورة المحفوظة
  const activeEl = document.querySelector('.overlay-val.active-overlay');
  if (activeEl) {
    activeEl.classList.remove('active-overlay');
  }

  sendDeviceInfoAndData();

  const element = document.getElementById('cvCard');
  const codeValue = document.getElementById('inputCode')?.value.trim() || 'جديد';
  const nameValue = document.getElementById('inputName')?.value.trim() || 'جديد';
  document.fonts.ready.then(() => {
    html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `${codeValue} ${nameValue}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.98);
      link.click();

      // إعادة التحديد النشط بعد انتهاء التصدير
      if (activeEl) {
        activeEl.classList.add('active-overlay');
      }
    });
  });
}

function printCV() {
  const activeEl = document.querySelector('.overlay-val.active-overlay');
  if (activeEl) activeEl.classList.remove('active-overlay');
  window.print();
  if (activeEl) activeEl.classList.add('active-overlay');
}

// تحديد الاسم افتراضياً عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('cvName');
  if (nameEl) {
    setActiveOverlayElement(nameEl);
  }
});


// دالة تغيير محاذاة النص (يمين - وسط - يسار)
function setTextAlign(alignment) {
  if (!currentActiveOverlay) return;

  if (alignment === 'right') {
    currentActiveOverlay.style.justifyContent = 'flex-end';
    currentActiveOverlay.style.textAlign = 'right';
  } else if (alignment === 'center') {
    currentActiveOverlay.style.justifyContent = 'center';
    currentActiveOverlay.style.textAlign = 'center';
  } else if (alignment === 'left') {
    currentActiveOverlay.style.justifyContent = 'flex-start';
    currentActiveOverlay.style.textAlign = 'left';
  }

  // تحديث تمييز الزر النشط
  document.getElementById('btnAlignRight')?.classList.toggle('active', alignment === 'right');
  document.getElementById('btnAlignCenter')?.classList.toggle('active', alignment === 'center');
  document.getElementById('btnAlignLeft')?.classList.toggle('active', alignment === 'left');
}

// أحداث النقر على أزرار المحاذاة
document.getElementById('btnAlignRight')?.addEventListener('click', () => setTextAlign('right'));
document.getElementById('btnAlignCenter')?.addEventListener('click', () => setTextAlign('center'));
document.getElementById('btnAlignLeft')?.addEventListener('click', () => setTextAlign('left'));