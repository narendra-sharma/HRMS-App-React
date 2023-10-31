import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";

export const apiGetAllProjects = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "projects",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetProjectDetails = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "project-data",
    method: "post",
    body: qs.stringify(formData),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetDropdownEmployeesList = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "employees",
    method: "post",
    body: qs.stringify(formData),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAssignEmployeeToProject = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "assign-employee",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiReverseGeocoding = async (lat, lng) => {
  const response = await request({
    path: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0`,
    method: "get",
  });
  return response;
};

// export const apiGetPreFilledProjectDetails = async (id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     path: `auth/edit-project/${id}`,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };

// export const apiUpdateProjectDetails = async (formData, id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     method: "post",
//     path: `auth/update-project/${id}`,
//     body: formData,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };
