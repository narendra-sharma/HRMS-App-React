import { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Calendar, CalendarProvider } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import MonthlyAgenda from "./MonthlyAgenda";
import { apiGetAllLeaves } from "../../../apis/leaves";
import {
  apiGetMonthlyCalendar,
  apiGetShiftInformationBreakdown,
} from "../../../apis/calendar";
import { ScrollView } from "react-native-gesture-handler";
import { apiGetCheckinStatus } from "../../../apis/qr";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MonthlyCalendar = ({ navigation }) => {
  //   const [jobsList, setJobsList] = useState([]);
  const [selected, setSelected] = useState("2023-09-09");
  const [markedDatesObj, setMarkedDatesObj] = useState({});
  const [shiftObj, setShiftObj] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [leavesList, setLeavesList] = useState([]);
  const [shiftLogs, setShiftLogs] = useState([]);
  const [isCheckIn, setIsCheckIn] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [checkinMsg, setCheckinMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        //function to check if user is clocking in or clocking out
        const user = await AsyncStorage.getItem("profile");
        const checkinRes = await apiGetCheckinStatus({
          user_id: JSON.parse(user).id,
        });
        console.log("response", checkinRes.data);
        setIsCheckIn(!checkinRes.data.checkin);
        setCheckinMsg(checkinRes.data.message);
      })();

      const getAllLeaves = async () => {
        try {
          const res = await apiGetAllLeaves();
          setLeavesList([...res?.data?.leaves]);
          // console.log("leaves: ", res?.data.leaves);
          let tempDatesObj = {};

          res?.data.leaves.map((leave) => {
            let dateColor =
              leave.status == "Pending"
                ? "#ffab00"
                : leave.status == "Approved"
                ? "#82e250"
                : "red";

            //we ain't displaying leaves with status pending
            if (leave.status == "Approved")
              tempDatesObj[leave.date] = {
                selected: true,
                // disableTouchEvent: true,
                selectedColor: dateColor,
                leaveStatus: leave.status,
              };

            if (leave.status == "Approved")
              tempDatesObj[leave.date] = {
                selected: true,
                // disableTouchEvent: true,
                selectedColor: dateColor,
                leaveStatus: leave.status,
              };
          });
          setMarkedDatesObj({ ...tempDatesObj });
        } catch (err) {
          console.log(err);
        }
      };

      const date = new Date();
      getMonthlyCalendar(date.getMonth() + 1, date.getFullYear());
      getAllLeaves();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const getMonthlyCalendar = async (month, year) => {
    try {
      // console.log("month", date.getMonth() + 1);
      // console.log("year", date.getFullYear());

      const res = await apiGetMonthlyCalendar(month, year);
      // console.log("shift: ", res?.data);
      setShiftObj({ ...res?.data?.data });
    } catch (err) {
      console.log(err);
    }
  };

  //handle date on click and set modal data
  const handleDateClicked = async (day) => {
    const leaveApplied = markedDatesObj.hasOwnProperty(day.dateString);
    const status = leaveApplied
      ? `Leave Applied - ${markedDatesObj[day.dateString]?.leaveStatus}`
      : "Full day";

    const res = await apiGetShiftInformationBreakdown(
      day.day,
      day.month,
      day.year
    );
    setShiftLogs([...res.data.data]);

    console.log("shift logs", res.data.data);

    const modalDay = {
      date: day.dateString,
      status: status,
      leaveApplied: leaveApplied,
    };
    if (
      day.dateString <= new Date().toJSON().slice(0, 10) &&
      shiftObj.hasOwnProperty(day.dateString)
    )
      setModalVisible(true);
    setModalData(modalDay);
    // console.log("selected day", day);
  };

  //calculate shift
  const calculateShiftType = (hours) => {
    // console.log(hours);
    switch (true) {
      case hours >= 8:
        console.log("full day ", hours);
        return { text: "Full Day", color: "#84c529" };
      case hours >= 6 && hours < 8:
        console.log("short leave ", hours);
        return { text: "Short Leave", color: "#84c52994" };
      case hours >= 4 && hours < 6:
        console.log("half day ", hours);
        return { text: "Half Day", color: "#02D8E9" };
      case hours >= 2 && hours < 4:
        console.log("Quarter ", hours);
        return { text: "Quarter", color: "lightblue" };
      case hours >= 0 && hours <= 2:
        console.log("Others", hours);
        return { text: "Others", color: "#f39da5" };
      default:
        return { text: "Absent", color: "#f54f55" };
    }
  };

  //handle calendar refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  console.log("checkin? ", isCheckIn);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()} />
        }
        style={{ backgroundColor: "#fff", height: "100%", marginTop: 32 }}
      >
        <Calendar
          // onDayPress={(day) => handleDateClicked(day)}
          monthFormat={"MMM yyyy"}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            getMonthlyCalendar(month.month, month.year);
          }}
          // enableSwipeMonths={true}
          markedDates={markedDatesObj}
          firstDay={1}
          hideExtraDays={true}
          dayComponent={({ date, state }) => {
            // console.log(date);
            return (
              <TouchableOpacity
                onPress={() => handleDateClicked(date)}
                style={[
                  styles.dayContainer,
                  {
                    backgroundColor:
                      date.dateString < new Date().toJSON().slice(0, 10) &&
                      shiftObj.hasOwnProperty(date.dateString)
                        ? calculateShiftType(shiftObj[date.dateString]?.hours) //background colour for shift type
                            .color
                        : date.dateString == new Date().toJSON().slice(0, 10) &&
                          shiftObj.hasOwnProperty(date.dateString)
                        ? // &&
                          // !markedDatesObj.hasOwnProperty(date.dateString) //background colour for present date
                          "#e5e5e5"
                        : "#fff",
                    borderRadius: 8,
                    // borderColor:
                    //   markedDatesObj[date.dateString]?.leaveStatus ==
                    //     "Approved" && "green",
                    // borderWidth:
                    //   markedDatesObj[date.dateString]?.leaveStatus ==
                    //     "Approved" && 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color:
                        !shiftObj.hasOwnProperty(date.dateString) &&
                        date.dateString <= new Date().toJSON().slice(0, 10) &&
                        "#d9d9d9",
                    },
                  ]}
                >
                  {date.day}
                </Text>

                {date.dateString < new Date().toJSON().slice(0, 10) && //shift type for older dates
                shiftObj.hasOwnProperty(date.dateString) ? (
                  <Text style={styles.calendarText}>
                    {shiftObj[date.dateString]?.hours}h{" "}
                    {shiftObj[date.dateString]?.minutes}m{/* {"\n"} */}
                    {/* {calculateShiftType(shiftObj[date.dateString]?.hours).text} */}
                  </Text>
                ) : date.dateString == new Date().toJSON().slice(0, 10) && //checkin status for present date
                  shiftObj.hasOwnProperty(date.dateString) &&
                  !markedDatesObj.hasOwnProperty(date.dateString) ? (
                  !isCheckIn ? (
                    <Text style={[styles.calendarText, { fontSize: 9 }]}>
                      {shiftObj[date.dateString]?.hours}h{" "}
                      {shiftObj[date.dateString]?.minutes}m {"\n"}
                      {checkinMsg}
                    </Text>
                  ) : (
                    <Text style={[styles.calendarText, { fontSize: 9 }]}>
                      {shiftObj[date.dateString]?.hours}h{" "}
                      {shiftObj[date.dateString]?.minutes}m {"\n"}
                      {checkinMsg}
                    </Text>
                  )
                ) : (
                  date.dateString == new Date().toJSON().slice(0, 10) && //user on leave on present day
                  markedDatesObj.hasOwnProperty(date.dateString) && (
                    <Text
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5, // Border radius to make it look like a box
                        // backgroundColor: "lightblue",
                        // borderWidth: 1,
                        // marginHorizontal: 1,
                        paddingHorizontal: 2,
                        fontSize: 9,
                        // backgroundColor,
                      }}
                    >
                      Leave: Approved
                      {/* <Text
                        style={{
                          color: markedDatesObj[date.dateString].selectedColor,
                        }}
                      >
                        {markedDatesObj[date.dateString].leaveStatus}
                      </Text> */}
                    </Text>
                  )
                )}

                {/* *******LEAVE DATES ON CALENDAR******* */}
                {markedDatesObj[date.dateString]?.leaveStatus &&
                date.dateString != new Date().toJSON().slice(0, 10) ? (
                  <Text
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5, // Border radius to make it look like a box
                      // backgroundColor: "lightblue",
                      // borderWidth: 1,
                      // marginHorizontal: 1,
                      paddingHorizontal: 2,
                      fontSize: 9,
                      // backgroundColor,
                    }}
                  >
                    Leave:{" "}
                    <Text
                      style={{
                        color: markedDatesObj[date.dateString].selectedColor,
                      }}
                    >
                      {markedDatesObj[date.dateString].leaveStatus}
                    </Text>
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          }}
        />

        {/* View date details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> Date: {modalData?.date}</Text>
              <Text style={styles.modalText}>
                Status:{" "}
                {/* {shiftObj[modalData?.date]?.hours >= 8
                  ? "Full Day"
                  : shiftObj[modalData?.date]?.hours > 0 &&
                    shiftObj[modalData?.date]?.hours < 8
                  ? "Short Leave"
                  : "Absent"} */}
                {calculateShiftType(shiftObj[modalData?.date]?.hours).text}
              </Text>

              {shiftLogs?.length > 0 && (
                <View>
                  <Text style={{ textDecorationLine: "underline" }}>
                    Shift Breakdown:
                  </Text>
                  {shiftLogs.map((log) => (
                    <Text>
                      {log.type} : {log?.in_hrs ? log?.in_hrs : log?.message}
                    </Text>
                  ))}
                </View>
              )}

              {!modalData?.leaveApplied &&
                modalData?.date?.dateString >
                  new Date().toJSON().slice(0, 10) && (
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => {
                      navigation.navigate("Leaves", {
                        screen: "Apply Leaves",
                        initial: false,
                        params: { date: modalData },
                      });
                      // navigation.navigate("Leaves");
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
                      Apply Leave
                    </Text>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setModalVisible(!modalVisible)}
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
        </Modal>
      </ScrollView>
    </View>
  );
};

export default MonthlyCalendar;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  dayContainer: {
    width: 47,
    height: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    // borderRadius: 5, // Border radius to make it look like a box
    // borderColor: "lightgray",
    // borderWidth: 0.5,
    // marginHorizontal: 1,
    marginBottom: -9,
    paddingTop: 4,
  },
  modalView: {
    margin: 20,
    minWidth: "60%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    marginBottom: 12,
    textAlign: "left",
    // backgroundColor: "pink",
    fontSize: 14,
  },
  customButton: {
    width: 200,
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 10,
    borderRadius: 4,
  },
  calendarText: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5, // Border radius to make it look like a box
    // backgroundColor: "lightblue",
    // borderWidth: 1,
    // marginHorizontal: 1,
    padding: 2,
    fontSize: 10,
  },
});
