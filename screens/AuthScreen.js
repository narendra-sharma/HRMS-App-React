import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { apiAuth } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-root-toast";

const initialValues = {
  email: "",
  password: "",
};

const AuthScreen = ({ navigation }) => {
  //state for password and email
  const [formData, setFormData] = useState(initialValues);
  //state for email error
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const checkUserExists = async () => {
  //     const profile = await AsyncStorage.getItem("profile");
  //     await AsyncStorage.removeItem("coords");
  //     const parsedProfile = JSON.parse(profile);
  //     // console.log("parsed profile: ", parsedProfile.user_role);

  //     // handleUserType(parsedProfile.user_type);

  //     if (parsedProfile.user_role) {
  //       setUserType(parsedProfile.user_role); // Set the user type in the state
  //       handleUserType(Number(parsedProfile.user_role));
  //     }
  //     // handleUserType(2);
  //   };

  //   checkUserExists();
  // }, []);

  useEffect(() => {
    const setLocalStorage = async () => {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("profile", profile);
    };

    if (token || profile) setLocalStorage();
  }, [token, profile]);

  //handle change in input text
  const handleChange = (value, label) => {
    if (label == "email") setFormData({ ...formData, [label]: value.trim() });
    else setFormData({ ...formData, [label]: value });

    // switch (label) {
    //   case "email":
    //   return validateEmail(value);
    //   case "password":
    //     return validatePassword(value);
    //   default:
    //     return;
    // }
  };

  //handle email validation
  const validateEmail = (email) => {
    if (email == "" || email == null) {
      setEmailError("Email is required");
      return false;
    }

    // setEmailError(null);
    // return true;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(email) === false) {
      setEmailError("Please Enter a valid email address");
      return false; //return false if in wrong format
    } else {
      setEmailError(null);
      return true; //return true if in right format
    }
  };

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setPasswordError("Password is required");
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  //handle user type dashboard screen
  const handleUserType = (userCode) => {
    // console.log("usercode: ", userCode);
    switch (userCode) {
      case 1:
        //userCode: 1 => superadmin
        navigation.navigate("Admin Dashboard");
        Toast.show("Logged in successfully", {
          duration: Toast.durations.LONG,
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
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;

      case 3:
        //userCode: 3 => staff
        navigation.navigate("Staff Dashboard");
        Toast.show("Logged in successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;

      default:
        console.log("a differnt user");
        return;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    if (formData.password.length > 0 && validateEmail(formData.email)) {
      //call the api function
      try {
        setIsLoading(true);
        const res = await apiAuth(formData);
        console.log(res.data);
        // console.log(res.data.authorization.token);
        setToken(JSON.stringify(res.data.authorization.token));
        setProfile(JSON.stringify(res.data.user));
        // if (res.data.first_login == 0) {
        //   navigation.navigate("First Login");
        // } else
        if (res.status == 200) {
          await AsyncStorage.setItem(
            "token",
            JSON.stringify(res.data.authorization.token)
          );
          await AsyncStorage.setItem("profile", JSON.stringify(res.data.user));
          handleUserType(Number(res.data.user.user_role));
          // handleUserType(2);
          // handleUserType(
          //   res.data.users.user_type,
          //   res.data.token,
          //   res.data.users
          // );
          // navigation.navigate("Dashboard");
        }
        setIsLoading(false);
        // await AsyncStorage.setItem("firstLogin", res.data.first_login);
      } catch (error) {
        setIsLoading(false);
        Toast.show("Invalid Credentials", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }

      // window.localStorage.setItem("token", JSON.stringify(res.data.token));
      // const token = window.localStorage.getItem("token");
      // console.log(token);

      // console.log(jwtDecode(res.data.token));
    } else {
      validateEmail(formData.email);
      // setEmailError("Please enter a valid email address");
      console.log(emailError);
    }
    if (formData.password.length == 0) {
      setPasswordError("Password is required");
      console.log("password is missing");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#055C9D",
      }}
    >
      <Text style={styles.heading}>Login</Text>

      {/**********  INPUTS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        <TextInput
          style={styles.input}
          name="email"
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => {
            handleChange(text, "email");
            setEmailError(null);
          }}
          type="email"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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
            name="password"
            style={{ width: "90%" }}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => {
              handleChange(text, "password");
              setPasswordError(null);
            }}
            secureTextEntry={isPasswordVisible ? false : true}
          />
          {formData.password.length > 0 ? (
            <Icon
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={handleSubmit}
        // onPress={() => navigation.navigate("Dashboard")}
        style={styles.submitButton}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.submitText}> Login </Text>
        )}
      </Pressable>
      <Pressable
        style={styles.opacity}
        // onPress={() => navigation.navigate("OTP")}
        onPress={() => navigation.navigate("Forgot Password")}
      >
        <Text style={{ color: "#fff" }}>Forgot Password? Click here</Text>
      </Pressable>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  input: {
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
    color: "#fff",
    fontWeight: "600",
  },

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
});
