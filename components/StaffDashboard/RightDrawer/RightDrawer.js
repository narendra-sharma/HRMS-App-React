import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
} from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCheckUserExists, apiLogout } from "../../../apis/auth";
import ProfileStackScreen from "../Profile/ProfileStackScreen";
import { useFocusEffect } from "@react-navigation/native";
import ChangePassword from "../Settings/ChangePassword";
import { useRoute } from "@react-navigation/native";
import HomeStackScreen from "../Home/HomeStackScreen";
import MonthlyCalendar from "../Calendar/MonthlyCalendar";
import LeavesStackScreen from "../Leaves/LeavesStackScreen";
import { useCustomDrawerStatus } from "../../../Contexts/DrawerStatusContext";
import QRScanner from "../QRCode/QRScanner";

const Drawer = createDrawerNavigator();

const RightDrawer = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userFlag, setUserFlag] = useState(false);

  // console.log(route.name);

  const handleLogout = () => {
    const logout = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await apiLogout(JSON.parse(token));
        console.log(res);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("profile");
        await AsyncStorage.removeItem("coords");
        navigation.navigate("Login");
      } catch (err) {
        console.log(err);
      }
    };

    Alert.alert(`Logout`, `Are you sure you want to logout?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => logout() },
    ]);
  };

  const { drawerStatus, setDrawerStatus } = useCustomDrawerStatus(); // Use the hook to access the drawer status
  // console.log("drawerStatus", drawerStatus);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await AsyncStorage.getItem("profile");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          // console.log("User data retrieved: ", parsedUser);
        } else {
          console.log("No user data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getData(); // Fetch data when the component mounts
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getData = async () => {
        try {
          const user = await AsyncStorage.getItem("profile");
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          // console.log("we at local storage: ", userData);
          // console.log("user", JSON.parse(user));
        } catch (err) {
          console.log(err);
        }
      };

      getData();
      checkUserExists();
      return () => {
        isActive = false;
      };
    }, [drawerStatus, userFlag])
  );

  //check if user exists in database
  const checkUserExists = async () => {
    try {
      const res = await apiCheckUserExists();
      if (!res.data.status) {
        await AsyncStorage.multiRemove(["coords", "profile", "token"]);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer.Navigator
      hideStatusBarOnOpen={true}
      initialRoute="Home"
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <SafeAreaView
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <StatusBar style="auto" />
            <View>
              {/* User Details Section */}
              <Pressable
                style={styles.detailsContainer}
                onPress={() => {
                  navigation.navigate("Profile");
                }}
              >
                <View style={styles.innerContainer}>
                  <Icon
                    // style={styles.drawerIcon}
                    name="user-circle-o"
                    size={35}
                    color="#fff"
                  />
                  <View>
                    <Text style={styles.textStyle}>{userData?.name}</Text>
                    <Text
                      style={{ fontSize: 12, marginLeft: 5, color: "#fff" }}
                    >
                      {userData?.email}
                    </Text>
                  </View>
                </View>
              </Pressable>

              <DrawerItemList
                {...props}
                onItemPress={({ route }) => {
                  if (route.name !== "Manage Companies") {
                    setIsManageCompaniesActive(false);
                  }
                  props.navigation.navigate(route.name);
                }}
              />
            </View>

            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Icon
                  name="sign-out"
                  size={28}
                  color="#fff"
                  style={{ paddingHorizontal: 8 }}
                />
                <Text style={{ color: "#fff" }}>Logout</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        );
      }}
    >
      {/* Profile Stack */}
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="user" size={28} />,
          title: "Profile",
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
        name="Profile"
        component={ProfileStackScreen}
      />

      {/* Home Screen */}
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: () => <Icon name="home" size={28} />,
          headerShown: false,
          // drawerItemStyle: { display: "none" },
        }}
        component={HomeStackScreen}
      />

      {/* QR Screen */}
      <Drawer.Screen
        name="QR Code"
        component={QRScanner}
        options={({ navigation }) => ({
          title: "Scan QR Code",
          // headerShown: false,
          drawerIcon: () => <Icon name="qrcode" size={28} />,
        })}
      />

      {/* Calendar Screen */}
      <Drawer.Screen
        options={({ navigation }) => ({
          drawerIcon: () => <Icon name="calendar" size={28} />,
          title: "Calendar",
          // headerShown: false,
          headerTransparent: true,
        })}
        name="View Calendar"
        component={MonthlyCalendar}
      />

      {/* Leaves Screen */}
      <Drawer.Screen
        options={({ navigation }) => ({
          drawerIcon: () => (
            <MaterialCommunityIcons name="party-popper" size={28} />
          ),
          title: "Leaves",
          headerShown: false,
        })}
        name="Leaves"
        component={LeavesStackScreen}
      />

      {/* Change Password */}
      <Drawer.Screen
        options={({ navigation }) => ({
          drawerIcon: () => <Icon name="cog" size={28} />,
          title: "Change Password",
          // headerShown: false,
        })}
        name="Change Password"
        component={ChangePassword}
      />
    </Drawer.Navigator>
  );
};

export default RightDrawer;

const styles = StyleSheet.create({
  detailsContainer: {
    height: 150,
    width: "100%",
    backgroundColor: "#055C9D",
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
  },

  innerContainer: {
    padding: 5,
    display: "flex",
    flexDirection: "row",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 40,
    maxWidth: "90%",
    gap: 8
  },

  subMenuButton: {
    height: 50,
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    borderRadius: 4,
    padding: 8,
  },

  subMenuItem: {
    height: 50,
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    borderRadius: 4,
    padding: 8,
    paddingLeft: 48,
  },

  activeSubMenu: {
    backgroundColor: "#E0E0E0", // Add your desired active background color
  },

  drawerIcon: {
    padding: 4,
    marginRight: 4,
    fontSize: 22,
  },

  textStyle: {
    marginLeft: 5,
    color: "#fff",
  },

  settingsButton: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#055C9D",
    borderRadius: 8,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },

  logoutButton: {
    height: 50,
    backgroundColor: "#055C9D",
    borderRadius: 8,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
  },
});
