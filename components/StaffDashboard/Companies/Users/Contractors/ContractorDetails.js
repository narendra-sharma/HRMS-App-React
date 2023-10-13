import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";
import { apiDeleteUser, apiGetUserDetails } from "../../../../../apis/users";

const ContractorDetails = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getUserDetails = async () => {
        const res = await apiGetUserDetails(route.params.id);
        setUserData({ ...userData, ...res.data.users });
        console.log("user by id: ", res.data.users);
      };

      getUserDetails();
      return () => (isActive = false);
    }, [])
  );

  //function to delete the user
  const handleDelete = async (user, userId) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteUser(userId);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          //   setDeteleFlag((prev) => !prev);
          Toast.show("User Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(`Delete ${user}`, `Are you sure you want to delete ${user}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteUser() },
    ]);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Name: </Text>
        <Text> {userData.name} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Username: </Text>
        <Text> {userData.username} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Email: </Text>
        <Text> {userData.email} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Phone Number: </Text>
        <Text> {userData.phone_number} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Organisation: </Text>
        <Text> {userData.org} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Address </Text>
        <Text> {userData.address} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Country: </Text>
        <Text> {userData.country} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>State / UT: </Text>
        <Text> {userData.state} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Zip Code: </Text>
        <Text> {userData.zip_code} </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text
            style={styles.textStyle}
            onPress={() =>
              navigation.navigate("Edit Consultant Manager", {
                id: userData.id,
              })
            }
          >
            Edit
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            handleDelete(userData.name, userData.id);
          }}
        >
          <Text style={styles.textStyle}>Delete User</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ContractorDetails;

const styles = StyleSheet.create({
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
  },

  button: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#055C9D",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  addButton: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
