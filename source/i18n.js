let currentLanguage = "en";
let translations = {};

/**
 * Initialize i18n with browser language or default
 * @param {string} languageId
 */
async function translate(languageId) {
  const browserLang = navigator.language.split("-")[0];
  const supportedLanguages = ["en", "es", "fr"];
  if (!supportedLanguages.includes(browserLang)) {
    languageId = "en";
  }

  await loadTranslations(languageId);

  applyTranslations();
}

/**
 * Load translation file for specific language
 * @param {string} languageId - Language code (en, es, fr)
 */
async function loadTranslations(languageId) {
  try {
    const response = await fetch(`locales/${languageId}.json`);
    translations = await response.json();
    currentLanguage = languageId;
  } catch (error) {
    console.error(`Failed to load translations for ${languageId}:`, error);
    // Fallback to English
    if (languageId !== "en") {
      await loadTranslations("en");
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
  Object.keys(params).forEach((param) => {
    text = text.replace(`{{${param}}}`, params[param]);
  });

  return text;
}

/**
 * Apply translations to elements with data-i18n attribute
 */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  document.title = t("app_title");
}

export { translate, t, currentLanguage };
