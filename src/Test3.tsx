import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IUserState,
  addUser,
  deleteUser,
  editUser,
} from "./store/slices/userSlice";
import "./scss/test3.scss";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { Option } from "antd/es/mentions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useTranslation } from "react-i18next";
import EditModal from "./components/EditModal";

type Props = {};

const Test3 = (props: Props) => {
  const users = useSelector((store: RootState) => store.userReducer);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState<IUserState | null>(null);

  const dataSchema = z
    .object({
      noun: z.string().min(1, { message: "Required" }).nullable(),
      gender: z.string().min(1, { message: "*" }),
      firstName: z
        .string()
        .min(2, { message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" })
        .refine(
          (value) => {
            const thaiCharacters = /^[ก-๙.-]+$/;
            const englishCharacters = /^[a-zA-Z.-]+$/;
            return thaiCharacters.test(value) || englishCharacters.test(value);
          },
          {
            message: "ชื่อต้องประกอบด้วยภาษาไทยหรืออังกฤษเท่านั้น",
          }
        ),
      lastName: z
        .string()
        .min(2, { message: "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร" })
        .refine(
          (value) => {
            const thaiCharacters = /^[ก-๙.-]+$/;
            const englishCharacters = /^[a-zA-Z.-]+$/;
            return thaiCharacters.test(value) || englishCharacters.test(value);
          },
          {
            message: "นามสกุลต้องประกอบด้วยภาษาไทยหรืออังกฤษเท่านั้น",
          }
        ),
      cardId: z
        .string()
        .superRefine((value, ctx) => {
          if (value.length < 13) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `รหัสบัตรประชาชนไม่ถูกต้อง ยังขาดอีก [${
                13 - value.length
              }]`,
            });
          }
          if (value.length > 13) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `รหัสบัตรประชาชนไม่ถูกต้อง เกินมา [${
                value.length - 13
              }]`,
            });
          }
        })
        .refine(
          (value) => {
            if (value.length !== 13) return false;
            if (!/^[0-9]+$/.test(value)) return false;
            const checksum = parseInt(value[12], 10);
            const sum = value
              .slice(0, 12)
              .split("")
              .map((digit) => parseInt(digit, 10))
              .reduce((acc, digit, index) => acc + digit * (13 - index), 0);
            const calculatedChecksum = (11 - (sum % 11)) % 10;

            return checksum === calculatedChecksum;
          },
          {
            message: "รหัสบัตรประชาชนไม่ถูกต้อง",
          }
        ),
      tel: z.string().refine((value) => /^0[0-9]{9}$/.test(value), {
        message: "ตัวแรกของเบอร์ต้องเป็น 0 และต้องมีตัวเลข 10 ตัวเท่านั้น",
      }),
      travelBookNo: z.string().min(1, { message: "Required" }),
      birthDate: z.string().min(1, { message: "Required" }).nullable(),
      nation: z.string().min(1, { message: "Required" }).nullable(),
      salary: z.string().min(1, { message: "Required" }).nullable(),
    })
    .refine(
      (value) => {
        const regex = /^[a-zA-Z]+$/;
        const isEnglish =
          regex.test(value.firstName) && regex.test(value.lastName);
        const thaiRegex = /^[ก-๙]+$/;
        const isThai =
          thaiRegex.test(value.firstName) && thaiRegex.test(value.lastName);
        if (!isEnglish || !isThai) {
          return isEnglish || isThai;
        }
      },
      {
        message: "ชื่อและนามสกุลภาษาไม่ตรงกัน",
      }
    );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserState>({
    resolver: zodResolver(dataSchema),
  });

  const onDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  const columns: TableColumnsType<IUserState> = [
    {
      title: `${t("FormFirstName")}`,
      dataIndex: "noun",
      render: (text, record) =>
        record.noun + " " + record.firstName + " " + record.lastName,
      sorter: (a, b) => {
        const typeA = a.noun + " " + a.firstName + " " + a.lastName;
        const typeB = b.noun + " " + b.firstName + " " + b.lastName;
        return typeA.localeCompare(typeB);
      },
    },
    {
      title: `${t("FormGender")}`,
      dataIndex: "gender",
      sorter: (a, b) => {
        return a.gender.localeCompare(b.gender);
      },
    },
    {
      title: `${t("FormTel")}`,
      dataIndex: "tel",
      sorter: (a, b) => {
        return a.tel.localeCompare(b.tel);
      },
    },
    {
      title: `${t("FormNation")}`,
      dataIndex: "nation",
      sorter: (a, b) => {
        return a.nation.localeCompare(b.nation);
      },
    },
    {
      title: `${t("TableAction")}`,
      fixed: "right",
      render: (record) => (
        <Flex gap="middle">
          <Button onClick={() => handleOpenModal(record)}>Edit</Button>
          <Button onClick={() => onDelete(record.id)}>
            {t("BtnDeleteForm")}
          </Button>
        </Flex>
      ),
    },
  ];

  const onSubmit: SubmitHandler<IUserState> = (data) => {
    console.log(data);
    dispatch(addUser(data));
    reset();
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setIsSelectAll(newSelectedRowKeys.length === users.length);
  };

  const onSelectDelete = () => {
    selectedRowKeys.map((v) => dispatch(deleteUser(v)));
  };

  const onSelectAllChange = (e: { target: { checked: boolean } }) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    const newSelectedRowKeys = checked ? users.map((user) => user.id) : [];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleOpenModal = (record: IUserState) => {
    console.log("Preview : ", record);
    setEditData(record);
    setIsModalVisible(true);
    console.log("Preview state : ", editData);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setIsModalVisible(false);
  };

  return (
    <div>
      <Flex justify="center">
        <Form layout="horizontal" onFinish={handleSubmit(onSubmit)}>
          <div className="formData">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label={t("FormNoun")}>
                  <Controller
                    name="noun"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="คำนำหน้าชื่อ">
                        <Option value="นาย">นาย</Option>
                        <Option value="นาง">นาง</Option>
                        <Option value="นางสาว">นางสาว</Option>
                        <Option value="เด็กชาย">เด็กชาย</Option>
                        <Option value="เด็กหญิง">เด็กหญิง</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label={t("FormFirstName")}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.firstName && (
                    <span className="error-message">
                      {errors.firstName.message}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label={t("FormLastName")}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.lastName && (
                    <span className="error-message">
                      {errors.lastName.message}
                    </span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label={t("FormBirthDay")}>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <DatePicker
                        placeholder="เดือน/วัน/ปี"
                        onChange={(date) =>
                          onChange(date?.format("YYYY-MM-DD"))
                        }
                      />
                    )}
                  />
                  {errors.birthDate && (
                    <span className="error-message">
                      {errors.birthDate.message}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item label={t("FormNation")}>
                  <Controller
                    name="nation"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="-- กรุณาเลือก --">
                        <Option value="thai">ไทย</Option>
                        <Option value="spain">สเปน</Option>
                        <Option value="malaysian">มาเลเซีย</Option>
                        <Option value="laos">ลาว</Option>
                        <Option value="english">อังกฤษ</Option>
                      </Select>
                    )}
                  />
                  {errors.nation && (
                    <span className="error-message">
                      {errors.nation.message}
                    </span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t("FormId")}>
              <Controller
                name="cardId"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.cardId && (
                <span className="error-message">{errors.cardId.message}</span>
              )}
            </Form.Item>
            <Form.Item label={t("FormGender")}>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio value="ชาย">{t("FormGenderM")}</Radio>
                    <Radio value="หญิง">{t("FormGenderF")}</Radio>
                    <Radio value=" ">{t("FormGenderN")}</Radio>
                  </Radio.Group>
                )}
              />
              {errors.gender && (
                <span className="error-message">{errors.gender.message}</span>
              )}
            </Form.Item>
            <Form.Item label={t("FormTel")}>
              <Controller
                name="tel"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.tel && (
                <span className="error-message">{errors.tel.message}</span>
              )}
            </Form.Item>
            <Form.Item label={t("FormTravelBook")}>
              <Controller
                name="travelBookNo"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.travelBookNo && (
                <span className="error-message">
                  {errors.travelBookNo.message}
                </span>
              )}
            </Form.Item>
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item label={t("FormSalary")}>
                  <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.salary && (
                    <span className="error-message">
                      {errors.salary.message}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  <Button htmlType="submit">{t("BtnClearForm")}</Button>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  <Button htmlType="submit">{t("BtnSendForm")}</Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Flex>
      <Row gutter={16} style={{ marginTop: "1rem" }}>
        <Col span={25} style={{ padding: "0 10rem", margin: "1rem 0" }}>
          <Checkbox checked={isSelectAll} onChange={onSelectAllChange}>
            {t("BtnSelectForm")}
          </Checkbox>
          <Button onClick={() => onSelectDelete()}>{t("BtnDeleteForm")}</Button>
        </Col>
        <Col span={25} style={{ padding: "0 10rem" }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 5 }}
            scroll={{ y: 340 }}
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>
      <EditModal
        visible={isModalVisible}
        onClose={() => {
          handleCloseModal();
        }}
        onSubmit={(data) => {
          console.log(data);
          const result = { ...data, id: editData?.id };
          dispatch(editUser(result));
          handleCloseModal();
        }}
        defaultValues={editData || undefined}
      />
    </div>
  );
};

export default Test3;
