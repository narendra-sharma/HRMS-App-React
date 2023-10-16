import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";

export const apiApplyLeave = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(formData);
  const response = await request({
    path: "leave/apply",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": formData?.leave_type_id
        ? "application/json"
        : "multipart/form-data",
    },
  });
  return response;
};

export const apiGetLeaveTypes = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "leave-types",
    method: "post",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetAllLeaves = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "fetch/leaves",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetLeavesGroup = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "fetch/leaves_group",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
