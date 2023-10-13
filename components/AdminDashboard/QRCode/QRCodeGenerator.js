import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Dropdown } from "react-native-element-dropdown";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  apiCheckQrCodeExistsByProject,
  apiGenerateQrCodedata,
} from "../../../apis/qr";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { apiGetAllProjects } from "../../../apis/projects";

const initialData = {
  project_id: "",
  lat: "",
  long: "",
  created_by_id: "",
  qr_key: "",
};

const QRCodeGenerator = ({ navigation }) => {
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [projectsList, setProjectsList] = useState([]);
  const [mapRegion, setMapRegion] = useState({});
  const [qrDate, setQrDate] = useState();
  const [isQrDatePickerVisible, setQrDateVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [flag, setFlag] = useState(false);

  const [projectError, setProjectError] = useState(null);
  const [purposeError, setPurposeError] = useState(null);

  const viewShotRef = useRef();

  console.log("form data.......", formData);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      let storagecoords = await AsyncStorage.getItem("coords");

      setMapRegion({
        latitude:
          JSON.parse(storagecoords)?.latitude || location.coords.latitude,
        longitude:
          JSON.parse(storagecoords)?.longitude || location.coords.longitude,
        // latitudeDelta: 0.04,
        // longitudeDelta: 0.05,
      });
      setFormData((prev) => ({
        ...prev,
        lat: JSON.parse(storagecoords)?.latitude || location.coords.latitude,
        long: JSON.parse(storagecoords)?.longitude || location.coords.longitude,
        address: "",
      }));
      // console.log(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== "granted") {
        //   setErrorMsg("Permission to access location was denied.");
        //   return;
        // }

        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        let storagecoords = await AsyncStorage.getItem("coords");

        setMapRegion({
          latitude:
            JSON.parse(storagecoords)?.latitude || location.coords.latitude,
          longitude:
            JSON.parse(storagecoords)?.longitude || location.coords.longitude,
          // latitudeDelta: 0.04,
          // longitudeDelta: 0.05,
        });
        setFormData((prev) => ({
          ...prev,
          lat: JSON.parse(storagecoords)?.latitude || location.coords.latitude,
          long:
            JSON.parse(storagecoords)?.longitude || location.coords.longitude,
          address: "",
          // project_id: route?.params?.project_id,
        }));
        // console.log(location.coords.latitude, location.coords.longitude);
      })();

      const getUserId = async () => {
        const user = await AsyncStorage.getItem("profile");
        // setFormData({ ...formData });
        setFormData({
          ...formData,
          created_by_id: JSON.parse(user).id,
          qr_key: randomString(16, 32),
        });
      };
      getUserId();

      const getAllProjects = async () => {
        const res = await apiGetAllProjects();
        // console.log("projects", res.data.data);
        const tempProjects = res?.data?.data?.map((project) => {
          return {
            label: project.name,
            value: project.id,
          };
        });
        //set projects list
        setProjectsList([...tempProjects]);
      };

      getAllProjects();
      setProjectError(null);
      setPurposeError(null);

      return () => (isActive = false);
    }, [formData.purpose])
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

  // console.log("form data", formData);

  //date functions
  // const hideqrDatePicker = () => {
  //   setQrDateVisibility(false);
  // };

  // const handleQrDateConfirm = (date) => {
  //   setQrDate(date);
  //   hideqrDatePicker();
  // };

  //validation functions
  const requiredValidation = (setError, value, label) => {
    if (value == "" || value == null) {
      setError(`${label} is required*`);
      return false;
    }
    return true;
  };

  let svg = useRef(null);

  //handle qr generation
  handleQrGenerate = async () => {
    // setModalVisible(true);
    // setIsCodeGenerated(true);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(1000);

    if (
      formData.qr_key &&
      formData.project_id &&
      formData.lat &&
      formData.long &&
      formData.created_by_id &&
      // formData.purpose &&
      requiredValidation(setProjectError, formData.project_id, "Project")
      // && requiredValidation(setPurposeError, formData.purpose, "Purpose")
    ) {
      const { existsStatus, existsMessage } = await checkQrExists(
        formData.project_id
      );

      if (existsStatus) {
        setModalVisible(true);
        setIsCodeGenerated(true);
        // Capture the screenshot and get the URI
        const uri = await viewShotRef.current.capture();
        console.log("Screenshot captured:", uri);

        const { status, message } = await handleSubmit(uri);
        if (status) {
        } else {
          alert(message);
          setModalVisible(false);
          setIsCodeGenerated(false);
        }
      } else {
        alert(existsMessage);
      }
    } else {
      requiredValidation(setProjectError, formData.project_id, "Project");
      setModalVisible(false);
      setIsCodeGenerated(false);
      // requiredValidation(setPurposeError, formData.purpose, "Purpose");
    }
  };

  //check if qr code exists for a particular project
  const checkQrExists = async (project_id) => {
    try {
      const res = await apiCheckQrCodeExistsByProject({
        project_id,
      });
      console.log(res.data);
      return {
        existsStatus: res?.data?.status,
        existsMessage: res?.data?.message,
      };
    } catch (error) {
      console.log(error);
    }
  };

  //handle qr code API
  const handleSubmit = async (uri) => {
    const form_data = new FormData();
    form_data.append("project_id", formData.project_id);
    form_data.append("lat", formData.lat);
    form_data.append("long", formData.long);
    form_data.append("created_by_id", formData.created_by_id);
    form_data.append("qr_key", formData.qr_key);
    form_data.append("image", {
      uri: uri,
      type: "image/png",
      name: `${formData.project_id}_qr_${new Date()}`,
    });

    const res = await apiGenerateQrCodedata(form_data);
    console.log(res.data);

    if (res.data.status == true) {
      await AsyncStorage.removeItem("coords");
      // setIsCodeGenerated(false);
    }

    return { status: res?.data?.status, message: res?.data?.message };
  };

  // //handle download
  // const handleDownload = () => {
  //   svg?.toDataURL(callback);
  // };

  function callback(dataURL) {
    console.log(dataURL);
    // saveQRCodeToCameraRoll(dataURL);
  }

  // const saveQRCodeToCameraRoll = async (dataURL) => {
  //   if (isCodeGenerated) {
  //     try {
  //       // Generate a unique filename based on the current timestamp
  //       const filename = `${moment().format("YYYYMMDDhhmmss")}.png`;
  //       const fileUri = FileSystem.cacheDirectory + filename;

  //       // const dataURL = await svg.toDataURL();

  //       if (dataURL) {
  //         // Write the data URL to a local file
  //         await FileSystem.writeAsStringAsync(fileUri, dataURL, {
  //           encoding: FileSystem.EncodingType.Base64,
  //         });

  //         // Request permission to access the media library
  //         const { status } = await MediaLibrary.requestPermissionsAsync();

  //         if (status === "granted") {
  //           // Save the QR code image to the media library
  //           await MediaLibrary.createAssetAsync(fileUri);

  //           Alert.alert(
  //             "QR Code Saved",
  //             "The QR code has been saved to your camera roll."
  //           );
  //         } else {
  //           Alert.alert(
  //             "Permission Denied",
  //             "You need to grant permission to access the camera roll to save the QR code."
  //           );
  //         }
  //       } else {
  //         Alert.alert("QR Code Error", "Failed to generate QR code data.");
  //       }
  //     } catch (error) {
  //       console.error("Error saving QR code:", error);
  //     }
  //   } else {
  //     Alert.alert(
  //       "QR Code Not Generated",
  //       "Please generate the QR code first."
  //     );
  //   }
  // };

  const captureScreenshot = async () => {
    try {
      if (viewShotRef.current) {
        // Capture the screenshot and get the URI
        const uri = await viewShotRef.current.capture();
        console.log("Screenshot captured:", uri);

        // Save the screenshot to the camera roll
        await saveQRCodeToCameraRoll(uri);
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const saveQRCodeToCameraRoll = async (uri) => {
    if (isCodeGenerated) {
      try {
        // Request permission to access the media library
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === "granted") {
          // Save the QR code image to the media library
          await MediaLibrary.createAssetAsync(uri);

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
        contentContainerStyle={styles.scrollviewContainer}
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

        <Text style={styles.fieldName}>Select Project:</Text>
        <DropdownMenu
          data={projectsList}
          placeholder="Select Project"
          value={formData.project_id}
          setValue={setFormData}
          label="project_id"
          originalObj={formData}
          setErrorState={setProjectError}
        />
        {projectError ? (
          <Text style={styles.errorText}>{projectError}</Text>
        ) : null}

        {/* <Text>Select Purpose:</Text>
        <DropdownMenu
          data={[
            { label: "Check In", value: 1 },
            { label: "Check Out", value: 2 },
          ]}
          placeholder="Select QR Code Type"
          value={formData.purpose}
          setValue={setFormData}
          label="purpose"
          originalObj={formData}
          setErrorState={setPurposeError}
        />
        {purposeError ? (
          <Text style={styles.errorText}>{purposeError}</Text>
        ) : null} */}

        <Text style={styles.fieldName}>Address:</Text>
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

            setMapRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
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

        <View
          style={{
            marginBottom: 22,
            borderBottomColor: "gray",
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 0,
          }}
        />

        <Text style={{ textAlign: "center", padding: 10 }}>
          Or Pick on Location Map:
        </Text>

        <View style={{ marginVertical: 12 }}>
          <Button
            title="Open Map"
            onPress={() => {
              navigation.navigate("Pick Location", {
                lat: mapRegion.latitude,
                long: mapRegion.longitude,
              });

              setFormData({ ...formData, address: null });
            }}
            style={{ marginBottom: 10 }}
            color="#055C9D"
          />
        </View>

        <Text style={styles.fieldName}>Longitude:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ececec" }]}
          name="long"
          placeholder="Longitude"
          value={JSON.stringify(mapRegion.latitude)}
          onChangeText={(text) => {
            setFormData({ ...formData, long: text });
          }}
          editable={false}
        />

        <Text style={styles.fieldName}>Latitude:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ececec" }]}
          name="lat"
          placeholder="Latitude"
          value={JSON.stringify(mapRegion.longitude)}
          onChangeText={(text) => {
            setFormData({ ...formData, lat: text });
          }}
          editable={false}
        />
        <Text style={{ textAlign: "center", padding: 10 }}> </Text>

        {/* <Pressable onPress={() => navigation.navigate("Pick Location")}>
        <Text>Open Map</Text>
      </Pressable> */}

        <View style={{ marginVertical: 8 }}>
          <Button
            style={{ width: "30%" }}
            onPress={() => handleQrGenerate()}
            title="Generate QR Code"
            color="#055C9D"
          />
        </View>
      </ScrollView>

      {/* View QR on Screen */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("QR Code has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          {isCodeGenerated && (
            <>
              <ViewShot ref={viewShotRef}>
                <View style={{ padding: 30, backgroundColor: "#fff" }}>
                  <QRCode
                    value={JSON.stringify(formData)}
                    // value={JSON.stringify(formData)}
                    getRef={(c) => (svg = c)}
                    size={280}
                    ecl="M"
                    color="black" // Adjust the QR code color
                    backgroundColor="white" // Adjust the background color
                  />
                </View>
              </ViewShot>
              {/* {console.log("data", getDataURL())} */}
              <View>
                <TouchableOpacity
                  style={styles.opacity}
                  onPress={captureScreenshot}
                  // onPress={handleDownload}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Save to camera roll
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.opacity}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setFormData({
                      ...formData,
                      project_id: null,
                      purpose: null,
                    });
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
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
        setErrorState(null);
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
  mainContainer: {
    height: "100%",
    padding: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // backgroundColor: "pink",
  },

  scrollviewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 22,
    // alignItems: "center",
    backgroundColor: "#fff",
    minHeight: "92%",
    borderRadius: 16,
    width: 320,
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
    marginBottom: 2,
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
    marginBottom: 4,
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
    width: 200,
    marginTop: 20,
    backgroundColor: "#1FAAE2",
    padding: 10,
    borderRadius: 4,
  },

  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: -4,
    marginBottom: 4,
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 8,
  },

  centeredView: {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "pink",
    padding: 20,
    margin: 20,
    marginTop: 50,
    height: "70%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
