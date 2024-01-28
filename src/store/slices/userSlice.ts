import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type UserState = {
  noun: "นาย" | "นาง" | "นางสาว" | "เด็กชาย" | "เด็กหญิง" | undefined;
  firstName: string;
  lastName: string;
  birthDate: Date;
  Nation: string;
  cardNo: string;
  gender: string;
  tel: string;
  travelBookNo: string;
  salary: string;
};

const initialValue: UserState = {
  noun: undefined,
  firstName: "",
  lastName: "",
  birthDate: new Date(),
  Nation: "",
  cardNo: "",
  gender: "",
  tel: "",
  travelBookNo: "",
  salary: "",
};

const createUserSlice = createSlice({
  name: "create",
  initialState: {},
  reducers: {},
  extraReducers(builder) {},
});

export const {} = createUserSlice.actions;
export const createUser = (store: RootState) => store.userReducer;
export default createUserSlice.reducer;
