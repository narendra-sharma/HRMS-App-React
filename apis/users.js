import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiCreateNewUser = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  console.log(JSON.parse(token));
  const response = await request({
    method: "post",
    path: "auth/create-user",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateUserDetails = async (formData, id) => {
  console.log("id", id);
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-user/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetUsersFromUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/get-users",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetUserDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-user/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDeleteUser = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-user/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
