import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import RolesDropdown from "./RolesDropdown";

const DropdownMenu = ({ navigation }) => {
  const [value, setValue] = useState(null);

  const data = [
    { label: "Sales Manager", value: "Sales Manager" },
    { label: "Consultant", value: "Consultant" },
    { label: "Consultant Manager", value: "Consultant Manager" },
    { label: "Interior Designer", value: "Interior Designer" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Project Owner", value: "Project Owner" },
    { label: "Suppliers Staff Panel", value: "Suppliers Staff Panel" },
    { label: "Contractor", value: "Contractor" },
    { label: "Customer", value: "Customer" },
  ];
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      containerStyle={styles.listStyle}
      dropdownPosition="bottom"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
    />
  );
};

const initialUserData = {
  name: "",
  email: "",
  phoneNo: "",
  projectLocation: "",
};

const EditUser = ({ navigation }) => {
  const [userData, setUserData] = useState({});

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData.data}
            onChangeText={(text) => setUserData({ ...userData, data: text })}
            placeholder="Name"
          />
          <Text>Role:</Text>
          <RolesDropdown />

          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            placeholder="Email"
          />
          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={userData.phoneNo}
            onChangeText={(text) => setUserData({ ...userData, phoneNo: text })}
            placeholder="Phone Number"
          />
          <Text>Username:</Text>
          <TextInput
            style={styles.input}
            name="username"
            value={userData.username}
            onChangeText={(text) =>
              setUserData({ ...userData, username: text })
            }
            placeholder="Username"
          />
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            name="password"
            value={userData.password}
            onChangeText={(text) =>
              setUserData({ ...userData, password: text })
            }
            placeholder="Password"
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditUser;

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
