let currentLanguage = 'en';
let translations = {};

/**
 * Initialize i18n with browser language or default
 */
async function initI18n() {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = ['en', 'es', 'fr'];

  currentLanguage = supportedLanguages.includes(browserLang) ? browserLang : 'en';

  await loadTranslations(currentLanguage);
  applyTranslations();
}

/**
 * Load translation file for specific language
 * @param {string} lang - Language code (en, es, fr)
 */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    translations = await response.json();
    currentLanguage = lang;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    // Fallback to English
    if (lang !== 'en') {
      await loadTranslations('en');
    }
  }
}

/**
 * Get translated text by key
 * @param {string} key - Translation key
 * @param {Object} params - Parameters to replace in translation
 * @returns {string}
 */
function t(key, params = {}) {
  let text = translations[key] || key;

  // Replace {{variable}} with params
  Object.keys(params).forEach(param => {
    text = text.replace(`{{${param}}}`, params[param]);
  });

  return text;
}

/**
 * Apply translations to elements with data-i18n attribute
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });

  // Update document title
  document.title = t('app_title');
}

/**
 * Change language dynamically
 * @param {string} lang - Language code
 */
async function changeLanguage(lang) {
  await loadTranslations(lang);
  applyTranslations();
}

export { initI18n, t, changeLanguage, currentLanguage };
