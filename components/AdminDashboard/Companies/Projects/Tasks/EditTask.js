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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown } from "react-native-element-dropdown";

const DropdownMenu = () => {
  const [value, setValue] = useState(null);

  const data = [
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder="Select Status"
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
        setValue(item.value);
      }}
    />
  );
};

const EditTask = () => {
  const [taskData, setTaskData] = useState({});
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);

  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);

  const showStartDatePicker = () => {
    setStartDateVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const showEndDatePicker = () => {
    setEndDateVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Task Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={taskData.taskName}
            onChangeText={(text) =>
              setTaskData({ ...taskData, taskName: text })
            }
            placeholder="Task Name"
          />
          <Text>Status:</Text>
          <DropdownMenu />
          {/* <TextInput
            style={styles.input}
            name="organization"
            value={taskData.totalCommission}
            onChangeText={(text) =>
              setTaskData({ ...taskData, totalCommission: text })
            }
            placeholder="Status"
          /> */}
          <Text>Tag:</Text>
          <TextInput
            style={styles.input}
            name="tag"
            value={taskData.tag}
            onChangeText={(text) => setTaskData({ ...taskData, tag: text })}
            placeholder="Tag "
          />
          <Text>Task Description:</Text>
          <TextInput
            style={styles.input}
            name="taskDescription"
            value={taskData.taskDescription}
            onChangeText={(text) =>
              setTaskData({ ...taskData, taskDescription: text })
            }
            placeholder="Task Description"
          />
          <Text>Task Cost:</Text>
          <TextInput
            style={styles.input}
            name="totalCost"
            value={taskData.totalCost}
            onChangeText={(text) =>
              setTaskData({ ...taskData, totalCost: text })
            }
            placeholder="Task Cost"
          />
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
          <Text>Start Date:</Text>
          <Pressable
            onPress={() => {
              showStartDatePicker();
              setTaskData({ ...taskData, startDate: startDate });
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
            value={taskData.startDate}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />

            {startDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(startDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>

          <Text>Date of Completion:</Text>
          <Pressable
            onPress={() => {
              showEndDatePicker();
              setTaskData({ ...taskData, endDate: endDate });
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
            value={taskData.endDate}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />

            {endDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(endDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>End Date</Text>
            )}
          </Pressable>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text>Contractor:</Text>
          <TextInput
            style={styles.input}
            name="contractor"
            value={taskData.contractor}
            onChangeText={(text) =>
              setTaskData({ ...taskData, contractor: text })
            }
            placeholder="Contractor"
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

export default EditTask;

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
