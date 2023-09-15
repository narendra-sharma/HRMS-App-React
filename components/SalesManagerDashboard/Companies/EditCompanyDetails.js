import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  ToastAndroid,
} from "react-native";
import { mockData } from "./MOCK_DATA";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { apiUpdateCompanyDetails } from "../../../apis/companies";

const initialCompanyData = {
  companyName: "",
  email: "",
  phoneNo: "",
  address: "Indian bank, jhujhar nagar",
};

const EditCompanyDetails = ({ navigation, route }) => {
  const [companyData, setCompanyData] = useState(initialCompanyData);

  console.log("edit params: ", route.params);

  useEffect(() => {
    setCompanyData({ ...route.params });
  }, []);

  const handleSubmit = async () => {
    // const index = mockData.findIndex((item) => item.id == companyData.id);
    // mockData[index] = { ...mockData[index], companyData };
    try {
      const res = await apiUpdateCompanyDetails(companyData, companyData.id);
      console.log(res.data);
      if (res.data.success == true) {
        ToastAndroid.show("Details updated successfully", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.centeredView}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Text>Company Name:</Text>
            <TextInput
              style={styles.input}
              name="name"
              value={companyData.name}
              onChangeText={(text) =>
                setCompanyData({ ...companyData, name: text })
              }
              placeholder="Name"
            />
            <Text>Email:</Text>
            <TextInput
              style={styles.input}
              name="email"
              value={companyData.email}
              onChangeText={(text) =>
                setCompanyData({ ...companyData, email: text })
              }
            />
            <Text>Phone Number:</Text>
            <TextInput
              style={styles.input}
              name="phoneNo"
              value={companyData.phoneNo}
              onChangeText={(text) =>
                setCompanyData({ ...companyData, phoneNo: text })
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
                value: companyData.address,
                onChangeText: (text) => {
                  setCompanyData({ ...companyData, address: text });
                },
              }}
              onPress={(data, details = null) => {
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

                setCompanyData({
                  ...companyData,
                  lat: details.geometry.location.lat,
                  long: details.geometry.location.lng,
                  address: details.formatted_address,
                  state: stateName,
                  zip_code: areaZip,
                  country_code: countryCode,
                  country: countryName,
                });

                //   console.log(companyData);
              }}
              query={{
                key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
                language: "en",
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={200}
              styles={placesStyle}
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          ></View>
        </ScrollView>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.textStyle}>Submit</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.textStyle}>Cancel</Text>
        </Pressable>
      </View>
    </>
  );
};

export default EditCompanyDetails;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    maxWidth: "100%",
    minWidth: "90%",
  },
  textInput: {
    height: 45,
    color: "#5d5d5d",
    fontSize: 16,
    borderWidth: 1,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    color: "black",
    backgroundColor: "white",
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
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  input: {
    borderWidth: 1,
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
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
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  button: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  buttonClose: {
    backgroundColor: "#055C9D",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
  },

  item: {
    padding: 10,
    fontSize: 16,
  },

  addButton: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
