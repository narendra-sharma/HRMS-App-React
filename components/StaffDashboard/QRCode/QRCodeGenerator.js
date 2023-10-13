import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import MapView from "react-native-maps";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGenerateQrCodedata } from "../../../apis/qr";
import { useFocusEffect } from "@react-navigation/native";

const QRCodeGenerator = ({ navigation }) => {
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    lat: "",
    long: "",
    created_by_id: "",
    qr_key: "",
  });
  const [mapRegion, setMapRegion] = useState({});
  const [qrDate, setQrDate] = useState();
  const [isQrDatePickerVisible, setQrDateVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          // latitudeDelta: 0.04,
          // longitudeDelta: 0.05,
        });
        // console.log(location.coords.latitude, location.coords.longitude);
      })();

      const getUserId = async () => {
        const user = await AsyncStorage.getItem("profile");
        setFormData({ ...formData });
        setFormData({
          ...formData,
          created_by_id: JSON.parse(user).id,
          qr_key: randomString(16, 32),
        });
      };
      getUserId();
    }, [isCodeGenerated])
  );

  var randomString = function (len, bits) {
    bits = bits || 64;
    var outStr = "",
      newStr;
    while (outStr.length < len) {
      newStr = Math.random().toString(bits).slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }
    return outStr.toUpperCase();
  };

  console.log("form data", formData);

  //date functions
  const hideqrDatePicker = () => {
    setQrDateVisibility(false);
  };

  const handleQrDateConfirm = (date) => {
    setQrDate(date);
    hideqrDatePicker();
  };

  let svg = useRef(null);

  //handle qr code submit
  const handleSubmit = async () => {
    svg?.toDataURL(callback);

    try {
      const res = await apiGenerateQrCodedata({
        ...formData,
      });
      console.log(res.data);
      if (res.data.status == true) {
        setFormData({
          project_id: "",
          lat: "",
          long: "",
          created_by_id: "",
          qr_key: "",
        });
        setIsCodeGenerated(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function callback(dataURL) {
    // console.log(dataURL);
    saveQRCodeToCameraRoll(dataURL);
  }

  const saveQRCodeToCameraRoll = async (dataURL) => {
    if (isCodeGenerated) {
      try {
        // Generate a unique filename based on the current timestamp
        const filename = `${moment().format("YYYYMMDDhhmmss")}.jpg`;
        const fileUri = FileSystem.cacheDirectory + filename;

        // const dataURL = await svg.toDataURL();

        if (dataURL) {
          // Write the data URL to a local file
          await FileSystem.writeAsStringAsync(fileUri, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Request permission to access the media library
          const { status } = await MediaLibrary.requestPermissionsAsync();

          if (status === "granted") {
            // Save the QR code image to the media library
            await MediaLibrary.createAssetAsync(fileUri);

            Alert.alert(
              "QR Code Saved",
              "The QR code has been saved to your camera roll."
            );
          } else {
            Alert.alert(
              "Permission Denied",
              "You need to grant permission to access the camera roll to save the QR code."
            );
          }
        } else {
          Alert.alert("QR Code Error", "Failed to generate QR code data.");
        }
      } catch (error) {
        console.error("Error saving QR code:", error);
      }
    } else {
      Alert.alert(
        "QR Code Not Generated",
        "Please generate the QR code first."
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        {/* <Text>QR Code</Text>

      <DropdownMenu
        data={[
          { label: "John the Customer", value: 1 },
          { label: "Johnny the Customer", value: 2 },
          { label: "Jake the Customer", value: 3 },
          { label: "Jason the Customer", value: 4 },
          { label: "Jack the Customer", value: 5 },
        ]}
        placeholder="Select Customer"
        value={formData.customer}
        setValue={setFormData}
        label="customer"
        originalObj={formData}
        // setErrorState={setCustomerError}
      /> */}

        {/* <DateTimePickerModal
          isVisible={isQrDatePickerVisible}
          mode="date"
          onConfirm={handleQrDateConfirm}
          onCancel={hideqrDatePicker}
        />
        <Text>Select Date:</Text>
        <Pressable
          onPress={() => {
            setQrDateVisibility(true);
            setFormData({
              ...formData,
              date: moment(qrDate).format("MM/DD/YYYY"),
            });
            // setQrDateError(null);
          }}
          style={[
            styles.input,
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              color: "#d9d9d9",
            },
          ]}
          name="qrDate"
          value={formData.date}
        >
          <Icon name="calendar-alt" size={25} color="#A9A9AC" />
          {qrDate ? (
            <Text style={{ color: "#000", marginLeft: 10 }}>
              {moment(qrDate).format("MM/DD/YYYY")}
            </Text>
          ) : (
            <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
              Select Date
            </Text>
          )}
        </Pressable> */}

        <Text>Select Project:</Text>
        <DropdownMenu
          data={[
            { label: "Project Alpha", value: 1 },
            { label: "Project Zaam-Dox", value: 2 },
            { label: "Project Hades", value: 3 },
          ]}
          placeholder="Select Project"
          value={formData.project_id}
          setValue={setFormData}
          label="project_id"
          originalObj={formData}
          // setErrorState={setCustomerError}
        />

        <Text>Address:</Text>
        <GooglePlacesAutocomplete
          placeholder="Search"
          autoFocus={true}
          listViewDisplayed="auto"
          returnKeyType={"search"}
          fetchDetails={true}
          textInputProps={{
            value: formData.address,
            onChangeText: (text) => {
              setFormData({ ...formData, address: text });
            },
          }}
          onPress={(data, details = null) => {
            // console.log("details: ", details);
            console.log(
              "details.address_components: ",
              details.address_components
            );

            const countryName =
              details.address_components[
                details.address_components.findIndex(
                  (obj) => obj.types[0] == "country"
                )
              ]?.long_name;

            const countryCode =
              details.address_components[
                details.address_components.findIndex(
                  (obj) => obj.types[0] == "country"
                )
              ]?.short_name;

            const stateName =
              details.address_components[
                details.address_components.findIndex(
                  (obj) => obj.types[0] == "administrative_area_level_1"
                )
              ]?.long_name;

            const areaZip = details.address_components[
              details.address_components.findIndex(
                (obj) => obj.types[0] == "postal_code"
              )
            ]?.long_name
              ? details.address_components[
                  details.address_components.findIndex(
                    (obj) => obj.types[0] == "postal_code"
                  )
                ]?.long_name
              : null;

            console.log(
              details.formatted_address,
              " ",
              stateName,
              " ",
              countryName,
              " ",
              countryCode,
              " ",
              areaZip
            );

            // props.notifyChange(details.geometry.location, data);

            setFormData({
              ...formData,
              lat: details.geometry.location.lat,
              long: details.geometry.location.lng,
              address: details.formatted_address,
              // state: stateName,
              // zip_code: areaZip,
              // country_code: countryCode,
              // country: countryName,
            });
            // console.log("formData: ", console.log(formData));
          }}
          query={{
            key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
          styles={placesStyle}
        />

        <Text style={{ textAlign: "center", padding: 10 }}>
          Or Pick on Location Map:
        </Text>

        <Button
          title="Open Map"
          onPress={() =>
            navigation.navigate("Pick Location", {
              lat: mapRegion.latitude,
              long: mapRegion.longitude,
            })
          }
          style={{ marginBottom: 10 }}
        />

        {/* <Pressable onPress={() => navigation.navigate("Pick Location")}>
        <Text>Open Map</Text>
      </Pressable> */}

        {/* <Dropdown
        placeholder="Select QR Code Type"
        // placeholderStyle={styles.placeholderStyle}
        // selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: "Clock In", value: "Clock In" },
          { label: "Clock Out", value: "Clock Out" },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        // containerStyle={styles.listStyle}
        dropdownPosition="bottom"
        value={formData.type}
        onChange={(item) => {
          setFormData({ ...formData, type: item.value });
        }}
      /> */}

        <Button
          style={{ width: "30%" }}
          onPress={() => setIsCodeGenerated(true)}
          title="Generate QR Code"
        />

        <View style={{ padding: 10 }}>
          {isCodeGenerated && (
            <>
              <QRCode
                value={JSON.stringify(formData)}
                // value={JSON.stringify(formData)}
                getRef={(c) => (svg = c)}
              />
              {/* {console.log("data", getDataURL())} */}
              <Button
                onPress={handleSubmit}
                title="Save to camera roll"
                color="#1FAAE2"
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default QRCodeGenerator;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      containerStyle={styles.listStyle}
      dropdownPosition="bottom"
      value={value}
      onChange={(item) => {
        setValue({ ...originalObj, [label]: item.value });
        // setErrorState(null);
      }}
    />
  );
};

const placesStyle = StyleSheet.create({
  textInputContainer: {
    // backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // maxWidth: "100%",
    // minWidth: "90%",
    borderColor: "gray",
    width: "100%",
  },
  textInput: {
    backgroundColor: "transparent",
    height: 45,
    color: "#5d5d5d",
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    color: "black",
    borderColor: "gray",
    maxWidth: "100%",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "blue",
  },
  description: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 14,
    maxWidth: "89%",
  },
});

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  mainContainer: {
    padding: 22,
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
    marginBottom: 5,
    // padding: 2,
  },

  fieldName: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },

  input: {
    width: "100%",
    height: 35,
    marginTop: 2,
    // marginBottom: 10,
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
    backgroundColor: "#B76E79",
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

  errorText: {
    color: "red",
    fontSize: 10,
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },
});
