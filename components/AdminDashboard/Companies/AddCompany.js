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
import { apiCreateNewCompany, apiGetAllUsers } from "../../../apis/companies";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";

const initialFormData = {
  companyName: "",
  vatNumber: "",
  email: "",
  phoneNo: "",
  contractor: [],
  consultant: [],
  consultantManager: [],
  address: "",
  country: "",
  state: "",
  zipcode: "",
};

const AddCompany = ({ navigation }) => {
  const [newCompanyData, setNewCompanyData] = useState(initialFormData);
  const [nameError, setNameError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [vatError, setVatError] = useState(null);
  const [cmError, setCmError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [contractorError, setContractorError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipcodeError, setZipcodeError] = useState(null);

  const [contractorsList, setContractorsList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [consultantManagerList, setConsultantManagerList] = useState([]);

  const [responseError, setResponseError] = useState(null);

  useEffect(() => {
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
    if (address == "") {
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
  const handleNewCompanySubmit = async () => {
    if (
      validateCompanyName(newCompanyData.companyName) &&
      validateAddress(newCompanyData.address) &&
      validateVat(newCompanyData.vatNumber) &&
      validateEmail(newCompanyData.email) &&
      validatePhone(newCompanyData.phoneNo) &&
      validateCm(newCompanyData.consultantManager) &&
      validateConsultant(newCompanyData.consultant) &&
      // validateContractor(newCompanyData.contractor) &&
      validateCountry(newCompanyData.country) &&
      validateState(newCompanyData.state) &&
      validateZipcode(newCompanyData.zipcode)
    ) {
      try {
        const res = await apiCreateNewCompany({
          ...newCompanyData,
          name: newCompanyData.companyName,
          address: newCompanyData.address,
          status: 1,
          vat_number: newCompanyData.vatNumber,
          consultant_manager: newCompanyData.consultantManager,
        });
        console.log("response: ");
        console.log(res);
        if (res.data.success == true) {
          Toast.show("New Company Added", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Add New Company", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      } catch (error) {
        Toast.show("Cannot Add New Company", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }
      // setNewCompanyData(initialFormData);
    } else {
      validateCompanyName(newCompanyData.companyName);
      validateAddress(newCompanyData.address);
      validateVat(newCompanyData.vatNumber);
      validateCm(newCompanyData.consultantManager);
      validateConsultant(newCompanyData.consultant);
      // validateContractor(newCompanyData.contractor);
      validateCountry(newCompanyData.country);
      validateZipcode(newCompanyData.zipcode);
      validateState(newCompanyData.state);
      validateEmail(newCompanyData.email);
      validatePhone(newCompanyData.phoneNo);
    }
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
            value={newCompanyData.companyName}
            onChangeText={(text) => {
              setNewCompanyData({ ...newCompanyData, companyName: text });
              setNameError(null);
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.fieldName}>VAT Number:</Text>
          <TextInput
            style={styles.input}
            name="vat"
            value={newCompanyData.vatNumber}
            onChangeText={(text) => {
              setNewCompanyData({ ...newCompanyData, vatNumber: text });
              setVatError(null);
            }}
            placeholder="VAT Number"
          />
          {vatError ? <Text style={styles.errorText}>{vatError}</Text> : null}

          <Text style={styles.fieldName}>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            placeholder="Email"
            value={newCompanyData.email}
            onChangeText={(text) => {
              setNewCompanyData({ ...newCompanyData, email: text });
              setEmailError(null);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            placeholder="Phone Number"
            value={newCompanyData.phoneNo}
            onChangeText={(text) => {
              setNewCompanyData({ ...newCompanyData, phoneNo: text });
              setPhoneError(null);
            }}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={newCompanyData.consultantManager}
            setValue={setNewCompanyData}
            label="consultantManager"
            originalObj={newCompanyData}
            setErrorState={setCmError}
          />
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null}

          <Text style={styles.fieldName}>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={newCompanyData.consultant}
            setValue={setNewCompanyData}
            label="consultant"
            originalObj={newCompanyData}
            setErrorState={setConsultantError}
          />
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
          ) : null}

          {/* <Text style={styles.fieldName}>Assign Contractor:</Text>
          <DropdownMenu
            data={contractorsList}
            placeholder="Select Contractor"
            value={newCompanyData.contractor}
            setValue={setNewCompanyData}
            label="contractor"
            originalObj={newCompanyData}
            setErrorState={setContractorError}
          />
          {contractorError ? (
            <Text style={styles.errorText}>{contractorError}</Text>
          ) : null} */}

          <Text>Address:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: newCompanyData.address,
              onChangeText: (text) => {
                setNewCompanyData({ ...newCompanyData, address: text });
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

              setNewCompanyData({
                ...newCompanyData,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                address: details.formatted_address,
                state: stateName,
                zipcode: areaZip,
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
            value={newCompanyData.country_code}
            onChange={(item) => {
              setNewCompanyData({
                ...newCompanyData,
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
            data={State.getStatesOfCountry(newCompanyData.country_code).map(
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
            value={newCompanyData.state}
            onChange={(item) => {
              setNewCompanyData({ ...newCompanyData, state: item.label });
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
            value={newCompanyData.zipcode}
            onChangeText={(text) => {
              setNewCompanyData({ ...newCompanyData, zipcode: text });
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
          <Pressable
            onPress={handleNewCompanySubmit}
            style={styles.submitButton}
          >
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

export default AddCompany;

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
