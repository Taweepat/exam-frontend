import React from "react";
import {
  Modal,
  Form,
  Button,
  Input,
  Col,
  Row,
  Select,
  DatePicker,
  Flex,
  Radio,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { IUserState } from "../store/slices/userSlice";
import { Option } from "antd/es/mentions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: IUserState) => void;
  defaultValues?: IUserState;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const { t, i18n } = useTranslation();

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
    defaultValues,
    resolver: zodResolver(dataSchema),
  });

  const handleCloseModal = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      width="auto"
      title="Edit User"
      visible={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={(data) => {
            handleSubmit(onSubmit)(data);
            reset(); 
          }}
        >
          Save
        </Button>,
      ]}
    >
      <Flex justify="center">
        <Form
          layout="horizontal"
          onFinish={(data) => {
            handleSubmit(onSubmit)(data);
            reset(); 
          }}
        >
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
            </Row>
          </div>
        </Form>
      </Flex>
    </Modal>
  );
};

export default EditModal;
