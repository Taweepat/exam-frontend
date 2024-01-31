import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  th: {
    translation: {
      "ChangePosition" : "เปลี่ยนตำแหน่ง",
      "SlideShape" : "เลื่อนรูปแบบ",
      "LanguageChangeTH": "ไทย",
      "LanguageChangeEN": "อังกฤษ",
      "Test1Title":"ทดสอบ 1",
      "Test2Title":"ทดสอบ 2",
      "Test3Title":"ทดสอบ 3",
      "Test1Des":"จัดการหน้าเว็บ",
      "Test2Des":"เชื่อมต่อ API",
      "Test3Des":"จัดการหน้าฟอร์ม",
      "BackHomePage":"หน้าหลัก",
      "FormNoun" : "คำนำหน้า",
      "FormFirstName": "ชื่อ",
      "FormLastName": "นามสกุล",
      "FormBirthDay": "วันเกิด",
      "FormNation": "สัญชาติ",
      "FormId": "หมายเลขบัตรประชาชน",
      "FormGender": "เพศ",
      "FormGenderM": "ชาย",
      "FormGenderF": "หญิง",
      "FormGenderN": "ไม่ระบุ",
      "FormTel": "เบอร์โทรศัพท์",
      "FormTravelBook": "เลขที่หนังสือเดินทาง",
      "FormSalary": "เงินเดือน",
      "BtnClearForm": "ล้างข้อมูล",
      "BtnSendForm": "ส่งข้อมูล",
      "BtnDeleteForm": "ลบข้อมูล",
      "BtnSelectForm": "เลือกทั้งหมด",
      "TableAction": "จัดการ",
      "BtnEdit": "แก้ไข",
    },
  },
  en: {
    translation: {
      "ChangePosition" : "Change Position",
      "SlideShape" : "เลื่อนรูปแบบ",
      "LanguageChangeTH": "Thai",
      "LanguageChangeEN": "English",
      "Test1Title":"Test 1",
      "Test2Title":"Test 2",
      "Test3Title":"Test 3",
      "Test1Des":"Layout & style",
      "Test2Des":"Connect API",
      "Test3Des":"From & Table",
      "BackHomePage":"Home Page",
      "FormNoun" : "Noun",
      "FormFirstName": "Name",
      "FormLastName": "Lastname",
      "FormBirthDay": "Birthday",
      "FormNation": "Nationality",
      "FormId": "Citizen ID",
      "FormGender": "Gender",
      "FormGenderM": "Male",
      "FormGenderF": "Female",
      "FormGenderN": "None",
      "FormTel": "Mobile No.",
      "FormTravelBook": "Traveler Book",
      "FormSalary": "Salary",
      "BtnClearForm": "Clear",
      "BtnSendForm": "Send",
      "BtnDeleteForm": "Delete",
      "BtnSelectForm": "Select All",
      "BtnEdit": "Edit",
      "TableAction": "Action",
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
