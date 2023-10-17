import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Calendar, CalendarProvider } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import MonthlyAgenda from "./MonthlyAgenda";
import {
  apiAssignEmployeeToProject,
  apiGetDropdownEmployeesList,
  apiGetProjectDetails,
} from "../../../apis/projects";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-root-toast";
import { apiDeleteEmployeeFromProject } from "../../../apis/calendar";

const MonthlyCalendar = ({ navigation, route }) => {
  const [selected, setSelected] = useState("2023-09-09");
  const [markedDatesObj, setMarkedDatesObj] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [employeesRequired, setEmployeesRequired] = useState(0);
  const [employeesDropdownList, setEmployeesDropdownList] = useState([]);
  const [formData, setFormData] = useState({ project_id: route.params.id });
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [employeeError, setEmployeeError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);

  // console.log("start date", route.params.start_date);

  const initialDate = `${moment(route.params.start_date, [
    "MM/DD/YYYY",
    "YYYY-MM-DD",
  ]).format("YYYY-MM-DD")}`;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getProjectDetails = async () => {
        try {
          const res = await apiGetProjectDetails({
            project_id: route.params.id,
          });

          // console.log("per day details: ", res.data.data.employees_data);
          setEmployeesRequired(res?.data?.data?.required_employee);
          setEmployeesData([...res?.data?.data?.employees_data]);
        } catch (err) {
          console.log(err);
        }
      };

      getProjectDetails();

      return () => {
        isActive = false;
      };
    }, [modalVisible, deleteFlag, refresh])
  );

  useEffect(() => {
    setFormData({
      project_id: route.params.id,
      start_date: modalData,
    });
    setEndDate("");
    try {
      const getDropdownEmployees = async () => {
        const res = await apiGetDropdownEmployeesList({
          project_id: route.params.id,
          date: modalData,
        });
        // console.log(res?.data?.data);

        const tempArr = res?.data?.data?.map((emp) => {
          return {
            label: `${emp.firstname} ${emp.lastname}`,
            value: emp.user_id,
          };
        });
        setEmployeesDropdownList([...tempArr]);
      };

      getDropdownEmployees();

      setStartDate(modalData);
    } catch (error) {
      console.log(Error);
    }
  }, [modalVisible]);

  const handleDateClicked = (date) => {
    if (
      moment(route.params.end_date, ["MM/DD/YYYY", "YYYY-MM-DD"]).format(
        "YYYY-MM-DD"
      ) >= date.dateString
    ) {
      setEmployeeError(null);
      setStartDateError(null);
      setDeadlineError(null);
      setModalVisible(true);
      setModalData(date.dateString);
    }
    // console.log("selected day", date);
  };

  //date functinos
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    setFormData({ ...formData, end_date: moment(date).format("MM/DD/YYYY") });
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

  // console.log("formData", formData);

  //handle form submit
  const handleSubmit = async () => {
    if (
      requiredValidation(setEmployeeError, formData.user_id, "Employee") &&
      requiredValidation(
        setStartDateError,
        formData.start_date,
        "Start date"
      ) &&
      requiredValidation(setDeadlineError, formData.end_date, "End date")
    ) {
      try {
        const res = await apiAssignEmployeeToProject({
          ...formData,
          from: moment(formData.start_date, [
            "MM/DD/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          to: moment(formData.end_date, "MM/DD/YYYY").format("YYYY-MM-DD"),
        });
        console.log("res", res.data);
        if (res.data.status == true) {
          Toast.show("Employee Assigned Successfully", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setModalVisible(!modalVisible);
        } else {
          Toast.show(`${res.data.errors[0]}`, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setModalVisible(!modalVisible);
        }
      } catch (error) {
        console.log(error);
        Toast.show("Server Error", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setModalVisible(!modalVisible);
      }
    } else {
      requiredValidation(setEmployeeError, formData.user_id, "Employee");
      requiredValidation(setStartDateError, formData.start_date, "Start date");
      requiredValidation(setDeadlineError, formData.end_date, "End date");
    }
  };

  //handle employee delete from project
  const handleEmployeeDelete = async (user, userId, date) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteEmployeeFromProject({
          project_id: route.params.id,
          user_id: userId,
          date: date,
        });
        console.log("res: ", res.data);
        if (res.data.status == true) {
          Toast.show("User Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setDeleteFlag((prev) => !prev);
        } else {
          Toast.show("An error has occurred", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setModalVisible(false);
        }
      } catch (error) {
        console.log(error);
        Toast.show("Server Error", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    };
    Alert.alert(
      `Remove ${user}`,
      `Are you sure you want to remove ${user} on date ${date}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteUser() },
      ]
    );
  };

  //handle page refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()} />
        }
        contentContainerStyle={{
          backgroundColor: "#fff",
          height: "100%",
          marginTop: 8,
        }}
      >
        <Calendar
          // enableSwipeMonths={true}
          initialDate={initialDate}
          // onDayPress={(day) => handleDateClicked(day)}
          // monthFormat={"MMM yyyy"}
          // // Handler which gets executed when visible month changes in calendar. Default = undefined
          // onMonthChange={(month) => {
          //   console.log("month changed", month);
          // }}
          // firstDay={1}
          dayComponent={({ date, state }) => {
            // console.log(date.dateString);
            // console.log(
            //   employeesData.findIndex((obj) => obj.date == date.dateString)
            // );
            return (
              <Pressable
                onPress={() => handleDateClicked(date)}
                style={styles.dayContainer}
              >
                {employeesData.findIndex(
                  (obj) => obj.date == date.dateString
                ) >= 0 ? (
                  <>
                    <Text style={styles.dayText}>{date.day}</Text>
                    <Text
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 3,
                        borderRadius: 5,
                        fontSize: 10,
                        backgroundColor: "#055C9D",
                        color: "#fff"
                      }}
                    >
                      Required Emp:{" "}
                      <Text style={{color: "white", fontWeight: "bold" }}>
                        {employeesRequired}
                      </Text>{" "}
                      {"\n"}
                      Assigned Emp:{" "}
                      <Text style={{color: "white", fontWeight: "bold" }}>
                        {
                          employeesData[
                            employeesData.findIndex(
                              (obj) => obj.date == date.dateString
                            )
                          ].assigned
                        }
                      </Text>
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.dayText, { color: "#d9d9d9" }]}>
                    {date.day}
                  </Text>
                )}
              </Pressable>
            );
          }}
          hideExtraDays={true}
        />
        {/* <MonthlyAgenda /> */}

        {/********Project Details Modal*********/}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <View style={styles.just}>
                  <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        marginBottom: 4,
                        fontSize: 15,
                      }}
                      >
                      {/* Date:  */}
                      {modalData}
                    </Text>

                    {/* Employees Listing */}
                    {employeesData[
                      employeesData.findIndex((obj) => obj.date == modalData)
                    ]?.data?.length > 0 && (
                      <View>
                        <Text style={{fontWeight: "600"}}>Assigned Employees:</Text>
                        <View
                          style={{
                            height: 100,
                            marginVertical: 10,
                            padding: 6,
                            borderWidth: 1,
                            borderColor: "lightgray",
                          }}
                        >
                          <FlatList
                            persistentScrollbar={true}
                            showsVerticalScrollIndicator={true}
                            data={
                              employeesData[
                                employeesData.findIndex(
                                  (obj) => obj.date == modalData
                                )
                              ]?.data
                            }
                            renderItem={({ item }) => (
                              // item.date == modalData ? (
                              // <Text> Name: {JSON.stringify(item?.user)} </Text>
                              // ) :
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  padding: 5,
                                }}
                              >
                                <Text style={{ fontSize: 15 }}>
                                  {item?.user?.name}
                                </Text>
                                {modalData >= new Date().toJSON().slice(0, 10) && (
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleEmployeeDelete(
                                        item?.user?.name,
                                        item?.user?.id,
                                        modalData
                                      )
                                    }
                                  >
                                    <Icon name="trash-alt" size={17} color="red" />
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          />
                        </View>
                        <View
                          style={{
                            margin: 8,
                            borderBottomColor: "gray",
                            borderBottomWidth: StyleSheet.hairlineWidth,
                          }}
                        />
                      </View>
                    )}

                    <Text
                      style={{
                        textAlign: "center",
                        padding: 6,
                        fontWeight: "600",
                        textDecorationLine: "underline",
                      }}
                    >
                      Assign A New Employee:
                    </Text>

                    {/* Add Employee */}
                      <Text style={{marginBottom: 2, marginTop: 10, fontWeight: "600"}}>Employee:</Text>
                      <DropdownMenu
                        data={employeesDropdownList}
                        placeholder="Select Employee"
                        value={formData.user_id}
                        setValue={setFormData}
                        label="user_id"
                        originalObj={formData}
                        setErrorState={setEmployeeError}
                      />
                      {employeeError ? (
                        <Text style={styles.errorText}>{employeeError}</Text>
                      ) : null}

                    <DateTimePickerModal
                      isVisible={isStartDatePickerVisible}
                      mode="date"
                      onConfirm={handleStartDateConfirm}
                      onCancel={hideStartDatePicker}
                      // minimumDate={modalData}
                    />
                    <Text style={{marginBottom: 2, marginTop: 10, fontWeight: "600"}}>Start Date:</Text>
                    <Pressable
                      // onPress={() => {
                      //   setStartDateVisibility(true);
                      //   setFormData({
                      //     ...formData,
                      //     start_date: moment(startDate).format("MM/DD/YYYY"),
                      //   });
                      //   setStartDateError(null);
                      // }}
                      style={[
                        styles.input,
                        {
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#e5e5e5",
                        },
                      ]}
                      name="startDate"
                      value={formData.start_date}
                    >
                      <Icon name="calendar-alt" size={25} color="#A9A9AC" />
                      {startDate ? (
                        <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                          {moment(startDate).format("MM/DD/YYYY")}
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
                      minimumDate={moment(modalData, "YYYY-MM-DD").toDate()}
                      maximumDate={moment(route.params.end_date, [
                        "MM/DD/YYYY",
                        "YYYY-MM-DD",
                      ]).toDate()}
                      isVisible={isEndDatePickerVisible}
                      mode="date"
                      onConfirm={handleEndDateConfirm}
                      onCancel={hideEndDatePicker}
                      // minimumDate={modalData}
                    />
                    <Text style={{marginBottom: 2,  marginTop: 10, fontWeight: "600"}}>End Date:</Text>
                    <Pressable
                      onPress={() => {
                        setEndDateVisibility(true);
                        setFormData({
                          ...formData,
                          end_date: moment(endDate).format("MM/DD/YYYY"),
                        });
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
                      {endDate ? (
                        <Text style={{ color: "#000", marginLeft: 10 }}>
                          {moment(endDate).format("MM/DD/YYYY")}
                        </Text>
                      ) : (
                        <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                          End Date
                        </Text>
                      )}
                    </Pressable>
                    {deadlineError ? (
                      <Text style={styles.errorText}>{deadlineError}</Text>
                    ) : null}
                </View>

                <View>
                      <TouchableOpacity
                      style={styles.customButton}
                      onPress={() => {
                        handleSubmit();
                      }}
                      >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Assign Employee
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.customButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                </View>
              
            </View>
          </View>
        </Modal>

        {/********Assign Employee Modal*********/}
        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={formModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setFormModalVisible(!formModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Date: {modalData}</Text>

              <Text>Assigned Employees:</Text>
              <FlatList
                data={
                  employeesData[
                    employeesData.findIndex((obj) => obj.date == modalData)
                  ]?.data
                }
                renderItem={(item) => (
                  // item.date == modalData ? (
                  // <Text> Name: {JSON.stringify(item?.user)} </Text>
                  // ) :
                  <Text>{item.item.user.name}</Text>
                )}
              />
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => {
                  // setFormModalVisible(true);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setFormModalVisible(false)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
      </ScrollView>
    </View>
  );
};

export default MonthlyCalendar;

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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dayContainer: {
    width: 49,
    height: 85,
    alignItems: "center",
    justifyContent: "space-between",
    // borderRadius: 5, // Border radius to make it look like a box
    // borderColor: "lightgray",
    // borderWidth: 0.5,
    marginHorizontal: 1,
    marginBottom: -5,
  },
  dayText: {
    fontSize: 16,
    color: "black", // Text color inside the box
  },

  centeredView: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16
  },
  modalView: {
    display: "flex",
    margin: 20,
    justifyContent: "space-between",
    // minWidth: "60%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    // alignItems: "center",
    shadowColor: "#000",
    height: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center",
  },
  customButton: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#055C9D",
    padding: 14,
    borderRadius: 8,
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#A9A9AC",
  },
  selectedTextStyle: {
    fontSize: 16,
  },

  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: -4,
    // marginBottom: 10,
  },

  input: {
    width: "100%",
    height: 35,
    marginTop: 2,
    marginBottom: 5,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },
});
