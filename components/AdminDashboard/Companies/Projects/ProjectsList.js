import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import { mockProjects } from "./MockProjects";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { apiDeleteProject, apiGetAllProjects } from "../../../../apis/projects";

const ProjectsList = ({ navigation, companyId }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllProjects = async () => {
        const res = await apiGetAllProjects();
        console.log("projects", res.data.projects);
        //listing of quotes for a specific company
        if (companyId) {
          const projects = res.data.projects.filter(
            (project) => project.company_id == companyId
          );
          setProjectsList(projects);
        } else {
          //listing all projects
          setProjectsList(res.data.projects);
        }
      };

      getAllProjects();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  const handleDelete = async (name, id) => {
    const deleteProject = async () => {
      try {
        const res = await apiDeleteProject(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Project Deleted Successfully", {
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
    Alert.alert(`Delete ${name}`, `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteProject() },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={projectsList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Project Details", item);
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.project_name}</Text>
              <View style={styles.iconsContainer}>
                <Icon
                  onPress={() => navigation.navigate("Edit Project", item)}
                  name="pen"
                  size={22}
                  // color="blue"
                />
                <Icon
                  onPress={() => handleDelete(item.project_name, item.id)}
                  name="trash-alt"
                  size={22}
                  color="red"
                />
              </View>
            </Pressable>
          </>
        )}
      />
    </View>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor: "pink",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
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
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "20%",
    justifyContent: "space-between",
  },
});
