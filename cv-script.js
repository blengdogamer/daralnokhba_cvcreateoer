// خريطة الربط بين الإدخالات والنصوص فوق الصورة
const fieldsMap = {
  'inputCode': 'cvCode',
  'inputName': 'cvName',
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
    flagImgEl.src = selectedOption.getAttribute('data-flag');
    flagImgEl.style.display = 'block';
  });
}

// قراءة صورة العاملة وعرضها في المساحة المخصصة
// قراءة صورة العاملة وعرضها كخلفية لضمان تطابق المعاينة مع الصورة المحفوظة
document.getElementById('inputPhoto').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoContainer = document.getElementById('photoContainer');
      photoContainer.style.backgroundImage = `url('${e.target.result}')`;
      photoContainer.style.backgroundSize = 'cover'; // لتكبير الصورة وتغطية الإطار كاملاً بدون حواف بيضاء
      photoContainer.style.backgroundPosition = 'center';
      photoContainer.style.backgroundRepeat = 'no-repeat';
      photoContainer.innerHTML = ''; // مسح النص التوضيحي الداخلي
    };
    reader.readAsDataURL(file);
  }
});

// دالة تنزيل الـ PDF بمقاس A4 صافي بدون حواف بيضاء
//function downloadCVAsPDF() {
//  const element = document.getElementById('cvCard');
//  const codeValue = document.getElementById('inputCode').value.trim() || 'جديد';
//
//  const opt = {
//    margin:       0,
//    filename:     `CV_DarAlNukhba_${codeValue}.pdf`,
//    image:        { type: 'jpeg', quality: 1.0 },
//    html2canvas:  { 
//      scale: 3, 
//      useCORS: true, 
//      logging: false,
//      scrollX: 0,
//      scrollY: 0
//    },
//    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
//  };
//const photo = element.querySelector('.overlay-photo img');
//
//if (photo && photo.naturalWidth && photo.naturalHeight) {
//  const box = element.querySelector('.overlay-photo');
//
//  const boxWidth = box.clientWidth;
//  const boxHeight = box.clientHeight;
//
//  const imageRatio = photo.naturalWidth / photo.naturalHeight;
//  const boxRatio = boxWidth / boxHeight;
//
//  if (imageRatio > boxRatio) {
//    photo.style.width = '100%';
//    photo.style.height = 'auto';
//  } else {
//    photo.style.width = 'auto';
//    photo.style.height = '100%';
//  }
//
//  photo.style.maxWidth = '100%';
//  photo.style.maxHeight = '100%';
//  photo.style.objectFit = 'cover';
//}
//  html2pdf().set(opt).from(element).save();
//}

// دالة تنزيل السيرة الذاتية كصورة JPG عالية الدقة
// دالة تنزيل السيرة الذاتية كصورة JPG عالية الدقة
function downloadCVAsJPG() {
  const element = document.getElementById('cvCard');
  const codeValue = document.getElementById('inputCode').value.trim() || 'جديد';

  // الانتظار لحين تحميل خط Cairo بالكامل قبل التقاط الصورة
  document.fonts.ready.then(() => {
    html2canvas(element, {
      scale: 3,             // دقة عالية وواضحة
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