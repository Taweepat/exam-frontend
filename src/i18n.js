import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  th: {
    translation: {
      "LanguageChangeTH": "ไทย",
      "LanguageChangeEN": "อังกฤษ",
      "Test1Title":"ทดสอบ 1",
      "Test2Title":"ทดสอบ 2",
      "Test3Title":"ทดสอบ 3",
      "Test1Des":"จัดการหน้าเว็บ",
      "Test2Des":"เชื่อมต่อ API",
      "Test3Des":"จัดการหน้าฟอร์ม",
      "BackHomePage":"หน้าหลัก",
    },
  },
  en: {
    translation: {
      "LanguageChangeTH": "Thai",
      "LanguageChangeEN": "English",
      "Test1Title":"Test 1",
      "Test2Title":"Test 2",
      "Test3Title":"Test 3",
      "Test1Des":"Layout & style",
      "Test2Des":"Connect API",
      "Test3Des":"From & Table",
      "BackHomePage":"Home Page",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "th",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
