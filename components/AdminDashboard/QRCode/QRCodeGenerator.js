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
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

const QRCodeGenerator = () => {
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [qrData, setQrData] = useState({
    date: "",
    type: "",
    project: "",
  });
  const [qrDate, setQrDate] = useState();
  const [isQrDatePickerVisible, setQrDateVisibility] = useState(false);

  useEffect(() => {
    (async () => {
      const { Permissions } = Expo;
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
      } else {
        /// Handle permissions denied;
        console.log("Uh oh! The user has not granted us permission.");
      }
    })();
  }, []);

  // console.log(qrData);

  //date functions
  const hideqrDatePicker = () => {
    setQrDateVisibility(false);
  };

  const handleQrDateConfirm = (date) => {
    setQrDate(date);
    hideqrDatePicker();
  };

  let svg = useRef(null);

  const getDataURL = () => {
    svg?.toDataURL(callback);
  };

  function callback(dataURL) {
    console.log(dataURL);
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
      }}
    >
      <Text>QR Code</Text>

      <DateTimePickerModal
        isVisible={isQrDatePickerVisible}
        mode="date"
        onConfirm={handleQrDateConfirm}
        onCancel={hideqrDatePicker}
      />
      <Text>Select Date:</Text>
      <Pressable
        onPress={() => {
          setQrDateVisibility(true);
          setQrData({
            ...qrData,
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
        value={qrData.date}
      >
        <Icon name="calendar-alt" size={25} color="#A9A9AC" />
        {qrDate ? (
          <Text style={{ color: "#000", marginLeft: 10 }}>
            {moment(qrDate).format("MM/DD/YYYY")}
          </Text>
        ) : (
          <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>Select Date</Text>
        )}
      </Pressable>

      <Dropdown
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
        value={qrData.type}
        onChange={(item) => {
          setQrData({ ...qrData, type: item.value });
        }}
      />

      <Dropdown
        placeholder="Select Project"
        // placeholderStyle={styles.placeholderStyle}
        // selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: "Project 1", value: "Project 1" },
          { label: "Project 2", value: "Project 2" },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        // containerStyle={styles.listStyle}
        dropdownPosition="bottom"
        value={qrData.project}
        onChange={(item) => {
          setQrData({ ...qrData, project: item.value });
        }}
      />

      <Button
        style={{ width: "30%" }}
        onPress={() => setIsCodeGenerated(true)}
        title="Generate QR Code"
      />

      <View style={{ padding: 10 }}>
        {isCodeGenerated && (
          <>
            <QRCode
              value={[
                { data: `Type: ${qrData.type}`, mode: "alphnumeric" },
                { data: `Date: ${qrData.date}`, mode: "alphnumeric" },
                { data: `Project: ${qrData.project}`, mode: "alphnumeric" },
              ]}
              // value={JSON.stringify(qrData)}
              getRef={(c) => (svg = c)}
            />
            {/* {console.log("data", getDataURL())} */}
            <Button
              onPress={getDataURL}
              title="Save to camera roll"
              color="#1FAAE2"
            />
          </>
        )}
      </View>
    </View>
  );
};

export default QRCodeGenerator;

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
