import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiChangePasswordFromDashboard } from "../../../apis/auth";
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";

const passwords = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = ({ navigation }) => {
  const [formData, setFormData] = useState(passwords);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const passRef = useRef(false);

  useEffect(() => {
    passRef.current = false;
    console.log(passRef.current);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      setOldPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);

      return () => (isActive = false);
    }, [])
  );

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
        if (formData.confirmPassword == value) setConfirmPasswordError(null);

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
      setOldPasswordError("Current password is required*");
      return false;
    }
    return true;
  };

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setNewPasswordError("New password is required*");
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
    if (value == "" || value == null) {
      setConfirmPasswordError("Confirm password is required*");
      return false;
    } else if (value == formData.newPassword) {
      setConfirmPasswordError(null);
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
      validateOldPassword(formData.oldPassword) &&
      formData.newPassword === formData.confirmPassword
    ) {
      try {
        setIsLoading(true);
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
          setIsLoading(false);
          navigation.navigate("Home");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        var msg = error?.response?.data?.errors[0]
          ? error?.response?.data?.errors[0]
          : "Failed to update password";
        Toast.show(`${msg}`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error.response.data);
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
        display: "flex",
        padding: 22,
        width: "100%",
        // alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/**********  INPUT PASSWORDS VIEW *********/}
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          display: "flex",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 22,
          // alignItems: "center",
          backgroundColor: "#fff",
          // height: "92%",
          borderRadius: 16,
          height: "100%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text style={styles.labelField}>Enter Current Password: </Text>
          <View
            style={[
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              styles.input,
            ]}
          >
            <TextInput
              style={{ width: "90%" }}
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

          <Text style={styles.labelField}>Enter New Password: </Text>
          <View
            style={[
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              styles.input,
            ]}
          >
            <TextInput
              style={{ width: "90%" }}
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

          <Text style={styles.labelField}>Confirm New Password: </Text>
          <View
            style={[
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              styles.input,
            ]}
          >
            <TextInput
              style={{ width: "90%" }}
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

        {/* <View style={{ width: "100%"}}>
          <Button
            style={{ marginBottom: 10 }}
            onPress={handleSubmit}
            title="Submit"
            color="#055C9D"
          />
        </View> */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            marginVertical: 10,
            width: "100%",
            backgroundColor: "#055C9D",
            padding: 14,
            borderRadius: 8,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}
          >
            Submit
          </Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="large" />}
      </ScrollView>

      {/* <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ChangePassword;

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
    width: "100%",
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

  labelField: {
    margin: 2,
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: -4,
    marginBottom: 10,
  },
});
