#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - All supported languages
const LANGUAGES = {
  'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian',
  'az': 'Azerbaijani', 'eu': 'Basque', 'be': 'Belarusian', 'bn': 'Bengali', 'bs': 'Bosnian',
  'bg': 'Bulgarian', 'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)', 'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish',
  'nl': 'Dutch', 'eo': 'Esperanto', 'et': 'Estonian', 'tl': 'Filipino', 'fi': 'Finnish',
  'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek',
  'gu': 'Gujarati', 'ht': 'Haitian Creole', 'ha': 'Hausa', 'haw': 'Hawaiian', 'iw': 'Hebrew',
  'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian', 'is': 'Icelandic', 'ig': 'Igbo', 'id': 'Indonesian',
  'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese', 'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh',
  'km': 'Khmer', 'ko': 'Korean', 'ku': 'Kurdish', 'ky': 'Kyrgyz', 'lo': 'Lao', 'la': 'Latin',
  'lv': 'Latvian', 'lt': 'Lithuanian', 'lb': 'Luxembourgish', 'mk': 'Macedonian', 'mg': 'Malagasy',
  'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi', 'mn': 'Mongolian',
  'my': 'Myanmar', 'ne': 'Nepali', 'no': 'Norwegian', 'ps': 'Pashto', 'fa': 'Persian',
  'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian', 'ru': 'Russian', 'sm': 'Samoan',
  'gd': 'Scottish Gaelic', 'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi',
  'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish', 'su': 'Sundanese',
  'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai',
  'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu', 'uz': 'Uzbek', 'vi': 'Vietnamese', 'cy': 'Welsh',
  'xh': 'Xhosa', 'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu'
};

// Popular languages for default operations
const POPULAR_LANGUAGES = ['hi', 'es', 'it', 'pa', 'fr', 'de', 'pt', 'ru', 'ar', 'ja', 'ko', 'zh-CN', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi'];

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

const I18N_DIR = path.join(__dirname, '..', 'src', 'assets', 'i18n');
const ENGLISH_FILE = path.join(I18N_DIR, 'en.json');

// Language mapping for LibreTranslate
const mapTargetLanguage = (lang) => {
  return lang === 'pa' ? 'hi' : lang; // Punjabi fallback to Hindi
};

// Translation function using MyMemory API (CORS-friendly)
async function translateText(text, sourceLang, targetLang) {
  const mappedTarget = mapTargetLanguage(targetLang);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${mappedTarget}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data?.responseData?.translatedText;

    if (translatedText && translatedText !== text && !translatedText.includes('NO QUERY SPECIFIED')) {
      return translatedText;
    }

    // If MyMemory fails, try a simple dictionary mapping for common medical terms
    return translateMedicalTerm(text, targetLang) || text;
  } catch (error) {
    console.warn(`Translation failed for "${text}" -> ${targetLang}:`, error.message);
    return translateMedicalTerm(text, targetLang) || text;
  }
}

