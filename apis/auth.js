import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";

export const apiAuth = async (formData) => {
  const response = await request({
    path: "login",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiLogout = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "logout",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateProfile = async (userData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "profile",
    method: "put",
    body: userData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetProfileDetails = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "profile",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiSendForgotPasswordCode = async (formData) => {
  const response = await request({
    path: "forgot-password",
    method: "post",
    body: qs.stringify(formData),
  });
  return response;
};

export const apiVerifyOtp = async (formData) => {
  const response = await request({
    path: "check-otp",
    method: "post",
    body: qs.stringify(formData),
  });
  return response;
};

export const apiResetPassword = async (formData) => {
  const response = await request({
    path: "reset-password",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiChangePasswordFromDashboard = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "change-password",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiCheckUserExists = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "exists",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
