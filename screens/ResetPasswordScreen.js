import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { apiResetPassword } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-root-toast";

const passwords = {
  newPassword: "",
  confirmPassword: "",
};

const ResetPasswordScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState(passwords);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //handle change in input text
  const handleChange = (value, label) => {
    setFormData({ ...formData, [label]: value });

    switch (label) {
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

  useEffect(() => {
    setNewPasswordError(null);
    setConfirmPasswordError(null);
  }, [navigation]);

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

  //handle form submit
  const handleSubmit = async () => {
    if (
      validatePassword(formData.newPassword) &&
      validateConfirmPassword(formData.confirmPassword) &&
      formData.newPassword === formData.confirmPassword
    ) {
      try {
        setIsLoading(true);
        const res = await apiResetPassword({
          email: route.params.email,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
          otp: route.params.otp,
        });
        console.log(res.data);
        if (res.status == 200) {
          // await AsyncStorage.setItem("token", token);
          // await AsyncStorage.setItem("profile", profile);
          Toast.show("Password changed successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setIsLoading(false);
          navigation.navigate("Login");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Toast.show("Something Went Wrong!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }
    }
    if (
      !validatePassword(formData.newPassword) ||
      !validateConfirmPassword(formData.confirmPassword)
    ) {
      console.log("no");
    }
    if (!validateConfirmPassword(formData.confirmPassword)) {
      console.log("no");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#055C9D"
      }}
    >
      <Text style={styles.heading}>Reset Password</Text>
      {/**********  INPUT PASSWORDS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        {/* <TextInput
          style={styles.input}
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChangeText={(text) => handleChange(text, "newPassword")}
          secureTextEntry={true}
        />
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null} */}

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
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.submitText}> Submit </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },

  inputContainer: {
    width: "80%",
    display: "flex",
  },

  input: {
    width: 300,
    height: 46,
    marginBottom: 5,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#fff",
  },

  submitButton: {
    borderStyle: "solid",
    marginTop: 20,
    borderColor: "#fff",
    padding: 12,
    borderRadius: 34,
    width: "80%",
    alignItems: "center",
    color: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
  },

  submitText: {
    color: "white",
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
});

export default ResetPasswordScreen;
