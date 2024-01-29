import { Card, Flex, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./scss/main.scss";
import { NavLink } from "react-router-dom";

interface Props {}

export default function MainPage({}: Props) {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Flex className="mainbody" justify="center" align="center" gap={10}>
        <NavLink to="/test1" state={t("Test1Des")}>
          <Card title={t("Test1Title")} className="box">
            <h1>{t("Test1Des")}</h1>
          </Card>
        </NavLink>
        <NavLink to="/test2" state={t("Test2Des")}>
          <Card title={t("Test2Title")} className="box">
            <h1>{t("Test2Des")}</h1>
          </Card>
        </NavLink>
        <NavLink to="/test3" state={t("Test3Des")}>
          <Card title={t("Test3Title")} className="box">
            <h1>{t("Test3Des")}</h1>
          </Card>
        </NavLink>
      </Flex>
    </>
  );
}
