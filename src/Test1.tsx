import { Button, Col, Divider, Flex, Row } from "antd";
import React, { useState } from "react";
import "./scss/test1.scss";
import { useTranslation } from "react-i18next";
type Props = {};

const Test1 = (props: Props) => {
  const [num, setNum] = useState([1, 2, 3, 4, 5, 6]);
  const [row, setRow] = useState([1, 2]);
  const { t, i18n } = useTranslation();

  const Increment = () => {
    const movedArray = num.map((value, index) => {
      if (index !== 0) {
        return num[index - 1];
      } else {
        return num[num.length - 1];
      }
    });

    setNum(movedArray);
  };

  const Decrement = () => {
    const movedArray = num.map((value, index) => {
      if (index !== num.length - 1) {
        return num[index + 1];
      } else {
        return num[0];
      }
    });
    setNum(movedArray);
  };

  const ChangeRows = () => {
    const updatedRow = row.map((v) => (v % 2) + 1);
    setRow(updatedRow);
  };

  const generate = () => {
    const randomNumbers: number[] = [];
    while (randomNumbers.length < num.length) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber);
      }
    }
    setNum(randomNumbers);
  };

  return (
    <div className="container">
      <Row gutter={16}>
        <Col span={6}>
          <div className="box-shapes" onClick={Decrement}>
            <div className={`arrow-left`} />
            <div className="box-des">{t("SlideShape")}</div>
          </div>
        </Col>
        <Col span={12}>
          <div className="box-shapes" onClick={ChangeRows}>
            <div className={`arrow-up`} />
            <div className={`arrow-down`} />
            <div className="box-des">{t("ChangePosition")}</div>
          </div>
        </Col>
        <Col span={6}>
          <div className="box-shapes" onClick={Increment}>
            <div className={`arrow-right`} />
            <div className="box-des">{t("SlideShape")}</div>
          </div>
        </Col>
      </Row>
      <Divider />
      <div className="box-preview">
        {row.map((v) => {
          return v === 1 ? (
            <Flex gap="middle" justify="center" align="center" wrap="wrap">
              {num.slice(0, 3).map((v) => (
                <div className="box-shapes" onClick={generate}>
                  <div className={`shape${v}`} />
                </div>
              ))}
            </Flex>
          ) : (
            <Flex gap="middle" justify="end" align="center" wrap="wrap">
              {num.slice(3).map((v) => (
                <div className="box-shapes" onClick={generate}>
                  <div className={`shape${v}`} />
                </div>
              ))}
            </Flex>
          );
        })}
      </div>
    </div>
  );
};

export default Test1;
