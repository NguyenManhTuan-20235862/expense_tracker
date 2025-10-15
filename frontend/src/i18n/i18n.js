import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON files
import japaneseTranslations from "../locales/ja/japanese.json";
import englishTranslations from "../locales/en/english.json";
import vietnameseTranslations from "../locales/vi/vietnamese.json";

export const locales = {
  ja: "日本語",
  en: "English",
  vi: "Tiếng Việt",
};

const resources = {
  ja: {
    translation: japaneseTranslations.japanese
  },
  en: {
    translation: englishTranslations.english
  },
  vi: {
    translation: vietnameseTranslations.vietnamese
  }
};

// Lấy ngôn ngữ đã lưu từ localStorage hoặc mặc định là 'ja'
const savedLanguage = localStorage.getItem('appLanguage') || 'ja';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    debug: false, // Tắt debug mode trong production

    interpolation: {
      escapeValue: false 
    }
  });

// Lưu ngôn ngữ vào localStorage mỗi khi thay đổi
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
});

export default i18n;