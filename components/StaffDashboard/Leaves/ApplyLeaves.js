import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiApplyLeave, apiGetLeaveTypes } from "../../../apis/leaves";
import * as DocumentPicker from "expo-document-picker";

const ApplyLeaves = ({ navigation, route }) => {
  const [formData, setFormData] = useState(false);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [leaveTypeList, setleaveTypeList] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [leaveTypeError, setLeaveTypeError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);
  const [reasonError, setReasonError] = useState(null);
  const [documentError, setDocumentError] = useState(null);

  // console.log(route.params);
  useEffect(() => {
    if (route.params) {
      setStartDate(route.params.date);
      setEndDate(route.params.date);
      setFormData((prev) => ({
        ...prev,
        start_date: route.params.date,
        end_date: route.params.date,
      }));
    }

    const getUser = async () => {
      const user = await AsyncStorage.getItem("profile");
      setFormData((prev) => ({ ...prev, user_id: JSON.parse(user).id }));
    };

    const getLeaveTypes = async () => {
      try {
        const res = await apiGetLeaveTypes();
        // console.log("jobs: ", res?.data);
        const temp = res?.data?.leave_types.map((type) => {
          return {
            label: type.type,
            value: type.id,
          };
        });
        setleaveTypeList([...temp]);
      } catch (err) {
        console.log(err);
      }
    };

    getLeaveTypes();

    getUser();
  }, []);

  console.log(formData);

  var date = new Date();

  //date functions
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setFormData({ ...formData, start_date: moment(date).format("YYYY-MM-DD") });
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
      setFormData({ ...formData, end_date: moment(date).format("YYYY-MM-DD") });
    } else {
      // setend_dateError("end_date cannot be before the start date");
    }
    hideEndDatePicker();
  };

  //validation functions
  const requiredValidation = (setError, value, label) => {
    if (value == "" || value == null) {
      setError(`${label} is required*`);
      return false;
    }
    return true;
  };

  //handle file upload
  const UploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.assets[0].uri) {
      setIsFilePicked(true);
      setFormData((prev) => ({
        ...prev,
        document: result.assets[0].uri,
        fileName: result.assets[0].name,
        fileType: result.assets[0].mimeType,
      }));
      console.log(formData);
    }
    console.log(result.assets[0]);
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      //CASE OF MEDICAL LEAVE
      requiredValidation(
        setLeaveTypeError,
        formData.leave_type_id,
        "Leave type"
      ) &&
      requiredValidation(
        setStartDateError,
        formData.start_date,
        "Start date"
      ) &&
      requiredValidation(setStartDateError, formData.end_date, "End Date") &&
      requiredValidation(setReasonError, formData.reason, "Reason") &&
      requiredValidation(setDocumentError, formData.document, "Document") &&
      formData.leave_type_id == 1
    ) {
      try {
        var form_data = new FormData();
        form_data.append("user_id", formData.user_id);
        form_data.append("leave_type_id", formData.leave_type_id);
        form_data.append("start_date", formData.start_date);
        form_data.append("end_date", formData.end_date);
        form_data.append("reason", formData.reason);
        form_data.append("proof", {
          uri: formData.document,
          type: formData.fileType,
          name: formData.fileName,
        });
        const res = await apiApplyLeave(form_data);
        console.log(res.data);
        if (res.data.status == true) {
          Toast.show("Leave Request Sent Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show(`${JSON.stringify(res.data.errors[0])}`, {
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
        Toast.show(`Server Error`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } else if (
      //CASE OF ANY OTHER TYPE OF LEAVE
      requiredValidation(
        setLeaveTypeError,
        formData.leave_type_id,
        "Leave type"
      ) &&
      requiredValidation(
        setStartDateError,
        formData.start_date,
        "Start date"
      ) &&
      requiredValidation(setStartDateError, formData.end_date, "End Date") &&
      requiredValidation(setReasonError, formData.reason, "Reason") &&
      formData.leave_type_id != 1
    ) {
      try {
        // var form_data = new FormData();
        // form_data.append("user_id", formData.user_id);
        // form_data.append("leave_type_id", formData.leave_type_id);
        // form_data.append("start_date", formData.start_date);
        // form_data.append("end_date", formData.end_date);
        // form_data.append("reason", formData.reason);

        const res = await apiApplyLeave(formData);
        console.log(res.data);
        if (res.data.status == true) {
          Toast.show("Leave Request Sent Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show(`${JSON.stringify(res.data.errors[0])}`, {
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
        Toast.show(`Server Error`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } else {
      //SHOW ERROR VALIDATIONS
      requiredValidation(
        setLeaveTypeError,
        formData.leave_type_id,
        "Leave type"
      );
      requiredValidation(setStartDateError, formData.start_date, "Start date");
      requiredValidation(setEndDateError, formData.end_date, "End Date");
      requiredValidation(setReasonError, formData.reason, "Reason");
      if (formData.leave_type_id == 1)
        requiredValidation(setDocumentError, formData.document, "Document");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 24,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewContainer}
        // keyboardShouldPersistTaps="always"
        keyboardDismissMode={true}
      >
        <View>
          {/* Select Leave Type */}
          <Text style={styles.labelField}>Leave Type:</Text>
          <DropdownMenu
            // data={[
            //   { label: "Sick Leave", value: "1" },
            //   { label: "Casual Leave", value: "2" },
            //   { label: "Some Leave Type", value: "3" },
            // ]}
            data={leaveTypeList}
            placeholder="Select Leave Type"
            value={formData.leave_type_id}
            setValue={setFormData}
            label="leave_type_id"
            originalObj={formData}
            setErrorState={setLeaveTypeError}
          />
          {leaveTypeError ? (
            <Text style={styles.errorText}>{leaveTypeError}</Text>
          ) : null}

          {/* Select Start Date */}
          <Text style={styles.labelField}>Start Date:</Text>
          <Pressable
            onPress={() => {
              setStartDateVisibility(true);
              // setFormData({
              //   ...formData,
              //   start_date: moment(startDate).format("MM/DD/YYYY"),
              // });
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
            name="startDate"
            //   value={formData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {startDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(startDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                MM/DD/YYYY
              </Text>
            )}
          </Pressable>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            // minimumDate={date.setDate(date.getDate() + 1)}
          />
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          {/* Select End Date */}
          <Text style={styles.labelField}>End Date:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              // setFormData({
              //   ...startDate,
              //   end_date: moment(endDate).format("MM/DD/YYYY"),
              // });
              setEndDateError(null);
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
            name="endDate"
            //   value={formData.end_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {endDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(endDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                MM/DD/YYYY
              </Text>
            )}
          </Pressable>
          <DateTimePickerModal
            minimumDate={startDate ? startDate : date}
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          {endDateError ? (
            <Text style={styles.errorText}>{endDateError}</Text>
          ) : null}

          {/* Reason For Leave */}
          <Text style={styles.labelField}>Reason:</Text>
          <TextInput
            style={styles.input}
            name="reason"
            value={formData.reason}
            onChangeText={(text) => {
              setFormData({ ...formData, reason: text });
              setReasonError(null);
            }}
            placeholder="Reason"
            multiline={true}
          />
          {reasonError ? (
            <Text style={styles.errorText}>{reasonError}</Text>
          ) : null}

          {/* Upload document in case of medical leave */}
          {formData.leave_type_id == 1 ? (
            <>
              <Text style={styles.labelField}>Select Document:</Text>
              <Pressable
                onPress={() => {
                  UploadFile();
                  setDocumentError(null);
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
                name="endDate"
                //   value={formData.end_date}
              >
                <MaterialIcons name="attach-file" size={22} color="#A9A9AC" />
                {isFilePicked ? (
                  <View>
                    <Text numberOfLines={1} style={{ width: "80%" }}>
                      {formData.fileName}
                    </Text>
                  </View>
                ) : (
                  <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                    Select Document
                  </Text>
                )}
              </Pressable>
              {documentError ? (
                <Text style={styles.errorText}>{documentError}</Text>
              ) : null}
            </>
          ) : null}
        </View>

        <Button title="Apply Leave" onPress={handleSubmit} color="#055C9D" />
      </ScrollView>
    </View>
  );
};

export default ApplyLeaves;

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

const styles = StyleSheet.create({
  scrollviewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 22,
    //   alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: 16,
    width: 320,
    // maxHeight: "100%",
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
  labelField: {
    margin: 2,
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
    marginTop: -4,
    marginBottom: 4,
  },
});
