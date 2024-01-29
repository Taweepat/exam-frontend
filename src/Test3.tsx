import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IUserState, addUser } from "./store/slices/userSlice";
import "./scss/test3.scss";
import {
  Button,
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

type Props = {};

const Test3 = (props: Props) => {
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
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IUserState>({
    resolver: zodResolver(dataSchema),
  });

  const columns: TableColumnsType<IUserState> = [
    {
      title: "ชื่อ",
      dataIndex: "noun",
      render: (text, record) =>
        record.noun + " " + record.firstName + " " + record.lastName,
      sorter: true,
    },
    {
      title: "เพศ",
      dataIndex: "gender",
      sorter: true,
    },
    {
      title: "หมายเลขโทรศัพท์มือถือ",
      dataIndex: "tel",
      sorter: true,
    },
    {
      title: "สัญชาติ",
      dataIndex: "nation",
      sorter: true,
    },
    {
      title: "Action",
      key: "noun",
      fixed: "right",
      render: (e) => (
        <Flex gap="middle">
          <Button>Delete</Button>
          <Button>Edit</Button>
        </Flex>
      ),
    },
  ];

  const users = useSelector((store: RootState) => store.userReducer);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSubmit: SubmitHandler<IUserState> = (data) => {
    console.log(data);
    dispatch(addUser(data));

    reset();
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Flex justify="center">
        <Form layout="horizontal" onFinish={handleSubmit(onSubmit)}>
          <div className="formData">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="คำนำหน้า">
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
                <Form.Item label="ชื่อ">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="นามสกุล">
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="วันเกิด">
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
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item label="สัญชาติ">
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
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="หมายเลขบัตรประชาชน">
              <Controller
                name="cardId"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
            <Form.Item label="เพศ">
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio value="ชาย">ชาย</Radio>
                    <Radio value="หญิง">หญิง</Radio>
                    <Radio value=" ">ไม่ระบุ</Radio>
                  </Radio.Group>
                )}
              />
            </Form.Item>
            <Form.Item label="เบอร์โทรศัพท์">
              <Controller
                name="tel"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
            <Form.Item label="เลขที่หนังสือเดินทาง">
              <Controller
                name="travelBookNo"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item label="เงินเดือน">
                  <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  <Button htmlType="submit">ล้างข้อมูล</Button>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  <Button htmlType="submit">ส่งข้อมูล</Button>
                </Form.Item>
              </Col>
            </Row>

            {JSON.stringify(errors)}
          </div>
        </Form>
      </Flex>
      <Row gutter={16} style={{ marginTop: "1rem" }}>
        <Col span={25}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 240 }}
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Test3;
