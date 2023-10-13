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
import Home from "../Home/Home";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogout } from "../../../apis/auth";
import CompanyStackScreen from "../Companies/CompanyStackScreen";
import ProfileStackScreen from "../Profile/ProfileStackScreen";
import { useFocusEffect } from "@react-navigation/native";
import ChangePassword from "../Settings/ChangePassword";
import AccountsStackScreen from "../Accounts/AccountsStackScreen";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ViewProjects from "../Companies/Projects/ViewProjects";
import ConsultantManagerStack from "../Companies/Users/ConsultantManagers/ConsultantManagerStack";
import ConsultantStack from "../Companies/Users/Consultants/ConsultantStack";
import ContractorStack from "../Companies/Users/Contractors/ContractorStack";
import CustomerStack from "../Companies/Users/Customers/CustomerStack";
import QRCodeGenerator from "../QRCode/QRCodeGenerator";
import QRStackScreen from "../QRCode/QRStackScreen";
import HomeStackScreen from "../Home/HomeStackScreen";
import MonthlyCalendar from "../Calendar/MonthlyCalendar";
import Leaves from "../Leaves/ApplyLeaves";
import LeavesStackScreen from "../Leaves/LeavesStackScreen";
import { useCustomDrawerStatus } from "../../../Contexts/DrawerStatusContext";
import QRScanner from "../QRCode/QRScanner";

const Drawer = createDrawerNavigator();

const RightDrawer = ({ navigation }) => {
  // const [userData, setUserData] = useState({ name: "", email: "" });
  const [userData, setUserData] = useState({});
  const [isCompaniesSubMenuOpen, setIsCompaniesSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [activeScreenName, setActiveScreenName] = useState("Home");
  // const [isManageCompaniesActive, setIsManageCompaniesActive] = useState(false);
  const [userFlag, setUserFlag] = useState(false);

  const route = useRoute();
  // console.log(route.name);

  const handleLogout = () => {
    const logout = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await apiLogout(JSON.parse(token));
        console.log(res);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("profile");
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
  console.log("drawerStatus", drawerStatus);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await AsyncStorage.getItem("profile");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          console.log("User data retrieved: ", parsedUser);
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
          console.log("we at local storage: ", userData);
          // console.log("user", JSON.parse(user));
        } catch (err) {
          console.log(err);
        }
      };

      getData();
      return () => {
        isActive = false;
      };
    }, [drawerStatus, userFlag])
  );

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

              <ScrollView>
                {/* Custom Home 
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Home");
                    setActiveScreenName("Home");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Home" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="home"
                    size={28}
                  />
                  <Text>Home</Text>
                </Pressable> */}

                {/* Accounts/Users Sub-Menu 
                <Pressable
                  onPress={() => {
                    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
                    setIsCompaniesSubMenuOpen(false);
                  }}
                  style={styles.subMenuButton}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="people"
                    size={28}
                  />
                  <Text>
                    Manage Users{" "}
                    {isUsersSubMenuOpen ? (
                      <Icon
                        style={{ marginLeft: 8 }}
                        name="angle-up"
                        size={16}
                      />
                    ) : (
                      <Icon
                        style={{ marginLeft: 8 }}
                        name="angle-down"
                        size={16}
                      />
                    )}
                  </Text>
                </Pressable>
                {isUsersSubMenuOpen && (
                  <View>
                    <View>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Consultant Managers");
                          setActiveScreenName("Consultant Managers");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Consultant Managers" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Consultant Managers</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Consultants");
                          setActiveScreenName("Consultants");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Consultants" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Consultants</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Contractors");
                          setActiveScreenName("Contractors");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Contractors" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Contractors</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Customers");
                          setActiveScreenName("Customers");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Customers" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Customers</Text>
                      </Pressable>
                    </View>
                  </View>
                )}  */}

                {/* Custom QR Scanner */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("QR Code");
                    setActiveScreenName("QR Code");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "QR Code" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="qr-code"
                    size={28}
                  />
                  <Text>Scan QR Code</Text>
                </Pressable> */}

                {/* Custom Companies */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Manage Companies");
                    setActiveScreenName("Manage Companies");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Manage Companies" &&
                      styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="admin-panel-settings"
                    size={28}
                  />
                  <Text>All Companies</Text>
                </Pressable> */}

                {/* Custom Projects */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Projects");
                    setActiveScreenName("Projects");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Projects" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={28}
                  />
                  <Text>All Projects</Text>
                </Pressable> */}

                {/* Custom Profile */}
                {/* <Pressable
                  onPress={() => {
                    setActiveScreenName("Profile");
                    props.navigation.navigate("Profile");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Profile" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="account-circle"
                    size={28}
                  />
                  <Text>Profile </Text>
                </Pressable> */}

                {/* Custom Change Password 
                <Pressable
                  onPress={() => {
                    setActiveScreenName("Change Password");
                    props.navigation.navigate("Change Password");
                    setIsCompaniesSubMenuOpen(false);
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Change Password" &&
                      styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="settings"
                    size={28}
                  />
                  <Text>Change Password</Text>
                </Pressable>
                */}
              </ScrollView>
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

      {/* All Company Screens 
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <MaterialIcons name="admin-panel-settings" size={28} />
          ),
          // headerTitle: () => <></>,
          headerShown: false,
          // drawerItemStyle: { display: "none" },
        }}
        name="Manage Companies"
        component={CompanyStackScreen}
      />
    */}

      {/*All Accounts/Users Screens 
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="users" size={28} />,
          title: "Accounts",
          headerShown: false,
          // drawerItemStyle: { display: "none" },
        }}
        name="Accounts"
        component={AccountsStackScreen}
      />
        */}

      {/* Consultant Manager Screens 
      <Drawer.Screen
        name="Consultant Managers"
        component={ConsultantManagerStack}
        options={({ navigation }) => ({
          title: "Consultant Managers",
          headerShown: false,
        })}
      />
        */}

      {/* Consultants Screens 
      <Drawer.Screen
        name="Consultants"
        component={ConsultantStack}
        options={({ navigation }) => ({
          title: "Consultants",
          headerShown: false,
        })}
      />
        */}

      {/* Contractors Screens 
      <Drawer.Screen
        name="Contractors"
        component={ContractorStack}
        options={({ navigation }) => ({
          title: "Contractors",
          headerShown: false,
        })}
      />
        */}

      {/* Customers Screens 
      <Drawer.Screen
        name="Customers"
        component={CustomerStack}
        options={({ navigation }) => ({
          title: "Customers",
          headerShown: false,
        })}
      />
        */}

      {/* Project Screens 
      <Drawer.Screen
        name="Projects"
        component={ViewProjects}
        options={({ navigation }) => ({
          title: "My Projects",
          headerShown: false,
        })}
      />
      */}

      {/* <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="user" size={28} />,
          title: isEditOn ? "Edit Profile Details" : "Profile",
        }}
        name="Profile"
        component={() => (
          <Profile isEditOn={isEditOn} setIsEditOn={setIsEditOn} />
        )}
      /> */}
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
