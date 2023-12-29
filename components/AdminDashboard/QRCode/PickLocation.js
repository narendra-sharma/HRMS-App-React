import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PROVIDER_GOOGLE } from "react-native-maps";
const PickLocation = ({ navigation, route }) => {
  // const [mapRegion, setMapRegion] = useState({
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0,
  //   longitudeDelta: 0.0,
  // });
  const [pin, setPin] = useState({
    latitude: route.params.lat,
    longitude: route.params.long,
    latitudeDelta: Platform.OS === "ios" ? 0.3 : 0,
    longitudeDelta: Platform.OS === "ios" ? 0.3 : 0,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      // let location = await Location.getCurrentPositionAsync({
      //   enableHighAccuracy: true,
      // });
      // setPin({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   latitudeDelta: 0.0,
      //   longitudeDelta: 0.0,
      // });
      // console.log(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const handleLocationChange = async (e) => {
    setPin(e.nativeEvent.coordinate);
    console.log(e.nativeEvent.coordinate);
    await AsyncStorage.setItem(
      "coords",
      JSON.stringify(e.nativeEvent.coordinate)
    );
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={pin}
      onPress={(e) => handleLocationChange(e)}
      provider={PROVIDER_GOOGLE}
    >
      <Marker
        draggable
        coordinate={pin}
        title={"Project Location"}
        description={"description"}
        onDragEnd={(e) => handleLocationChange(e)}
      />
      <Text
        style={{
          // backgroundColor: "rgba(0,0,0, 0.1)",
          position: "absolute",
          fontSize: 18,
          left: 20,
          bottom: 20,
        }}
      >
        Long press the marker to drag
      </Text>
    </MapView>
  );
};

export default PickLocation;

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // width: "90%",
    // height: "98%",
    justifyContent: "flex-end",
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
