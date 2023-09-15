import React, { useState, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Pressable,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

const QRScanner = () => {
  const [cameraHasPermission, setCameraHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setCameraHasPermission(status === "granted");
    })();
  }, []);

  //qr code functions
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  useEffect(() => {
    const getLocation = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation({ ...location });
    };
    getLocation();
  }, [scanned]);

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
      }}
    >
      <Text>Scan QR Code</Text>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {renderCamera()}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
          setLocation(null);
        }}
        disabled={scanned}
      >
        <Text style={styles.buttonText}>Scan QR to Start your job</Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(location)}</Text>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
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
    marginBottom: 40,
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
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
