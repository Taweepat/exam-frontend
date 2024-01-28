import { Card, Flex, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./scss/main.scss";
import { Link } from "react-router-dom";

interface Props {}

export default function MainPage({}: Props) {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Flex className="mainbody" justify="center" align="center" gap={10}>
          <Card title={t("Test1Title")} className="box" onClick={()=> window.location.href = '/test1'}>
            <h1>{t("Test1Des")}</h1>
          </Card>
        <Link to="/test2">
          <Card title={t("Test2Title")} className="box" onClick={()=> window.location.href = '/test2'}>
            <h1>{t("Test2Des")}</h1>
          </Card>
        </Link>
        <Link to="/test3">
          <Card title={t("Test3Title")} className="box" onClick={()=> window.location.href = '/test3'}>
            <h1>{t("Test3Des")}</h1>
          </Card>
        </Link>
      </Flex>
    </>
  );
}
