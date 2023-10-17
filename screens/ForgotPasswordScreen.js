import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { apiSendForgotPasswordCode } from "../apis/auth";
import Toast from "react-native-root-toast";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //handle change in input
  const handleChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  //validate email
  const validateEmail = (email) => {
    if (email == "") {
      setEmailError("Email is required");
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!reg.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    try {
      if (validateEmail(email)) {
        setIsLoading(true);
        const res = await apiSendForgotPasswordCode({ email: email });
        console.log(res.data);
        if (res.data.success == true) {
          Toast.show("Code Sent", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setIsLoading(false);
          navigation.navigate("OTP", { email });
          // navigation.navigate("OTP", { email });
        } else {
          setIsLoading(false);
          Toast.show("Email does not exist", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      const msg = error.response.data
        ? error.response.data.errors.email[0]
        : "Something Went Wrong";
      console.log(msg);
      Toast.show(`${msg}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#055C9D"
      }}
    >
      <Text style={styles.heading}>Enter your email address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          name="email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleChange(text)}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <Pressable
        onPress={handleSubmit}
        // onPress={() => setResetTokenExists(true)}
        style={styles.submitButton}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.submitText}> Submit </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8
  },

  inputContainer: {
    width: "80%",
    display: "flex",
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
    borderColor: '#fff',
    borderWidth: 1,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600"
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8
  },
});

export default ForgotPasswordScreen;
