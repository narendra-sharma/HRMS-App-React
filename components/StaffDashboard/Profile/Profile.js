import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { apiGetProfileDetails, apiUpdateProfile } from "../../../apis/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useCustomDrawerStatus } from "../../../Contexts/DrawerStatusContext";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});

  const isDrawerOpen = useDrawerStatus();

  const { setDrawerStatus } = useCustomDrawerStatus();
  console.log(isDrawerOpen);
  setDrawerStatus(isDrawerOpen);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const res = await apiGetProfileDetails();
          // console.log("we got from api: ", res.data);
          setUserData(res.data);
          // await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
          // const user = await AsyncStorage.getItem("profile");
          // // console.log("local storage: ", user);
          // const parsedUser = JSON.parse(user);
          // setUserData({
          //   ...parsedUser,
          // });
        } catch (err) {
          console.log(err);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // useEffect(() => {
  //   const getProfileData = async () => {
  //     try {
  //       const res = await apiGetProfileDetails();
  //       console.log("we got from api: ", res.data);
  //       setUserData(res.data.users);
  //       // await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
  //       // const user = await AsyncStorage.getItem("profile");
  //       // // console.log("local storage: ", user);
  //       // const parsedUser = JSON.parse(user);
  //       // setUserData({
  //       //   ...parsedUser,
  //       // });
  //       console.log("local storage: ", userData);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getProfileData();
  // }, []);

  useEffect(() => {}, [userData]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 10,
        // justifyContent: "center",
      }}
    >
      <>
        <View
          style={{
            width: "95%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 16,
            backgroundColor: "#fff",
            height: "100%",
            borderRadius: 16,
            // height: "50%",
          }}
        >
          {/* <View style={{ display: "flex", flexDirection: "row", margin: 10 }}>
              <Icon name="user-circle-o" size={55} />
              <Pressable
                style={{
                  backgroundColor: "#055C9D",
                  padding: 12,
                  padding: 12,
                  borderRadius: 8,
                  marginLeft: 10,
                  width: "70%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
                onPress={handleUploadPhoto}
              >
                <Text style={styles.submitText}>Upload New Photo</Text>
                <Icon name="edit" size={20} style={{ color: "#fff" }} />
              </Pressable>
            </View> */}
            <View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Name</Text>
                  <Text style={styles.feildDetail}>{userData.name}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Email</Text>
                  <Text style={styles.feildDetail}>{userData.email} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Username</Text>
                  <Text style={styles.feildDetail}>{userData.username} </Text>
                </View>
                {/*<View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>ID: </Text>
                  <Text> {userData.employee_id} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Phone Number: </Text>
                  <Text> {userData.phone_number} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Address: </Text>
                  <Text> {userData.address} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>State/UT: </Text>
                  <Text> {userData.state} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Country: </Text>
                  <Text> {userData.country} </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldName}>Zip Code: </Text>
                  <Text> {userData.zip_code} </Text>
                </View> */}
            </View>
            <View style={{ marginVertical: 18, width: "100%" }}>
              <Button
                style={{ marginBottom: 10,}}
                onPress={() => navigation.navigate("Edit Profile")}
                title="Edit"
                color="#055C9D"
              />
            </View>
        </View>
        {/* <Pressable
          onPress={() => navigation.navigate("Edit Profile")}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>Edit</Text>
        </Pressable> */}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 17,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "#055C9D",
    padding: 10,
    borderBottomWidth: 4,
    borderBottomColor: "#b1b1b3",
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8
  
  },

  feildDetail: {
    fontSize: 17,
    color: "white"
  },

  input: {
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    fontSize: 15,
    color: "#f4f4f4"
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});

export default Profile;