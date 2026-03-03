const supportedLanguages = ["en", "es", "fr"];
const defaultLanguage = "en";

let currentLanguage = defaultLanguage;
let translations = {};

/**
 * @param {string | undefined} forcedLanguageId
 */
async function translate(forcedLanguageId) {
  const selectedLanguageId = forcedLanguageId || getLanguageId();
  await loadTranslations(selectedLanguageId);
  applyTranslations();
}

/**
 * @returns {string} languageId
 */
function getLanguageId() {
  const browserLanguages = navigator.languages.map((l) => l.split("-")[0]);

  for (const browserLanguage of browserLanguages) {
    if (supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    }
  }

  return defaultLanguage;
}

/**
 * @param {string} languageId - Language code (en, es, fr)
 */
async function loadTranslations(languageId) {
  try {
    const response = await fetch(`locales/${languageId}.json`);
    translations = await response.json();
    currentLanguage = languageId;
  } catch (error) {
    console.error(`Failed to load translations for ${languageId}:`, error);

    if (languageId !== defaultLanguage) {
      await loadTranslations(defaultLanguage);
    }
  }
}

/**
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

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  document.title = t("app_title");
}

export { translate, t, currentLanguage };