// Fallback dictionary for common medical terms
function translateMedicalTerm(text, targetLang) {
  const medicalTerms = {
    es: {
      'Bone Marrow': 'Trasplante de Médula Ósea',
      'Cardiology': 'Cardiología',
      'IVF': 'Fertilización In Vitro',
      'Cosmetic': 'Cirugía Cosmética',
      'Kidney Transplant': 'Trasplante de Riñón',
      'Liver Transplant': 'Trasplante de Hígado',
      'Gynecology': 'Ginecología',
      'Neuro Surgery': 'Neurocirugía',
      'Oncology': 'Oncología',
      'Orthopedics': 'Ortopedia',
      'Spine Surgery': 'Cirugía de Columna',
      'Weight Loss': 'Pérdida de Peso',
      'Hematology': 'Hematología'
    },
    it: {
      'Bone Marrow': 'Trapianto di Midollo Osseo',
      'Cardiology': 'Cardiologia',
      'IVF': 'Fertilizzazione In Vitro',
      'Cosmetic': 'Chirurgia Estetica',
      'Kidney Transplant': 'Trapianto di Rene',
      'Liver Transplant': 'Trapianto di Fegato',
      'Gynecology': 'Ginecologia',
      'Neuro Surgery': 'Neurochirurgia',
      'Oncology': 'Oncologia',
      'Orthopedics': 'Ortopedia',
      'Spine Surgery': 'Chirurgia della Colonna',
      'Weight Loss': 'Perdita di Peso',
      'Hematology': 'Ematologia'
    },
    hi: {
      'Bone Marrow': 'अस्थि मज्जा प्रत्यारोपण',
      'Cardiology': 'हृदय रोग',
      'IVF': 'आईवीएफ',
      'Cosmetic': 'कॉस्मेटिक सर्जरी',
      'Kidney Transplant': 'किडनी ट्रांसप्लांट',
      'Liver Transplant': 'लिवर ट्रांसप्लांट',
      'Gynecology': 'स्त्री रोग',
      'Neuro Surgery': 'न्यूरो सर्जरी',
      'Oncology': 'ऑन्कोलॉजी',
      'Orthopedics': 'हड्डी रोग',
      'Spine Surgery': 'स्पाइन सर्जरी',
      'Weight Loss': 'वजन घटाना',
      'Hematology': 'हेमेटोलॉजी'
    },
    pa: {
      'Bone Marrow': 'ਹੱਡੀ ਮੈਰੋ ਟ੍ਰਾਂਸਪਲਾਂਟ',
      'Cardiology': 'ਦਿਲ ਦੀ ਬੀਮਾਰੀ',
      'IVF': 'ਆਈਵੀਐਫ',
      'Cosmetic': 'ਸੁੰਦਰਤਾ ਦੀ ਸਰਜਰੀ',
      'Kidney Transplant': 'ਗੁਰਦੇ ਦੀ ਟ੍ਰਾਂਸਪਲਾਂਟ',
      'Liver Transplant': 'ਜਿਗਰ ਦੀ ਟ੍ਰਾਂਸਪਲਾਂਟ',
      'Gynecology': 'ਔਰਤਾਂ ਦੀ ਬੀਮਾਰੀ',
      'Neuro Surgery': 'ਦਿਮਾਗ ਦੀ ਸਰਜਰੀ',
      'Oncology': 'ਕੈਂਸਰ ਦਾ ਇਲਾਜ',
      'Orthopedics': 'ਹੱਡੀ ਦੀ ਬੀਮਾਰੀ',
      'Spine Surgery': 'ਰੀੜ੍ਹ ਦੀ ਸਰਜਰੀ',
      'Weight Loss': 'ਭਾਰ ਘਟਾਉਣਾ',
      'Hematology': 'ਖੂਨ ਦੀ ਬੀਮਾਰੀ'
    }
  };

  return medicalTerms[targetLang]?.[text] || null;
}

// Read JSON file
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return {};
  }
}

