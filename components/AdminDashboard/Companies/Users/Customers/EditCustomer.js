import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import {
  apiCreateNewUser,
  apiGetUserDetails,
  apiGetUsersFromUsers,
  apiUpdateUserDetails,
} from "../../../../../apis/users";

const CUSTOMER_USER_TYPE = 6;

const initialFormData = {
  name: "",
  username: "",
  email: "",
  parent_id: "",
  org: "",
  phone_number: "",
  address: "",
  zip_code: "",
  country: "",
  country_code: "",
  state: "",
  user_type: CUSTOMER_USER_TYPE,
  lat: "",
  long: "",
};

const EditCustomer = ({ navigation, route }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [nameError, setNameError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [userNameError, setUsernameError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipcodeError, setZipcodeError] = useState(null);

  const [responseError, setResponseError] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await apiGetUserDetails(route.params.id);
      setFormData({ ...formData, ...res.data.users });
      console.log("user by id: ", res.data.users);
    };

    getUserDetails();
  }, []);

  //validation functions
  const validateCompanyName = (name) => {
    if (name == "") {
      setNameError("Required*");
      return false;
    }
    return true;
  };

  const validateAddress = (address) => {
    if (address == "") {
      setAddressError("Required*");
      return false;
    }
    return true;
  };

  const validateVat = (vat) => {
    if (vat == "") {
      setUsernameError("Required*");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    if (email == "" || email == null) {
      setEmailError("*Required");
      return false;
    }

    // setEmailError(null);
    // return true;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(email) === false) {
      setEmailError("Please Enter a valid email address");
      return false; //return false if in wrong format
    } else {
      setEmailError(null);
      return true; //return true if in right format
    }
  };

  const validatePhone = (num) => {
    if (num == "" || num == null) {
      setPhoneError("Required*");
      return false;
    }
    // return true;

    let reg = /^[0-9]{10}$/g;

    if (reg.test(num) === false) {
      setPhoneError("Please Enter a valid phone number");
      return false; //return false if in wrong format
    } else {
      setPhoneError(null);
      return true; //return true if in right format
    }
  };

  const validateCm = (cm) => {
    if (cm == "") {
      setCmError("Required*");
      return false;
    }
    return true;
  };

  const validateConsultant = (consultant) => {
    if (consultant == "") {
      setConsultantError("Required*");
      return false;
    }
    return true;
  };

  const validateContractor = (contractor) => {
    if (contractor == "") {
      setContractorError("Required*");
      return false;
    }
    return true;
  };

  const validateCountry = (country) => {
    if (country == "" || country == null) {
      setCountryError("Required*");
      return false;
    }
    return true;
  };

  const validateZipcode = (zipcode) => {
    if (zipcode == "") {
      setZipcodeError("Required*");
      return false;
    }
    return true;
  };

  const validateState = (state) => {
    if (state == "" || state == null) {
      setStateError("Required*");
      return false;
    }
    return true;
  };

  //handle new company submit
  const handleSubmit = async () => {
    // if (
    //   validateCompanyName(formData.companyName) &&
    //   validateAddress(formData.address) &&
    //   validateVat(formData.username) &&
    //   validateEmail(formData.email) &&
    //   validatePhone(formData.phoneNo) &&
    //   validateCm(formData.consultantManager) &&
    //   validateConsultant(formData.consultant) &&
    //   validateContractor(formData.contractor) &&
    //   validateCountry(formData.country) &&
    //   validateState(formData.state) &&
    //   validateZipcode(formData.zipcode)
    // ) {
    try {
      console.log("final form data: ", formData);
      const res = await apiUpdateUserDetails(formData, route.params.id);
      // console.log("response: ");
      console.log(res);
      if (res.data.message == "Updated Successfully") {
        Toast.show("Details Updated", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        navigation.goBack();
      } else {
        Toast.show("Details cannot be updated", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } catch (error) {
      Toast.show("Cannot Update User Details", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      console.log(error);
    }
    // setFormData(initialFormData);
    // } else {
    //   validateCompanyName(formData.companyName);
    //   validateAddress(formData.address);
    //   validateVat(formData.username);
    //   validateCm(formData.consultantManager);
    //   validateConsultant(formData.consultant);
    //   validateContractor(formData.contractor);
    //   validateCountry(formData.country);
    //   validateZipcode(formData.zipcode);
    //   validateState(formData.state);
    //   validateEmail(formData.email);
    //   validatePhone(formData.phoneNo);
    // }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              setNameError(null);
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.fieldName}>Username: </Text>
          <TextInput
            style={styles.input}
            name="username"
            value={formData.username}
            onChangeText={(text) => {
              setFormData({ ...formData, username: text });
              setUsernameError(null);
            }}
            placeholder="Username"
          />
          {userNameError ? (
            <Text style={styles.errorText}>{userNameError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setEmailError(null);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChangeText={(text) => {
              setFormData({ ...formData, phone_number: text });
              setPhoneError(null);
            }}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Organisation:</Text>
          <TextInput
            style={styles.input}
            name="org"
            placeholder="Organisation"
            value={formData.org}
            onChangeText={(text) => {
              setFormData({ ...formData, org: text });
              setEmailError(null);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

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
                setAddressError(null);
                setCountryError(null);
                setStateError(null);
                setZipcodeError(null);
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
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}

          <Text>Country: </Text>
          <Dropdown
            style={[styles.dropdown]}
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
            value={formData.country_code}
            onChange={(item) => {
              setFormData({
                ...formData,
                country_code: item.value,
                country: item.label,
                state: null,
              });
              setCountryError(null);
            }}
          />
          {countryError ? (
            <Text style={styles.errorText}>{countryError}</Text>
          ) : null}

          <Text>State/UT: </Text>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={State.getStatesOfCountry(formData.country_code).map(
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
            value={formData.state}
            onChange={(item) => {
              setFormData({ ...formData, state: item.label });
              setStateError(null);
            }}
          />
          {stateError ? (
            <Text style={styles.errorText}>{stateError}</Text>
          ) : null}

          <Text>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zip_code"
            value={formData.zip_code}
            onChangeText={(text) => {
              setFormData({ ...formData, zip_code: text });
              setZipcodeError(null);
            }}
            placeholder="Zip Code"
          />
          {zipcodeError ? (
            <Text style={styles.errorText}>{zipcodeError}</Text>
          ) : null}
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

export default EditCustomer;

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
