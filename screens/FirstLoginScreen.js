import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiChangePasswordFromDashboard } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
// import { apiChangePasswordFromDashboard } from "../../../apis/auth";

const passwords = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const FirstLoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState(passwords);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [userType, setUserType] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const passRef = useRef(false);

  useEffect(() => {
    const checkUserExists = async () => {
      const profile = await AsyncStorage.getItem("profile");
      const parsedProfile = JSON.parse(profile);

      console.log(parsedProfile.user_type);

      if (parsedProfile.user_type) {
        setUserType(parsedProfile.user_type); // Set the user type in the state
      }

      if (res.data.first_login == 1) {
        handleUserType(parsedProfile.user_type);
      }
    };

    checkUserExists();
  }, []);

  useEffect(() => {
    setOldPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);
  }, [navigation]);

  // useEffect(() => {});

  //handle change in input text
  const handleChange = (value, label) => {
    setFormData({ ...formData, [label]: value });

    switch (label) {
      case "oldPassword":
        if (validateOldPassword(value)) {
          setOldPasswordError(null);
          return true;
        } else {
          return false;
        }
      case "newPassword":
        if (validatePassword(value)) {
          setNewPasswordError(null);
          return true;
        } else {
          return false;
        }
      case "confirmPassword":
        if (validateConfirmPassword(value)) {
          setConfirmPasswordError(null);
          return true;
        } else {
          return false;
        }
    }
  };

  //check if the passwords are matching
  const validateOldPassword = (value) => {
    if (value == "") {
      setOldPasswordError("Current password is required");
      return false;
    }
    return true;
  };

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setNewPasswordError("New password is required");
      return false;
    }

    let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

    if (reg.test(password) === false) {
      setNewPasswordError(
        "Password must contain min. 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return false; //return false if in wrong format
    } else {
      return true; //return true if in right format
    }
  };

  //check if the passwords are matching
  const validateConfirmPassword = (value) => {
    if (value == "") {
      setConfirmPasswordError("Confirm password is required");
      return false;
    }
    if (value == formData.newPassword) {
      return true;
    } else {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
  };

  //handle user type dashboard screen
  const handleUserType = (userCode) => {
    console.log(userCode);
    switch (userCode) {
      case 1:
        //userCode: 1 => admin
        navigation.navigate("Admin Dashboard");
        Toast.show("Logged in successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;
      case 2:
        //userCode: 2 => admin
        navigation.navigate("Admin Dashboard");
        Toast.show("Logged in successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;
      case 3:
        //userCode: 3 => Consultant Manager / Sales Manager
        navigation.navigate("Sales Manager Dashboard");
        return;
      case 4:
        //userCode: 4 => Consultant / Interior Designer
        navigation.navigate("Interior Designer Dashboard");
        // setToken(JSON.stringify(res.data.token));
        // setProfile(JSON.stringify(res.data.users));
        return;

      case 18:
        navigation.navigate("Supplier Staff Dashboard");
        return;

      default:
        console.log("a differnt user");
        return;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      validatePassword(formData.newPassword) &&
      validateConfirmPassword(formData.confirmPassword) &&
      validateOldPassword(formData.oldPassword) &&
      formData.newPassword === formData.confirmPassword
    ) {
      try {
        const res = await apiChangePasswordFromDashboard({
          old_password: formData.oldPassword,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
        });
        console.log(res.data);
        if (res.status == 200) {
          Toast.show("Password changed successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          const profile = await AsyncStorage.getItem("profile");
          const parsedProfile = JSON.parse(profile);
          handleUserType(parsedProfile.user_type);
        }
      } catch (error) {
        Toast.show("Password change failed", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }
    } else {
      validateOldPassword(formData.oldPassword);
      validatePassword(formData.newPassword);
      validateConfirmPassword(formData.confirmPassword);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/**********  INPUT PASSWORDS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        <Text>Enter Current Password: </Text>
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            },
            styles.input,
          ]}
        >
          <TextInput
            style={styles.placeholder}
            ref={passRef}
            autoCorrect={false}
            name="oldPassword"
            placeholder="Current Password"
            value={formData.oldPassword}
            onChangeText={(text) => handleChange(text, "oldPassword")}
            secureTextEntry={isOldPasswordVisible ? false : true}
          />
          {formData.oldPassword.length > 0 && passRef ? (
            <Icon
              onPress={() => setIsOldPasswordVisible((prev) => !prev)}
              name={isOldPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {oldPasswordError ? (
          <Text style={styles.errorText}>{oldPasswordError}</Text>
        ) : null}

        <Text>Enter New Password: </Text>
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            },
            styles.input,
          ]}
        >
          <TextInput
            style={styles.placeholder}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChangeText={(text) => handleChange(text, "newPassword")}
            secureTextEntry={isNewPasswordVisible ? false : true}
          />
          {formData.newPassword.length > 0 ? (
            <Icon
              onPress={() => setIsNewPasswordVisible((prev) => !prev)}
              name={isNewPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null}

        <Text>Confirm New Password: </Text>
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            },
            styles.input,
          ]}
        >
          <TextInput
            style={styles.placeholder}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange(text, "confirmPassword")}
            secureTextEntry={isConfirmPasswordVisible ? false : true}
          />
          {formData.confirmPassword.length > 0 ? (
            <Icon
              onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
              name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
      </View>

      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
};

export default FirstLoginScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },

  inputContainer: {
    width: "80%",
    display: "flex",
  },

  input: {
    borderWidth: 1,
    height: 35,
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
  },

  placeholder: {
    width: "90%",
  },

  submitButton: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
