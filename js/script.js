// 1. تمام ضروری ایلیمنٹس کو سلیکٹ کرنا
const langPicker = document.getElementById('languagePicker');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');

/**
 * 2. زبان اور ڈیزائن تبدیل کرنے کا فنکشن
 * یہ فنکشن ویب سائٹ کا ٹیکسٹ اور سمت (RTL/LTR) دونوں بدلتا ہے
 */
function applyLanguage(lang) {
    // اگر منتخب زبان ہماری لسٹ میں نہیں ہے تو انگلش استعمال کرو
    const data = translations[lang] || translations['en'];

    // HTML کے ٹیکسٹ کو بدلنا
    document.getElementById('heroTitle').innerText = data.heroTitle;
    document.getElementById('heroSubtitle').innerText = data.heroSubtitle;
    document.getElementById('uploadPrompt').innerText = data.uploadPrompt;
    document.getElementById('uploadLimit').innerText = data.uploadLimit;

    // باڈی کی کلاس بدلنا (تاکہ CSS کے فونٹس لاگو ہو سکیں)
    document.body.className = ''; 
    document.body.classList.add('lang-' + lang);

    // زبان کی سمت (RTL برائے اردو/عربی) سیٹ کرنا
    if (data.rtl) {
        document.body.style.direction = 'rtl';
    } else {
        document.body.style.direction = 'ltr';
    }
}

// 3. جب یوزر مینو سے خود زبان بدلے
langPicker.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});

/**
 * 4. آٹو ڈیٹیکٹ سسٹم (Auto-Detect System)
 * جب ویب سائٹ لوڈ ہو گی، یہ خود بخود یوزر کا ملک اور زبان پہچان لے گی
 */
window.addEventListener('DOMContentLoaded', () => {
    // براؤزر کی ڈیفالٹ زبان حاصل کرنا (مثلاً 'ur-PK' سے 'ur')
    const browserLang = navigator.language.split('-')[0];

    // اگر وہ زبان ہمارے پاس موجود ہے تو اسے لگا دو
    if (translations[browserLang]) {
        langPicker.value = browserLang;
        applyLanguage(browserLang);
    } else {
        // ورنہ انگلش دکھاؤ
        applyLanguage('en');
    }
});

/**
 * 5. اپلوڈ سسٹم (Upload System)
 */
uploadBox.addEventListener('click', () => {
    fileInput.click(); // اپلوڈ باکس پر کلک کرنے سے فائل سلیکٹر کھل جائے گا
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        console.log("فائل منتخب ہو گئی ہے: " + file.name);
        // یہاں اگلے مرحلے میں ہم تصویر کا سائز کم کرنے والی لاجک جوڑیں گے
    }
});
// نئے ایلیمنٹس کو سلیکٹ کرنا
const editorSection = document.getElementById('editorSection');
const imagePreview = document.getElementById('imagePreview');
const fileSizeInfo = document.getElementById('fileSizeInfo');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');

// جب فائل سلیکٹ ہو
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result; // تصویر دکھائیں
            fileSizeInfo.innerText = "Original Size: " + (file.size / 1024).toFixed(2) + " KB";
            editorSection.style.display = 'block'; // ایڈیٹر سیکشن کھولیں
            uploadBox.style.display = 'none'; // اپلوڈ باکس چھپا دیں
        };
        reader.readAsDataURL(file);
    }
});

// سلائیڈر کی ویلیو دکھانا
qualitySlider.addEventListener('input', () => {
    qualityValue.innerText = qualitySlider.value + "%";
});
// 1. کمپریشن کے لیے ضروری ایلیمنٹس
const compressBtn = document.getElementById('compressBtn');
const downloadSection = document.getElementById('downloadSection');
const downloadLink = document.getElementById('downloadLink');
const newSizeInfo = document.getElementById('newSizeInfo');
const newImgPreview = document.createElement('img'); // میموری میں نئی تصویر بنانے کے لیے

// 2. کمپریشن کا فنکشن
compressBtn.addEventListener('click', () => {
    const quality = document.getElementById('qualitySlider').value / 100;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imagePreview.naturalWidth;
    canvas.height = imagePreview.naturalHeight;
    ctx.drawImage(imagePreview, 0, 0);

    // کمپریشن کرنا
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

    // دونوں تصویروں کو پری ویو میں سیٹ کرنا
    document.getElementById('beforeImg').src = imagePreview.src; // پرانی تصویر
    document.getElementById('afterImg').src = compressedDataUrl; // نئی تصویر
    
    // ڈاؤن لوڈ لنک اپ ڈیٹ کرنا
    downloadLink.href = compressedDataUrl;
    
    // سائز کا حساب لگانا
    const stringLength = compressedDataUrl.split(',')[1].length;
    const sizeInBytes = Math.ceil((stringLength * 3) / 4);
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    // سائز لیبل اپ ڈیٹ کرنا
    document.getElementById('oldSizeLabel').innerText = fileSizeInfo.innerText;
    newSizeInfo.innerText = "New Size: " + sizeInKB + " KB";

    // سیکشن دکھانا
    downloadSection.style.display = 'block';
    downloadSection.scrollIntoView({ behavior: 'smooth' });
});
// دوبارہ شروع کرنے کے لیے (Reset Function)
function resetTool() {
    fileInput.value = ''; // پرانی فائل ختم کریں
    editorSection.style.display = 'none'; // ایڈیٹر چھپائیں
    downloadSection.style.display = 'none'; // ڈاؤن لوڈ بٹن چھپائیں
    uploadBox.style.display = 'block'; // اپلوڈ باکس دوبارہ دکھائیں
}

// اگر آپ چاہیں تو ایک "Compress Another" بٹن بھی لگا سکتے ہیں