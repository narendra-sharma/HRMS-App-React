import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";

export const apiGenerateQrCodedata = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(formData);
  const response = await request({
    path: "qr_code/create",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": "multipart/form-data; ",
    },
  });
  return response;
};

export const apiScannedQrData = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log("qr login form data: ", formData);
  const response = await request({
    path: "qr_code/login",
    method: "post",
    body: qs.stringify(formData),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetCheckinStatus = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(formData);
  const response = await request({
    path: "check-in/status",
    method: "post",
    body: qs.stringify(formData),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetProjectQrImage = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(formData);
  const response = await request({
    path: "check-in/status",
    method: "post",
    body: qs.stringify(formData),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiCheckQrCodeExistsByProject = async (paramsData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(paramsData);
  const response = await request({
    path: "qr_exists",
    params: paramsData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
