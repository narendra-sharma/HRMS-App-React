import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Location from "expo-location";
import { apiGetCheckinStatus, apiScannedQrData } from "../../../apis/qr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";

const QRScanner = () => {
  const [formData, setFormData] = useState({
    user_id: null,
    user_long: null,
    user_lat: null,
    qr_key: "",
    purpose: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cameraHasPermission, setCameraHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(null);

  console.log("formData, ", formData);

  //permissions for camera and location
  useEffect(() => {
    //permission for camera
    const task = InteractionManager.runAfterInteractions(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraHasPermission(status === "granted");
      })();

      //permission for location
      (async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const user = await AsyncStorage.getItem("profile");
        setLocation({ ...location });

        //function to check if user is clocking in or clocking out
        const checkinRes = await apiGetCheckinStatus({
          user_id: JSON.parse(user).id,
        });
        console.log(checkinRes.data);
        setIsCheckIn(checkinRes.data.checkin);

        setFormData((prev) => ({
          ...prev,
          user_lat: location.coords.latitude,
          user_long: location.coords.longitude,
          user_id: JSON.parse(user).id,
          purpose: checkinRes.data.checkin ? 2 : 1,
        }));
        setIsLoading(false);
      })();
      // setIsLoading(false);
    });
    // setIsLoading(false);

    return () => task.cancel();
  }, []);

  //temporary useEffect
  useEffect(() => {
    //permission for location
    setIsLoading(true);
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      const user = await AsyncStorage.getItem("profile");
      setLocation({ ...location });

      //function to check if user is clocking in or clocking out
      const checkinRes = await apiGetCheckinStatus({
        user_id: JSON.parse(user).id,
      });
      console.log(checkinRes.data);
      setIsCheckIn(checkinRes.data.checkin);

      setFormData((prev) => ({
        ...prev,
        user_lat: location.coords.latitude,
        user_long: location.coords.longitude,
        user_id: JSON.parse(user).id,
        purpose: checkinRes.data.checkin ? 2 : 1,
      }));
      setIsLoading(false);
    })();
    setIsLoading(false);
  }, [isCameraVisible]);

  //get checkin status
  // useEffect(() => {
  //   (async () => {
  //     const user = await AsyncStorage.getItem("profile");
  //     //function to check if user is clocking in or clocking out
  //     const checkinRes = await apiGetCheckinStatus({
  //       user_id: JSON.parse(user).id,
  //     });
  //     console.log(checkinRes.data);
  //     setIsCheckIn(checkinRes.data.checkin);
  //     setFormData((prev) => {
  //       return { ...prev, purpose: checkinRes.data.checkin ? 2 : 1 };
  //     });
  //   })();
  // }, [scanned]);

  // get location coordinates
  // useFocusEffect(
  //   useCallback(() => {
  //     const task = InteractionManager.runAfterInteractions(() => {
  //       (async () => {
  //         // setIsCameraVisible(false);
  //         // let { status } = await Location.requestForegroundPermissionsAsync();
  //         // if (status !== "granted") {
  //         //   setErrorMsg("Permission to access location was denied");
  //         //   return;
  //         // }
  //         setIsLoading(true);
  //         let location = await Location.getCurrentPositionAsync({});
  //         const user = await AsyncStorage.getItem("profile");
  //         setLocation({ ...location });

  //         //function to check if user is clocking in or clocking out
  //         const checkinRes = await apiGetCheckinStatus({
  //           user_id: JSON.parse(user).id,
  //         });
  //         console.log(checkinRes.data);
  //         setIsCheckIn(checkinRes.data.checkin);

  //         setFormData((prev) => ({
  //           ...prev,
  //           user_lat: location.coords.latitude,
  //           user_long: location.coords.longitude,
  //           user_id: JSON.parse(user).id,
  //           purpose: checkinRes.data.checkin ? 2 : 1,
  //         }));
  //         setIsLoading(false);
  //       })();
  //     });

  //     return () => task.cancel();
  //   }, [])
  // );

  //get location permission and other data
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     const user = await AsyncStorage.getItem("profile");
  //     setLocation({ ...location });
  //     setFormData({
  //       ...formData,
  //       user_lat: location.coords.latitude,
  //       user_long: location.coords.longitude,
  //       user_id: JSON.parse(user).id,
  //     });

  //     //function to check if user is clocking in or clocking out
  //     const clockType = await AsyncStorage.getItem("purpose");
  //     console.log("clockType, ", clockType);
  //     if (Number(clockType) == 1) {
  //       //means user is checked in & should scan checkout qr
  //       setIsCheckIn(false);
  //     } else {
  //       setIsCheckIn(true);
  //     }
  //   })();
  // }, []);

  //qr code functions and make the API call
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log("data, ", JSON.parse(data).qr_key);

    if (formData.user_long && formData.user_lat) {
      try {
        const res = await apiScannedQrData({
          ...formData,
          qr_key: JSON.parse(data).qr_key,
          // purpose: JSON.parse(data).purpose,
        });
        console.log("scanned response: ", res.data);
        if (res.data.status == true) {
          // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
          alert(`${res.data.message}`);
          // setIsCheckIn((prev) => !prev);
        } else {
          alert(`${res.data.message}`);
        }
        console.log(res.data);
      } catch (error) {
        console.log(error);
        Toast.show("Server Error", {
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
      alert("Unable to get location coordinates, please scan again");
    }

    setIsCameraVisible(false);

    setScanned(false);
  };

  // useEffect(() => {
  //   const getLocation = async () => {
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation({ ...location });
  //   };
  //   getLocation();
  // }, [scanned]);

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
        {/* <Text style={styles.paragraph}>{text}</Text> */}
      </View>
    );
  };

  if (cameraHasPermission === null) {
    return <View />;
  }

  if (cameraHasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        {!isCheckIn ? (
          <Text style={styles.paragraph}>Scan the QR Code to Check In.</Text>
        ) : (
          <Text style={styles.paragraph}>Scan the QR Code to Check Out.</Text>
        )}

        {isCameraVisible && renderCamera()}

        <TouchableOpacity
          onPress={() => {
            setIsCameraVisible((prev) => !prev);
            setScanned(false);
          }}
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
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.submitText}>
                {isCameraVisible ? "Close Scanner" : "Launch Scanner"}{" "}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
        {/* <View>
          <Button
            title={isCameraVisible ? "Close Scanner" : "Launch Scanner"}
            color="#055C9D"
            onPress={() => {
              setIsCameraVisible((prev) => !prev);
              setScanned(false);
            }}
          />
        </View> */}

        {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
          setLocation(null);
        }}
        disabled={scanned}
      >
        <Text style={styles.buttonText}>Scan QR to Start your job</Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(location)}</Text> */}
      </ScrollView>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 22,
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
  },
  cameraContainer: {
    width: "100%",
    // aspectRatio: 1,
    overflow: "hidden",
    // borderRadius: 10,
    marginBottom: 40,
    height: 400,
    // width: 500,
    // backgroundColor: "pink",
    // margin: "0 auto",
  },
  camera: {
    width: "100%",
    aspectRatio: 1 / 2,
    // borderRadius: 10,
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
