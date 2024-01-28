import React, { useEffect, useState } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import MainPage from "./Main";
import { Flex, Select } from "antd";
import { useTranslation } from "react-i18next";
import Test1 from "./Test1";
import Test3 from "./Test3";

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

  return (
    <Router>
      <div>
        <Flex gap="middle" align="center" justify="space-around">
          <h1>Hello</h1>
          <Select
            value={lang}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "th", label: `${t("LanguageChangeTH")}` },
              { value: "en", label: `${t("LanguageChangeEN")}` },
            ]}
          />
        </Flex>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route path="/test1" component={Test1} />
          <Route path="/test2" component={Test1} />
          <Route path="/test3" component={Test3} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
