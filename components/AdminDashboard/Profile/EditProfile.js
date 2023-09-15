import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
import { apiGetProfileDetails, apiUpdateProfile } from "../../../apis/auth";
import { Country, State, City } from "country-state-city";
import { Dropdown } from "react-native-element-dropdown";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const initialUserData = {
  // name: "",
  // email: "",
  // organization: "",
  // phonenumber: "",
  // address: "",
  // country: "",
  // state: "",
  // zipcode: "",
  // latitude: "",
  // longitude: "",
};

const EditProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(initialUserData);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await apiGetProfileDetails();
        // console.log("we got from api: ", res.data);
        setUserData(res.data);
        // await AsyncStorage.setItem("profile", JSON.stringify(res.data));
        // const user = await AsyncStorage.getItem("profile");
        // const parsedUser = JSON.parse(user);
        // setUserData({
        //   ...parsedUser,
        // });
        // console.log(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getProfileData();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await apiUpdateProfile({
        ...userData,
      });
      // console.log(userData);
      console.log(res.data);
      if (res.status == 200) {
        Toast.show("Profile updated successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        const resp = await apiGetProfileDetails();
        console.log("we got from api: ", res.data);
        setUserData(resp.data.users);
        // await AsyncStorage.setItem("profile", JSON.stringify(resp.data.users));

        navigation.navigate("My Profile");
      }
      //   console.log(res.data);
    } catch (error) {
      Toast.show("Cannot update profile", {
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

  // const handleUploadPhoto = async () => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: "photo",
  //     includeBase64: false,
  //   };
  //   const result = await launchImageLibrary(options);
  // };

  // const allCountries = Country.getAllCountries().map((country) => {
  //   return {
  //     label: country.name,
  //     value: country.isoCode,
  //   };
  // });

  // console.log(allCountries);

  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: "blue" }]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={styles.centeredView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData?.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Name"
          />
          <Text>Username:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData?.username}
            onChangeText={(text) =>
              setUserData({ ...userData, username: text })
            }
            placeholder="Username"
          />
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            value={userData?.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
          />

          {/* <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={userData.phone_number}
            onChangeText={(text) =>
              setUserData({ ...userData, phone_number: text })
            }
          />
          <Text>Address:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: userData.address,
              onChangeText: (text) => {
                setUserData({ ...userData, address: text });
              },
            }}
            onPress={(data, details = null) => {
              // console.log("details: ", details);
              console.log(
                "details.address_components: ",
                details.address_components
              );

              // const countryIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "country"
              // );

              // const stateIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "administrative_area_level_1"
              // );

              // const zipIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "postal_code"
              // );

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

              setUserData({
                ...userData,
                lat: details.geometry.location.lat,
                long: details.geometry.location.lng,
                address: details.formatted_address,
                state: stateName,
                zip_code: areaZip,
                country_code: countryCode,
                country: countryName,
              });

              //   console.log(userData);
            }}
            query={{
              key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={placesStyle}
          />
          <Text>Country: </Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={Country.getAllCountries().map((country) => {
              return {
                label: country.name,
                value: country.isoCode,
              };
            })}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Country"
            searchPlaceholder="Search..."
            value={userData.country_code}
            onChange={(item) => {
              setUserData({
                ...userData,
                country_code: item.value,
                country: item.label,
                state: null,
              });
            }}
          /> */}
          {/* <TextInput
              style={styles.input}
              name="country"
              value={userData.country}
              onChangeText={(text) =>
                setUserData({ ...userData, country: text })
              }
            /> */}
          {/* <Text>State/UT: </Text>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={State.getStatesOfCountry(userData.country_code).map(
              (state) => {
                return { label: state.name, value: state.name };
              }
            )}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select State/UT"
            searchPlaceholder="Search..."
            value={userData.state}
            onChange={(item) => {
              setUserData({ ...userData, state: item.label });
            }}
          /> */}
          {/* <TextInput
              style={styles.input}
              name="state"
              value={userData.state}
              onChangeText={(text) => setUserData({ ...userData, state: text })}
            /> */}

          {/* <Text>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zip_code"
            value={userData.zip_code}
            onChangeText={(text) =>
              setUserData({ ...userData, zip_code: text })
            }
          /> */}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    // backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: "100%",
    borderColor: "gray",
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
  centeredView: {
    display: "flex",
    padding: 22,
    width: "100%",
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
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
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
    marginTop: 10,
    backgroundColor: "#055C9D",
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

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
