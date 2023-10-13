import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import ProjectsList from "./ProjectsList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EditProject from "./EditProject";
import AddProject from "./AddProject";
import ProjectDetail from "./ProjectDetail";
import MonthlyCalendar from "../Calendar/MonthlyCalendar";

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
  jobs: [{}],
};

const Stack = createNativeStackNavigator();

const ProjectsLayout = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Project");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewContainer}
        keyboardShouldPersistTaps="always"
      >
        <ProjectsList navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const ViewProjects = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Projects"
        component={ProjectsLayout}
        options={({ navigation }) => ({
          headerLeft: () => (
            <MaterialIcons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Edit Project"
        component={EditProject}
        options={({ navigation }) => ({
          headerTitle: "Assign Employees",
        })}
      />
      <Stack.Screen name="Add Project" component={AddProject} />
      <Stack.Screen name="Project Details" component={ProjectDetail} />
      <Stack.Screen
        options={({ navigation }) => ({
          //   drawerIcon: () => <Icon name="calendar" size={28} />,
          //   title: "Calendar",
          //   headerShown: true,
          headerTitle: "Project Calendar",
          //   headerTransparent: true,
          //   drawerItemStyle: { display: "none" },
        })}
        name="View Calendar"
        component={MonthlyCalendar}
      />
    </Stack.Navigator>
  );
};

export default ViewProjects;

const styles = StyleSheet.create({
  scrollviewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 18,
    // alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: 16,
    minWidth: "90%",
    maxWidth: "90%",
  },

  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
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
