import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
import { Country, State, City } from "country-state-city";
import { Dropdown } from "react-native-element-dropdown";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const initialProjectData = {
  customerName: "",
  consultant: "",
  pointOfContact: "",
  projectLocation: "",
};

const EditProject = ({ navigation }) => {
  const [projectData, setProjectData] = useState(initialProjectData);
  const [isFocus, setIsFocus] = useState(false);

  const handleSubmit = async () => {
    try {
      // const res = await apiUpdateProfile({
      //   ...projectData,
      //   name: projectData.name,
      //   phonenumber: projectData.phone_number,
      //   address: projectData.address,
      //   org: projectData.org,
      //   state: projectData.state,
      //   country: projectData.country,
      //   country_code: projectData.country_code,
      //   latitude: projectData.lat,
      //   longitude: projectData.long,
      //   zipcode: projectData.zip_code,
      // });
      // console.log(projectData);
      //   console.log(res);
      // if (res.status == 200) {
      //   ToastAndroid.show("Profile Updated Successfully", ToastAndroid.SHORT);
      //   const resp = await apiGetProfileDetails();
      //   console.log("we got from api: ", res.data);
      //   setProjectData(resp.data.users);
      //   await AsyncStorage.setItem("profile", JSON.stringify(resp.data.users));
      //   navigation.navigate("My Profile");
      // }
      //   console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Project Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={projectData.projectName}
            onChangeText={(text) =>
              setProjectData({ ...projectData, projectName: text })
            }
            placeholder="Project Name"
          />
          <Text>Consutant:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={projectData.consultant}
            onChangeText={(text) =>
              setProjectData({ ...projectData, consultant: text })
            }
          />
          <Text>Point of Contact:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={projectData.pointOfContact}
            onChangeText={(text) =>
              setProjectData({ ...projectData, pointOfContact: text })
            }
          />
          <Text>Project Location:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: projectData.address,
              onChangeText: (text) => {
                setProjectData({ ...projectData, address: text });
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

              props.notifyChange(details.geometry.location, data);

              setProjectData({
                ...projectData,
                lat: details.geometry.location.lat,
                long: details.geometry.location.lng,
                address: details.formatted_address,
                state: stateName,
                zip_code: areaZip,
                country_code: countryCode,
                country: countryName,
              });
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
            placeholder={!isFocus ? "Select Country" : "..."}
            searchPlaceholder="Search..."
            value={projectData.country_code}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setProjectData({
                ...projectData,
                country_code: item.value,
                country: item.label,
                state: null,
              });
              setIsFocus(false);
            }}
          />
          {/* <TextInput
              style={styles.input}
              name="country"
              value={projectData.country}
              onChangeText={(text) =>
                setProjectData({ ...projectData, country: text })
              }
            /> */}
          <Text>State/UT: </Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={State.getStatesOfCountry(projectData.country_code).map(
              (state) => {
                return { label: state.name, value: state.name };
              }
            )}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select State/UT" : "..."}
            searchPlaceholder="Search..."
            value={projectData.state}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setProjectData({ ...projectData, state: item.label });
              setIsFocus(false);
            }}
          />
          {/* <TextInput
              style={styles.input}
              name="state"
              value={projectData.state}
              onChangeText={(text) => setProjectData({ ...projectData, state: text })}
            /> */}

          <Text>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zip_code"
            value={projectData.zip_code}
            onChangeText={(text) =>
              setProjectData({ ...projectData, zip_code: text })
            }
          />
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

export default EditProject;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    // backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    maxWidth: "100%",
    minWidth: "90%",
    borderColor: "gray",
  },
  textInput: {
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
    maxWidth: "89%",
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "90%",
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
    width: 300,
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
