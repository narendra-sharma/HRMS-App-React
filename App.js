import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import DashboardScreen from "./screens/AdminDashboardScreen";
import AuthScreen from "./screens/AuthScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import OtpInputScreen from "./screens/OtpInputScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StaffScreen from "./screens/StaffScreen";
import Icon from "react-native-vector-icons/FontAwesome5";
import { DrawerStatusProvider } from "./Contexts/DrawerStatusContext";
import { apiCheckUserExists } from "./apis/auth";

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Text>Getting token...</Text> */}
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [initialScreenName, setInitialScreenName] = useState("");

  // let initialScreenName = "";

  //handle user type dashboard screen
  const handleUserType = (userCode) => {
    console.log("usercode: ", userCode);
    switch (userCode) {
      case 1:
        //userCode: 1 => superadmin
        // initialScreenName = "Admin Dashboard";
        setInitialScreenName("Admin Dashboard");
        return;
      case 2:
        //userCode: 2 => admin
        // initialScreenName = "Admin Dashboard";
        setInitialScreenName("Admin Dashboard");
        return;

      case 3:
        //userCode: 3 => staff
        // initialScreenName = "Satff Dashboard";
        setInitialScreenName("Staff Dashboard");
        return;

      default:
        // initialScreenName = "Login";
        setInitialScreenName("Login");
        return;
    }
  };

  useEffect(() => {
    const checkUserExists = async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      try {
        // custom logic
        await sleep(2000);
        const token = await AsyncStorage.getItem("token");
        const res = await apiCheckUserExists();
        console.log("user exists in database? ", res.data.status);
        if (res.data.status) {
          const profile = await AsyncStorage.getItem("profile");
          await AsyncStorage.removeItem("coords");
          const parsedProfile = JSON.parse(profile);
          console.log("parsed profile: ", parsedProfile.user_role);
          if (parsedProfile.user_role) {
            setUserType(parsedProfile.user_role); // Set the user type in the state
            handleUserType(Number(parsedProfile.user_role));
          }
        } else {
          await AsyncStorage.multiRemove(["coords", "profile", "token"]);
          setInitialScreenName("Login");
        }
      } finally {
        setIsLoading(false);
      }

      // handleUserType(parsedProfile.user_type);
    };

    checkUserExists();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  console.log("initial screen name: ", initialScreenName);

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <DrawerStatusProvider>
          <Stack.Navigator initialRouteName={initialScreenName}>
            {/* Common Screens */}
            <Stack.Screen
              name="Login"
              component={AuthScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
              options={({ navigation }) => ({
                // headerShown: false,
                headerTitle: "Back to Login",
                headerTransparent: true,
                headerTintColor: '#fff',
                // headerLeft: () => (
                //   <Pressable
                //     onPress={() => navigation.goBack()}
                //     style={{
                //       display: "flex",
                //       flexDirection: "row",
                //       justifyContent: "space-between",
                //       alignItems: "center",
                //       width: 140,
                //     }}
                //   >
                //     <Icon name="arrow-left" size={18} />
                //     <Text
                //       style={{
                //         fontSize: 20,
                //         // fontWeight: "bold",
                //       }}
                //     >
                //       Back to Login
                //     </Text>
                //   </Pressable>
                // ),
              })}
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

            {/* Admin Screen */}
            <Stack.Screen
              name="Admin Dashboard"
              component={DashboardScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />

            {/* Employee Screen */}
            <Stack.Screen
              name="Staff Dashboard"
              component={StaffScreen}
              options={({ navigation }) => ({
                title: "Staff Dashboard",
                headerShown: false,
              })}
            />
          </Stack.Navigator>
        </DrawerStatusProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );

  // return (
  //   <RootSiblingParent>
  //     <NavigationContainer>
  //       <Stack.Navigator initialRouteName={initialScreenName}>
  //         {/* Common Screens */}
  //         {!userType ? (
  //           <>
  //             <Stack.Screen
  //               name="Login"
  //               component={AuthScreen}
  //               options={{ headerShown: false }}
  //             />
  //             <Stack.Screen
  //               name="Admin Dashboard"
  //               component={DashboardScreen}
  //               options={({ navigation }) => ({
  //                 title: "Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //             <Stack.Screen
  //               name="Staff Dashboard"
  //               component={StaffScreen}
  //               options={({ navigation }) => ({
  //                 title: "Staff Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //           </>
  //         ) : userType == 1 || userType == 2 ? (
  //           <>
  //             <Stack.Screen
  //               name="Admin Dashboard"
  //               component={DashboardScreen}
  //               options={({ navigation }) => ({
  //                 title: "Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //             <Stack.Screen
  //               name="Login"
  //               component={AuthScreen}
  //               options={{ headerShown: false }}
  //             />
  //             <Stack.Screen
  //               name="Staff Dashboard"
  //               component={StaffScreen}
  //               options={({ navigation }) => ({
  //                 title: "Staff Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //           </>
  //         ) : (
  //           <>
  //             <Stack.Screen
  //               name="Staff Dashboard"
  //               component={StaffScreen}
  //               options={({ navigation }) => ({
  //                 title: "Staff Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //             <Stack.Screen
  //               name="Login"
  //               component={AuthScreen}
  //               options={{ headerShown: false }}
  //             />
  //             <Stack.Screen
  //               name="Admin Dashboard"
  //               component={DashboardScreen}
  //               options={({ navigation }) => ({
  //                 title: "Dashboard",
  //                 headerShown: false,
  //               })}
  //             />
  //           </>
  //         )}

  //         <Stack.Screen
  //           name="Forgot Password"
  //           component={ForgotPasswordScreen}
  //           options={({ navigation }) => ({
  //             // headerShown: false,
  //             headerTitle: "",
  //             headerTransparent: true,
  //             headerLeft: () => (
  //               <Pressable
  //                 onPress={() => navigation.goBack()}
  //                 style={{
  //                   display: "flex",
  //                   flexDirection: "row",
  //                   justifyContent: "space-between",
  //                   alignItems: "center",
  //                   width: 140,
  //                 }}
  //               >
  //                 <Icon name="arrow-left" size={18} />
  //                 <Text
  //                   style={{
  //                     fontSize: 20,
  //                     // fontWeight: "bold",
  //                   }}
  //                 >
  //                   Back to Login
  //                 </Text>
  //               </Pressable>
  //             ),
  //           })}
  //         />
  //         <Stack.Screen
  //           name="OTP"
  //           component={OtpInputScreen}
  //           options={{ headerShown: false }}
  //         />
  //         <Stack.Screen
  //           name="Reset Password"
  //           component={ResetPasswordScreen}
  //           options={{ headerShown: false }}
  //         />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </RootSiblingParent>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
