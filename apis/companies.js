import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllCompanies = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log(token);
  const response = await request({
    path: "auth/view-all-companies",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiCreateNewCompany = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: "auth/create-company",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetCompanyDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-company/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDeleteCompany = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-company/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateCompanyDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-company/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetAllUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/get-all-users",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetAllQuotes = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/view-all-quotes",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
