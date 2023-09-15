import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const UserDetail = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData({ ...route.params });
    navigation.setOptions({
      title: `User - ${route.params.name}`,
    });
  }, []);

  const renderUserTypes = () => {
    switch (userData.user_type) {
      case 1:
        return <Text>Super Admin</Text>;
      case 2:
        return <Text>Admin</Text>;
      case 3:
        return <Text>Consultant Manager </Text>;
      case 4:
        return <Text>Consultant </Text>;

      case 5:
        return <Text>Contractor </Text>;
      default:
        return <Text>User </Text>;
    }
  };

  return (
    <View style={styles.centeredView}>
      <View>
        <Text style={styles.item}>{userData.companyName}</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Name: </Text>
          <Text>{userData.name} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Role: </Text>
          {renderUserTypes()}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Organization: </Text>
          <Text>{userData.org} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Email: </Text>
          <Text>{userData.email} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Phone Number: </Text>
          <Text>{userData.phone_number} </Text>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Created By: </Text>
          {renderUserTypes()}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit User")}
        >
          <Text style={styles.textStyle}>Edit User Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete User</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

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

  item: {
    padding: 10,
    fontSize: 16,
  },
});
