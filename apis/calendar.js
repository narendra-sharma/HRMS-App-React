import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";

export const apiGetMonthlyCalendar = async (month, year) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "attendance-monthly",
    method: "post",
    body: qs.stringify({ month: month, year: year }),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetShiftInformationBreakdown = async (day, month, year) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "shift-info",
    method: "post",
    body: qs.stringify({ day: day, month: month, year: year }),
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      //   "Content-type": "application/x-www-form-urlencoded",
    },
  });
  return response;
};

export const apiDeleteEmployeeFromProject = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: "remove-employee",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

// export const apiGetAllLeaves = async () => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     path: "fetch/leaves",
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };
