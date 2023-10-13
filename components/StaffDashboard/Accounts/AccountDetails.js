import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

const AccountDetails = ({ navigation, route }) => {
  const [userData, setUserData] = useState({ ...route.params });

  //  useFocusEffect(
  //    React.useCallback(() => {
  //      let isActive = true;

  //      const fetchUser = async () => {
  //        try {
  //          const res = await apiGetProfileDetails();
  //          // console.log("we got from api: ", res.data);
  //          setUserData(res.data.users);
  //          // await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
  //          // const user = await AsyncStorage.getItem("profile");
  //          // // console.log("local storage: ", user);
  //          // const parsedUser = JSON.parse(user);
  //          // setUserData({
  //          //   ...parsedUser,
  //          // });
  //        } catch (err) {
  //          console.log(err);
  //        }
  //      };

  //      fetchUser();

  //      return () => {
  //        isActive = false;
  //      };
  //    }, [])
  //  );

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
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <>
        <View style={{ width: "80%", maxWidth: "85%" }}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Name: </Text>
            <Text>{userData.name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Email: </Text>
            <Text> {userData.email} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Username: </Text>
            <Text> {userData.username} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Organization: </Text>
            <Text> {userData.org} </Text>
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
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Edit Account")}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>Edit</Text>
        </Pressable>
      </>
    </View>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "90%",
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
    fontSize: 14,
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
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
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
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
