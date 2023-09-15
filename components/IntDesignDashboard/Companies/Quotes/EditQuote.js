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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Country, State, City } from "country-state-city";
import { Dropdown } from "react-native-element-dropdown";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const initialQuoteData = {
  customerName: "",
  customerName: "",
  pointOfContact: "",
  projectLocation: "",
};

const EditQuote = ({ navigation }) => {
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [isFocus, setIsFocus] = useState(false);

  const handleSubmit = async () => {
    try {
      // const res = await apiUpdateProfile({
      //   ...quoteData,
      //   name: quoteData.name,
      //   phonenumber: quoteData.phone_number,
      //   address: quoteData.address,
      //   org: quoteData.org,
      //   state: quoteData.state,
      //   country: quoteData.country,
      //   country_code: quoteData.country_code,
      //   latitude: quoteData.lat,
      //   longitude: quoteData.long,
      //   zipcode: quoteData.zip_code,
      // });
      // console.log(quoteData);
      //   console.log(res);
      // if (res.status == 200) {
      //   ToastAndroid.show("Profile Updated Successfully", ToastAndroid.SHORT);
      //   const resp = await apiGetProfileDetails();
      //   console.log("we got from api: ", res.data);
      //   setQuoteData(resp.data.users);
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
          <Text>Comapany Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={quoteData.comapanyName}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, comapanyName: text })
            }
            placeholder="Comapany Name"
          />
          <Text>Customer Name:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={quoteData.customerName}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, customerName: text })
            }
          />
          <Text>Items:</Text>
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={quoteData.pointOfContact}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, description: text })
            }
            placeholder="Description"
          />
          <Text>Quantitiy:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={quoteData.pointOfContact}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, Quantitiy: text })
            }
            placeholder="Quantitiy"
          />
          <Text>Total Cost of Line:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={quoteData.pointOfContact}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, TotalCostofLine: text })
            }
            placeholder="Total Cost of Line"
          />
          <Text>Tax:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={quoteData.pointOfContact}
            onChangeText={(text) => setQuoteData({ ...quoteData, Tax: text })}
            placeholder="Tax"
          />
          <Text>Discount:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={quoteData.pointOfContact}
            onChangeText={(text) =>
              setQuoteData({ ...quoteData, Discount: text })
            }
            placeholder="Discount"
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

export default EditQuote;

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
