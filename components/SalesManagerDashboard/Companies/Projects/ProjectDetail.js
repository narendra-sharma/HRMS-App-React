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
    <View style={styles.centeredView}>
      <Text style={styles.item}>{projectData.companyName}</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Name: </Text>
        <Text> {projectData.projectName} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Consutant: </Text>
        <Text> {projectData.consultant} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Point of Contact: </Text>
        <Text> {projectData.pointOfContact} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Project Location: </Text>
        <Text> {projectData.projectLocation} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Tasks: </Text>
      </View>

      <TasksList tasks={route.params.tasks} navigation={navigation} />

      <View
        style={[
          styles.fieldContainer,
          // { backgroundColor: "pink", padding: 2, marginTop: -10 },
        ]}
      >
        <Text style={styles.fieldName}>Total cost of all tasks:</Text>
        <Text>{totalCost}</Text>
      </View>
      <View></View>

      <View style={styles.buttonsContainer}>
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
  );
};

export default ProjectDetail;

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
