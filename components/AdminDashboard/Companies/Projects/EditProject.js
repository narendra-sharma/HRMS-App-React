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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import {
  apiAddNewProject,
  apiGetPreFilledProjectDetails,
  apiGetProjectsDropdownData,
  apiUpdateProjectDetails,
} from "../../../../apis/projects";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const initialFormData = {
  name: "",
  company: "",
  customer: "",
  // tags: [],
  description: "",
  start_date: "",
  deadline: "",
  estimated_hour: "",
  consultant: "",
  status: 1,
  address: "",
  lat: "",
  long: "",
  billing_type: "",
  number: "",
};

const EditProject = ({ navigation, route }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [nameError, setNameError] = useState(null);
  const [customerError, setCustomerError] = useState(null);
  const [tagsError, setTagsError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [addressError, setAddressError] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetPreFilledProjectDetails(route.params.id);
      setFormData({ ...res.data.project });
      const tempCompanies = res.data.companies.map((company) => {
        return { label: company.name, value: company.id };
      });
      setCompanyList([...tempCompanies]);

      const tempConsultants = res.data.consultant.map((consultant) => {
        return { label: consultant.name, value: consultant.id };
      });
      setConsultantList([...tempConsultants]);

      const tempCustomers = res.data.customers.map((customer) => {
        return { label: customer.name, value: customer.id };
      });
      setCustomersList([...tempCustomers]);
    };

    getAllData();
  }, []);

  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setFormData({ ...formData, start_date: date });
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    if (
      moment(startDate).format("MM/DD/YYYY") <=
      moment(date).format("MM/DD/YYYY")
    ) {
      setEndDate(date);
      setFormData({ ...formData, end_date: date });
    } else {
      setDeadlineError("Deadline cannot be before the start date");
    }
    hideEndDatePicker();
  };

  const handleSubmit = async () => {
    try {
      // console.log("edit project obj:", {
      //   ...formData,
      //   company: formData.company_id,
      //   customer: formData.customer_id,
      //   name: formData.project_name,
      //   consultant: formData.consultant_id,
      //   estimated_hour: formData.estimated_hours,
      //   deadline: formData.end_date,
      //   number: formData.contact_number,
      // });
      const res = await apiUpdateProjectDetails(
        {
          ...formData,
          company: formData.company_id,
          customer: formData.customer_id,
          name: formData.project_name,
          consultant: formData.consultant_id,
          estimated_hour: formData.estimated_hours,
          deadline: formData.end_date,
          number: formData.contact_number,
        },
        route.params.id
      );
      console.log("res: ", res);
      if (res.status == 200) {
        Toast.show("Project Updated", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        navigation.goBack();
      } else {
        Toast.show("Project Update Failed", {
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
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        estimated_hours
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Project Name:</Text>
          <TextInput
            style={styles.input}
            name="project_name"
            value={formData.project_name}
            onChangeText={(text) => {
              setFormData({ ...formData, project_name: text });
              setNameError(null);
            }}
            placeholder="Project Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text>Company:</Text>
          <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company_id}
            setValue={setFormData}
            label="company_id"
            originalObj={formData}
            setErrorState={setNameError}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text>Customer:</Text>
          <DropdownMenu
            data={customersList}
            placeholder="Select Customer"
            value={formData.customer_id}
            setValue={setFormData}
            label="customer_id"
            originalObj={formData}
            setErrorState={setCustomerError}
          />
          {customerError ? (
            <Text style={styles.errorText}>{customerError}</Text>
          ) : null}

          {/* <Text>Tags:</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={[
              { label: "Carpentry", value: 1 },
              { label: "Electrical", value: 2 },
              { label: "Piping", value: 3 },
              { label: "Sewerage", value: 4 },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={selectedTags}
            onChange={(item) => {
              setSelectedTags(item);
            }}
            selectedStyle={styles.selectedStyle}
          />
          {tagsError ? <Text style={styles.errorText}>{tagsError}</Text> : null} */}

          <Text>Task Description:</Text>
          <TextInput
            style={styles.input}
            name="description"
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              setDescriptionError;
            }}
            placeholder="Task Description"
          />
          {descriptionError ? (
            <Text style={styles.errorText}>{descriptionError}</Text>
          ) : null}

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />

          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="contact_number"
            value={formData.contact_number}
            onChangeText={(text) => {
              setFormData({ ...formData, contact_number: text });
            }}
            placeholder="Number"
          />

          <Text>Start Date:</Text>
          <Pressable
            onPress={() => {
              setStartDateVisibility(true);
              setStartDateError(null);
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
            name="start_date"
            value={formData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {formData.start_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(formData.start_date).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text>Deadline:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              setDeadlineError(null);
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
            name="startDate"
            value={formData.deadline}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {formData.end_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(formData.end_date).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>Deadline</Text>
            )}
          </Pressable>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null}

          <Text>Total Estimated Hours:</Text>
          <TextInput
            style={styles.input}
            name="estimated_hour"
            value={formData.estimated_hours}
            onChangeText={(text) => {
              setFormData({ ...formData, estimated_hours: text });
              setDescriptionError;
            }}
            placeholder="Total Estimated Hours"
          />
          {/* {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null} */}

          <Text>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant_id}
            setValue={setFormData}
            label="consultant_id"
            originalObj={formData}
            setErrorState={setConsultantError}
          />
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
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

          <Text>Billing Type:</Text>
          <DropdownMenu
            data={[
              { label: "Net Banking", value: 1 },
              { label: "Credit Card", value: 2 },
              { label: "Debit Card", value: 3 },
              { label: "UPI", value: 4 },
            ]}
            placeholder="Select Company"
            value={Number(formData.billing_type)}
            setValue={setFormData}
            label="billing_type"
            originalObj={formData}
            setErrorState={setNameError}
          />
          {/* {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null} */}
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
    color: "#A9A9AC",
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
