import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import TasksList from "./Tasks/TaskList";

const ProjectDetail = ({ navigation, route }) => {
  const [projectData, setProjectData] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setProjectData({ ...route.params });
    navigation.setOptions({
      title: `Project - ${route.params.projectName}`,
    });
  }, []);

  useEffect(() => {
    const costArr = projectData?.tasks?.map((task, index) => {
      return Number(task.cost.slice(1));
    });
    console.log("cost arr: ", costArr);
    const sumOfCosts = costArr?.reduce(
      (prevCost, currCost, index) => prevCost + currCost,
      0
    );
    setTotalCost(sumOfCosts);
  }, [projectData]);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{projectData.companyName}</Text>
        <View>
          <Text>Name: {projectData.projectName} </Text>
        </View>
        <View>
          <Text>Consutant: {projectData.consultant} </Text>
        </View>
        <View>
          <Text>Point of Contact: {projectData.pointOfContact} </Text>
        </View>
        <View>
          <Text>Project Location: {projectData.projectLocation} </Text>
        </View>

        <Text>Tasks: </Text>
        <TasksList tasks={route.params.tasks} navigation={navigation} />

        <View>
          <Text>Total cost of all tasks: {totalCost}</Text>
        </View>

        <View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            // onPress={() => setIsCompanyEditOn(true)}
          >
            <Text
              style={styles.textStyle}
              onPress={() => navigation.navigate("Edit Project")}
            >
              Edit Project Details
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            // onPress={handleDeleteCompany}
          >
            <Text style={styles.textStyle}>Delete Project</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProjectDetail;

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
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  buttonClose: {
    backgroundColor: "#B76E79",
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
    backgroundColor: "#B76E79",
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