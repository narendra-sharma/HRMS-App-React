import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TouchableNativeFeedback,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
import { apiDeleteCompany, apiGetAllCompanies } from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";
import { apiUpdateProfile } from "../../../apis/auth";

const EditAccount = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await apiGetProfileDetails();
        // console.log("we got from api: ", res.data);
        setUserData(res.data.users);
        await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
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
        name: userData.name,
        phonenumber: userData.phone_number,
        address: userData.address,
        org: userData.org,
        state: userData.state,
        country: userData.country,
        country_code: userData.country_code,
        latitude: userData.lat,
        longitude: userData.long,
        zipcode: userData.zip_code,
      });
      // console.log(userData);
      //   console.log(res);
      if (res.status == 200) {
        Toast.show("Profile Updated Successfully", {
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
        await AsyncStorage.setItem("profile", JSON.stringify(resp.data.users));

        navigation.navigate("My Profile");
      }
      //   console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Name"
          />
          <Text>Username:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData.username}
            onChangeText={(text) =>
              setUserData({ ...userData, username: text })
            }
            placeholder="Username"
          />
          <Text>Organization:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={userData.org}
            onChangeText={(text) => setUserData({ ...userData, org: text })}
          />
          <Text>Phone Number:</Text>
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
          />
          {/* <TextInput
              style={styles.input}
              name="country"
              value={userData.country}
              onChangeText={(text) =>
                setUserData({ ...userData, country: text })
              }
            /> */}
          <Text>State/UT: </Text>
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
          />
          {/* <TextInput
              style={styles.input}
              name="state"
              value={userData.state}
              onChangeText={(text) => setUserData({ ...userData, state: text })}
            /> */}

          <Text>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zip_code"
            value={userData.zip_code}
            onChangeText={(text) =>
              setUserData({ ...userData, zip_code: text })
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

export default EditAccount;

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