// Write JSON file
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved ${filePath}`);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
  }
}

// Get missing keys for a language
function getMissingKeys(englishData, targetData) {
  const englishKeys = Object.keys(englishData);
  const targetKeys = Object.keys(targetData);

  return englishKeys.filter(key => !targetKeys.includes(key));
}

// Generate missing translations for a language
async function generateMissingTranslations(targetLang) {
  console.log(`\n🔄 Processing ${LANGUAGES[targetLang]} (${targetLang})...`);

  const englishData = readJsonFile(ENGLISH_FILE);
  const targetFile = path.join(I18N_DIR, `${targetLang}.json`);
  const targetData = readJsonFile(targetFile);

  const missingKeys = getMissingKeys(englishData, targetData);

  if (missingKeys.length === 0) {
    console.log(`✅ No missing translations for ${LANGUAGES[targetLang]}`);
    return;
  }

  console.log(`📝 Found ${missingKeys.length} missing keys`);

  const newTranslations = { ...targetData };
  let successCount = 0;
  let failCount = 0;

  for (const key of missingKeys) {
    const englishText = englishData[key];
    console.log(`   Translating: ${key} -> "${englishText}"`);

    try {
      const translated = await translateText(englishText, 'en', targetLang);
      newTranslations[key] = translated;
      console.log(`   ✅ Result: "${translated}"`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  writeJsonFile(targetFile, newTranslations);
  console.log(`📊 ${LANGUAGES[targetLang]} Summary: ${successCount} success, ${failCount} failed`);
}

// Get translation completeness stats
function getCompleteness() {
  console.log('\n📊 Translation Completeness:');
  console.log('=============================');

  const englishData = readJsonFile(ENGLISH_FILE);
  const totalKeys = Object.keys(englishData).length;

  Object.keys(LANGUAGES).forEach(lang => {
    const targetFile = path.join(I18N_DIR, `${lang}.json`);
    const targetData = readJsonFile(targetFile);
    const translatedKeys = Object.keys(targetData).length;
    const percentage = Math.round((translatedKeys / totalKeys) * 100);

    const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
    console.log(`${lang.toUpperCase()} (${LANGUAGES[lang]}): ${bar} ${percentage}% (${translatedKeys}/${totalKeys})`);
  });
}

// Export missing keys to CSV for manual translation
function exportMissingKeys() {
  console.log('\n📤 Exporting missing keys to CSV...');

  const englishData = readJsonFile(ENGLISH_FILE);
  const csvRows = ['Key,English,' + Object.keys(LANGUAGES).map(l => LANGUAGES[l]).join(',')];

  Object.keys(englishData).forEach(key => {
    const row = [key, englishData[key]];

    Object.keys(LANGUAGES).forEach(lang => {
      const targetFile = path.join(I18N_DIR, `${lang}.json`);
      const targetData = readJsonFile(targetFile);
      row.push(targetData[key] || '');
    });

    csvRows.push(row.map(cell => `"${cell}"`).join(','));
  });

  const csvFile = path.join(I18N_DIR, 'translations.csv');
  fs.writeFileSync(csvFile, csvRows.join('\n'), 'utf8');
  console.log(`✅ Exported to ${csvFile}`);
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🌍 Translation Manager');
  console.log('====================');

  if (!fs.existsSync(I18N_DIR)) {
    console.error(`❌ i18n directory not found: ${I18N_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(ENGLISH_FILE)) {
    console.error(`❌ English source file not found: ${ENGLISH_FILE}`);
    process.exit(1);
  }

  switch (command) {
    case 'generate':
      const targetLang = args[1];
      if (targetLang && LANGUAGES[targetLang]) {
        await generateMissingTranslations(targetLang);
      } else if (targetLang === 'all') {
        for (const lang of Object.keys(LANGUAGES)) {
          if (lang !== 'en') { // Skip English as it's the source
            await generateMissingTranslations(lang);
          }
        }
      } else if (targetLang === 'popular') {
        for (const lang of POPULAR_LANGUAGES) {
          await generateMissingTranslations(lang);
        }
      } else {
        console.log('Usage: node translate.js generate <language|popular|all>');
        console.log('Popular languages:', POPULAR_LANGUAGES.join(', '));
        console.log('All languages:', Object.keys(LANGUAGES).slice(0, 10).join(', ') + '... (and more)');
      }
      break;

    case 'list':
      const filter = args[1] || 'popular';
      if (filter === 'all') {
        console.log('\n📋 All Supported Languages:');
        console.log('============================');
        Object.entries(LANGUAGES).forEach(([code, name]) => {
          console.log(`${code.padEnd(6)} - ${name}`);
        });
      } else {
        console.log('\n📋 Popular Languages:');
        console.log('======================');
        POPULAR_LANGUAGES.forEach(code => {
          console.log(`${code.padEnd(6)} - ${LANGUAGES[code]}`);
        });
      }
      break;

    case 'stats':
      getCompleteness();
      break;

    case 'export':
      exportMissingKeys();
      break;

    default:
      console.log('🌍 Translation Manager CLI');
      console.log('===========================');
      console.log('Available commands:');
      console.log('  generate <lang|popular|all> - Generate missing translations');
      console.log('  stats                       - Show translation completeness');
      console.log('  list [all]                  - List available languages');
      console.log('  export                      - Export all keys to CSV');
      console.log('');
      console.log('Examples:');
      console.log('  node translate.js generate hi      # Generate Hindi translations');
      console.log('  node translate.js generate popular # Generate popular language translations');
      console.log('  node translate.js generate all     # Generate all missing translations');
      console.log('  node translate.js list             # Show popular languages');
      console.log('  node translate.js list all         # Show all supported languages');
      console.log('  node translate.js stats            # Show completion stats');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}