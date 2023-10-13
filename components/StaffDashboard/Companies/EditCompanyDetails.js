import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import Toast from "react-native-root-toast";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  apiUpdateCompanyDetails,
  apiGetAllUsers,
  apiGetCompanyDetails,
} from "../../../apis/companies";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";

const initialCompanyData = {
  name: "",
  vat_number: "",
  email: "",
  phoneNo: "",
  address: "",
  country: "",
  state: "",
  zip_code: "",
};

const EditCompanyDetails = ({ navigation, route }) => {
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [contractorsList, setContractorsList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [consultantManagerList, setConsultantManagerList] = useState([]);
  const [users, setUsers] = useState([]);
  const [defaultConsultantManager, setDefaultConsultantManager] = useState(0);
  const [defaultConsultant, setDeafultConsulatnt] = useState(0);
  const [defaultContractor, setDefaultContractor] = useState(0);
  const [nameError, setNameError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [vatError, setVatError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [cmError, setCmError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [contractorError, setContractorError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipcodeError, setZipcodeError] = useState(null);

  useEffect(() => {
    const tempCmObj = {
      ...users[users.findIndex((obj) => obj.user_type == 3)],
    };
    setDefaultConsultantManager(tempCmObj.id);

    const tempConsultObj = {
      ...users[users.findIndex((obj) => obj.user_type == 4)],
    };
    setDeafultConsulatnt(tempConsultObj.id);

    const tempContractObj = {
      ...users[users.findIndex((obj) => obj.user_type == 5)],
    };
    setDefaultContractor(tempContractObj.id);
    console.log("c m: ", defaultConsultantManager);
  }, [users]);

  useEffect(() => {
    const getCompanyDetails = async () => {
      const res = await apiGetCompanyDetails(route.params.id);
      // console.log("res data:", res.data);
      setUsers([...res.data.users]);
      setCompanyData({ ...res.data.data });
      console.log("data ", companyData);
    };
    getCompanyDetails();

    const getAllUsers = async () => {
      const res = await apiGetAllUsers();
      // console.log(res.data.data);
      const contractors = res.data.data.filter((user) => user.user_type == 5);
      const consultants = res.data.data.filter((user) => user.user_type == 4);
      const consultantManager = res.data.data.filter(
        (user) => user.user_type == 3
      );

      const tempContractors = contractors.map((contractor) => {
        return { label: contractor.name, value: contractor.id };
      });

      const tempConsultants = consultants.map((consultant) => {
        return { label: consultant.name, value: consultant.id };
      });

      const tempConsultantManager = consultantManager.map((manager) => {
        return { label: manager.name, value: manager.id };
      });

      setContractorsList([...tempContractors]);
      setConsultantList([...tempConsultants]);
      setConsultantManagerList([...tempConsultantManager]);
    };
    getAllUsers();
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
    if (address == "" || address == null) {
      setAddressError("Required*");
      return false;
    }
    return true;
  };

  const validateVat = (vat) => {
    if (vat == "") {
      setVatError("Required*");
      return false;
    }
    // return true;

    let reg = /^[0-9a-zA-z]{5}$/;
    if (reg.test(vat) == false) {
      setVatError("Please enter a valid vat number");
      return false;
    } else {
      return true;
    }
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
    if (cm == "" || cm == null) {
      setCmError("Required*");
      return false;
    }
    return true;
  };

  const validateConsultant = (consultant) => {
    if (consultant == "" || consultant == null) {
      setConsultantError("Required*");
      return false;
    }
    return true;
  };

  const validateContractor = (contractor) => {
    if (contractor == "" || contractor == null) {
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
    // return true;
    let reg = /^[0-9]{5,6}$/g;
    if (reg.test(zipcode) == false) {
      setZipcodeError("Please enter a valid zip code");
      return false;
    } else {
      return true;
    }
  };

  const validateState = (state) => {
    if (state == "" || state == null) {
      setStateError("Required*");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (
      validateCompanyName(companyData.name) &&
      validateAddress(companyData.address) &&
      validateVat(companyData.vat_number) &&
      validateEmail(companyData.email) &&
      validatePhone(companyData.phoneNo) &&
      // validateCm(companyData.consultantManager) &&
      // validateConsultant(companyData.consultant) &&
      // validateContractor(companyData.contractor) &&
      validateCountry(companyData.country) &&
      validateState(companyData.state) &&
      validateZipcode(companyData.zip_code)
    ) {
      try {
        // console.log("api data: ", {
        //   ...companyData,
        //   consultant_manager: companyData.cons_manager_id,
        //   consultant: companyData.consultant_id,
        //   contractor: companyData.contractor_id,
        //   zipcode: companyData.zip_code,
        // });
        const res = await apiUpdateCompanyDetails(
          {
            ...companyData,
            consultant_manager: companyData.cons_manager_id,
            consultant: companyData.consultant_id,
            zipcode: companyData.zip_code,
          },
          companyData.id
        );
        console.log("response: ", res.data);
        if (res.data.success == true) {
          Toast.show("Details Updated Successfully", {
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
        console.log(error);
      }
    } else {
      validateCompanyName(companyData.name);
      validateAddress(companyData.address);
      validateVat(companyData.vat_number);
      validateEmail(companyData.email);
      validateCm(companyData.consultantManager);
      validateConsultant(companyData.consultant);
      validateContractor(companyData.contractor);
      validateCountry(companyData.country);
      validateZipcode(companyData.zip_code);
      validateState(companyData.state);
      validatePhone(companyData.phoneNo);
    }
  };

  return (
    <View style={styles.centeredView}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Company Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={companyData.name}
            onChangeText={(text) => {
              setCompanyData({ ...companyData, name: text });
              setNameError(null);
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.fieldName}>VAT Number:</Text>
          <TextInput
            style={styles.input}
            name="vat_number"
            value={companyData.vat_number}
            onChangeText={(text) => {
              setCompanyData({ ...companyData, vat_number: text });
              setVatError(null);
            }}
            placeholder="VAT Number"
          />
          {vatError ? <Text style={styles.errorText}>{vatError}</Text> : null}

          <Text style={styles.fieldName}>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            value={companyData.email}
            onChangeText={(text) => {
              setCompanyData({ ...companyData, email: text });
              setEmailError(null);
            }}
            placeholder="Email"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phoneNo"
            value={companyData.phoneNo}
            onChangeText={(text) => {
              setCompanyData({ ...companyData, phoneNo: text });
              setPhoneError(null);
            }}
            placeholder="Phone Number"
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          {/* Dropdowns */}
          <Text style={styles.fieldName}>Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={defaultConsultantManager}
            setValue={setCompanyData}
            label="cons_manager_id"
            originalObj={companyData}
          />

          <Text style={styles.fieldName}>Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={defaultConsultant}
            setValue={setCompanyData}
            label="consultant_id"
            originalObj={companyData}
          />

          {/* <Text style={styles.fieldName}>Contractor:</Text>
          <DropdownMenu
            data={contractorsList}
            placeholder="Select Contractor"
            value={defaultContractor}
            setValue={setCompanyData}
            label="contractor_id"
            originalObj={companyData}
          /> */}

          {/* Address Fields */}
          <Text>Address:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: companyData.address,
              onChangeText: (text) => {
                setCompanyData({ ...companyData, address: text });
                setAddressError(null);
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

              setCompanyData({
                ...companyData,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
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
            value={companyData.country_code}
            onChange={(item) => {
              setCompanyData({
                ...companyData,
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
            data={State.getStatesOfCountry(companyData.country_code).map(
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
            value={companyData.state}
            onChange={(item) => {
              setCompanyData({ ...companyData, state: item.label });
              setStateError(null);
            }}
          />
          {stateError ? (
            <Text style={styles.errorText}>{stateError}</Text>
          ) : null}

          <Text>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zipcode"
            value={companyData.zip_code}
            onChangeText={(text) => {
              setCompanyData({ ...companyData, zip_code: text });
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
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
          <Pressable
            style={styles.submitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditCompanyDetails;

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
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // maxWidth: "100%",
    // minWidth: "90%",
    width: "100%",
    borderColor: "gray",
    borderRadius: 8,
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
