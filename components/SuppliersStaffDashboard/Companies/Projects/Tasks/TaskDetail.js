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
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{taskData.companyName}</Text>

        <View>
          <Text>Task: {taskData.taskName} </Text>
        </View>
        <View>
          <Text>Status: {taskData.status}</Text>
        </View>
        <View>
          <Text>Tag: {taskData.tag}</Text>
        </View>
        <View>
          <Text>Task Description: {taskData.description}</Text>
        </View>
        <View>
          <Text>Task Cost: {taskData.cost}</Text>
        </View>
        <View>
          <Text>Start Date: {taskData.startDate}</Text>
        </View>
        <View>
          <Text>Date of Completion: {taskData.completionDate}</Text>
        </View>
        <View>
          <Text>Contractor: {taskData.contractor}</Text>
        </View>

        <View>
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
    </View>
  );
};

export default TaskDetail;

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

  scrollBoxContainer: {
    // display: "flex",
    // flexDirection: "row",
    backgroundColor: "pink",
    // position: "relative",
    paddingTop: 10,
    height: 80,
    marginVertical: 15,
  },

  tabActive: {
    backgroundColor: "yellow",
  },

  scrollBox: {
    height: 24,
    backgroundColor: "#1faadb",
    margin: 5,
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
    // margin: 10,
    padding: 15,
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
