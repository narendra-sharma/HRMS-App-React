import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const TaskDetail = ({ navigation, route }) => {
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    setTaskData({ ...route.params });
    navigation.setOptions({
      title: `Task - ${route.params.taskName}`,
    });
  }, []);

  return (
    <View style={styles.centeredView}>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Task: </Text>
        <Text> {taskData.taskName} </Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Status: </Text>
        <Text>{taskData.status}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Tag: </Text>
        <Text>{taskData.tag}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Task Description: </Text>
      </View>
      <Text>{taskData.description}</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Task Cost: </Text>
        <Text>{taskData.cost}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Start Date: </Text>
        <Text>{taskData.startDate}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Date of Completion: </Text>
        <Text>{taskData.completionDate}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Contractor: </Text>
        <Text>{taskData.contractor}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit Task")}
        >
          <Text style={styles.textStyle}>Edit Task Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Task</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TaskDetail;

const styles = StyleSheet.create({
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
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
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
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
