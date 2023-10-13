import React, { useRef, useState, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Button,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { apiVerifyOtp } from "../../apis/auth";
import Countdown from "./ResendOtp";
import ResendOtp from "./ResendOtp";
import Toast from "react-native-root-toast";

const OtpInput = ({
  code,
  setCode,
  setIsPinReady,
  maximumLength,
  navigation,
  isPinReady,
  route,
}) => {
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();

  // console.log(route, code);

  useEffect(() => {
    // update pin ready status
    setIsPinReady(code.length === maximumLength);
    // clean up function
    if (isPinReady) Keyboard.dismiss;
    return () => {
      setIsPinReady(false);
    };
  }, [code]);

  const boxArray = new Array(maximumLength).fill(0);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Toast.show("Please Wait", {
      //   duration: Toast.durations.SHORT,
      //   position: Toast.positions.BOTTOM,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      // });
      const res = await apiVerifyOtp({ email: route.params.email, otp: code });
      if (res.data.status == true) {
        Toast.show("OTP Verified", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setIsLoading(false);
        navigation.navigate("Reset Password", {
          email: route.params.email,
          otp: code,
        });
      } else {
        setIsLoading(false);
        Toast.show("OTP validation failed", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      // console.log(res);
    } catch (error) {
      setIsLoading(false);
      Toast.show("OTP validation failed", {
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
    <Pressable style={styles.otpInputContainer} onPress={Keyboard.dismiss}>
      <View style={styles.otpInputContainer}>
        <Text>Enter the 4-digit code:</Text>
        <Pressable
          onPress={handleOnPress}
          style={styles.splitOTPBoxesContainer}
        >
          {boxArray.map((num, index) => {
            const emptyInput = "";
            const digit = code[index] || emptyInput;

            const isCurrentValue = index === code.length;
            const isLastValue = index === maximumLength - 1;
            const isCodeComplete = code.length === maximumLength;

            const isValueFocused =
              isCurrentValue || (isLastValue && isCodeComplete);

            return (
              <View
                style={
                  isInputBoxFocused && isValueFocused
                    ? styles.splitBoxesFocused
                    : styles.splitBoxes
                }
                key={index}
              >
                <Text style={styles.splitBoxText}> {digit} </Text>
              </View>
            );
          })}
        </Pressable>

        <TextInput
          value={code}
          onChangeText={setCode}
          maxLength={maximumLength}
          style={styles.textInputHidden}
          ref={inputRef}
          onBlur={handleOnBlur}
        />

        <TouchableOpacity
          disabled={!isPinReady}
          onPress={handleSubmit}
          // onPress={() => navigation.navigate("Reset Password")}
          style={
            isPinReady
              ? styles.submitButton
              : [styles.submitButton, { backgroundColor: "gray" }]
          }
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.submitText}> Submit </Text>
          )}
        </TouchableOpacity>

        <ResendOtp email={route?.params?.email} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  otpInputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textInputHidden: {
    borderWidth: 1,
    height: 35,
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
    width: 300,
    position: "absolute",
    opacity: 0,
  },

  splitOTPBoxesContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  splitBoxes: {
    marginTop: 10,
    borderColor: "#000",
    borderWidth: 1,
    bordeRadius: "5px",
    padding: "12px",
    width: 35,
    height: 40,
    display: "flex",
    justifyContent: "center",
  },

  splitBoxesFocused: {
    marginTop: 10,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    bordeRadius: "5px",
    padding: "12px",
    width: 35,
    height: 40,
    display: "flex",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#52006A",
  },

  splitBoxText: {
    textAlign: "center",
    color: "#000",
    // color: "magenta",
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
    width: "80%",
  },
});

export default OtpInput;
