import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import DashboardScreen from "./screens/AdminDashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AuthScreen from "./screens/AuthScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import OtpInputScreen from "./screens/OtpInputScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import IntDesignDashScreen from "./screens/IntDesignDashScreen";
import SupplierStaffScreen from "./screens/SupplierStaffScreen";
import SalesManagerScreen from "./screens/SalesManagerScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FirstLoginScreen from "./screens/FirstLoginScreen";
import StaffScreen from "./screens/StaffScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Common Screens */}
          <Stack.Screen
            name="Login"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="First Login"
            component={FirstLoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Forgot Password"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTP"
            component={OtpInputScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reset Password"
            component={ResetPasswordScreen}
            options={{ headerShown: false }}
          />
          {/* Admin Stack */}
          <Stack.Screen
            name="Admin Dashboard"
            component={DashboardScreen}
            options={({ navigation }) => ({
              title: "Dashboard",
              headerShown: false,
            })}
          />

          {/* Customer Stack */}
          <Stack.Screen
            name="Staff Dashboard"
            component={StaffScreen}
            options={({ navigation }) => ({
              title: "Staff Dashboard",
              headerShown: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
