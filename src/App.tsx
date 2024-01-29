import React, { useEffect, useState } from "react";
import "./scss/App.scss";
import MainPage from "./Main";
import { Button, Flex, Layout, Select } from "antd";
import { useTranslation } from "react-i18next";
import Test1 from "./Test1";
import Test3 from "./Test3";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";

function App() {
  const [lang, setLang] = useState("th");
  const { t, i18n } = useTranslation();

  const handleChange = (value: string) => {
    setLang(value);
    i18n.changeLanguage(value);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const [pageTitle, setPageTitle] = useState("");

  const titleMap = [
    { path: "/", title: " " },
    { path: "/test1", title: `${t("Test1Des")}` },
    { path: "/test2", title: `${t("Test2Des")}` },
    { path: "/test3", title: `${t("Test3Des")}` },
  ];

  let curLoc = useLocation();
  useEffect(() => {
    const curTitle = titleMap.find((item) => item.path === curLoc.pathname);
    if (curTitle && curTitle.title) {
      setPageTitle(curTitle.title);
      document.title = curTitle.title;
    }
  }, [curLoc, lang]);

  return (
    <Layout className="App">
      <Flex gap="middle" align="start" justify="space-between">
        <h1>{pageTitle}</h1>
        <Flex gap="10px" align="start" justify="space-between" vertical>
          <Select
            value={lang}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "th", label: `${t("LanguageChangeTH")}` },
              { value: "en", label: `${t("LanguageChangeEN")}` },
            ]}
          />
          {pageTitle === " " ? (
            <></>
          ) : (
            <NavLink to="/">
              <Button>{t("BackHomePage")}</Button>
            </NavLink>
          )}
        </Flex>
      </Flex>
      <Content>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/test2" element={<></>} />
          <Route path="/test3" element={<Test3 />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
