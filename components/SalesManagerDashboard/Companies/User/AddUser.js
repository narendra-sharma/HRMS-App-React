import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import RolesDropdown from "./RolesDropdown";

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
};

const AddUser = ({ navigation }) => {
  const [newUserData, setNewUserData] = useState(initialFormData);

  const handleNewUserSubmit = async () => {
    try {
    } catch (error) {}
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
            value={newUserData.companyName}
            onChangeText={(text) =>
              setNewUserData({ ...newUserData, companyName: text })
            }
            placeholder="Name"
          />
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            placeholder="Email"
            value={newUserData.email}
            onChangeText={(text) =>
              setNewUserData({ ...newUserData, email: text })
            }
          />
          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            placeholder="Phone Number"
            value={newUserData.phone_number}
            onChangeText={(text) =>
              setNewUserData({ ...newUserData, phone_number: text })
            }
          />
          <Text>Role:</Text>
          <RolesDropdown />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleNewUserSubmit} style={styles.submitButton}>
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

export default AddUser;

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
