import { useState } from "react";
import CompanyDetail from "./CompanyDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllCompanies from "./AllCompanies";
import Icon from "react-native-vector-icons/MaterialIcons";
import EditCompanyDetails from "./EditCompanyDetails";
import ViewProjects from "./Projects/ViewProjects";
import { Text, StyleSheet } from "react-native";
import { default as MaterialIcon } from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import ViewQuotes from "./Quotes/ViewQuotes";
// import AllTasks from "./Tasks/AllTasks";
import ViewCommissions from "../Commissions/ViewCommissions";
import EditProject from "./Projects/EditProject";
import QuoteDetail from "./Quotes/QuoteDetail";
import ProjectDetail from "./Projects/ProjectDetail";
import TaskDetail from "./Projects/Tasks/TaskDetail";
import EditTask from "./Projects/Tasks/EditTask";
import AddCompany from "./AddCompany";

const Stack = createNativeStackNavigator();

const SettingsStack = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Companies"
        component={AllCompanies}
        options={({ navigation }) => ({
          title: "All Companies",
          // headerShown: false,
          headerLeft: () => (
            <Icon
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Add Company"
        component={AddCompany}
        options={({ navigation }) => ({
          title: "Add Company",
          // headerShown: false,
          // headerRight: () => <DropdownMenu navigation={navigation} />,
          // headerRight: () => <MaterialIcon name="dots-vertical" size={30} />,
        })}
      />
      <Stack.Screen
        name="Edit Company Details"
        component={EditCompanyDetails}
      />
      <Stack.Screen
        name="Projects"
        component={ViewProjects}
        options={({ navigation }) => ({
          title: "My Projects",
        })}
      />
      <Stack.Screen
        name="Project Details"
        component={ProjectDetail}
        options={({ navigation }) => ({
          title: "Project Details",
        })}
      />
      <Stack.Screen
        name="Edit Project"
        component={EditProject}
        options={({ navigation }) => ({
          title: "Edit Project",
        })}
      />
      <Stack.Screen
        name="Task Detail"
        component={TaskDetail}
        options={({ navigation }) => ({
          title: "Task Detail",
        })}
      />
      <Stack.Screen
        name="Edit Task"
        component={EditTask}
        options={({ navigation }) => ({
          title: "Edit Task",
        })}
      />
      <Stack.Screen
        name="Quote Details"
        component={QuoteDetail}
        options={({ navigation }) => ({
          title: "Quotes",
        })}
      />
      <Stack.Screen
        name="View Quotes"
        component={ViewQuotes}
        options={({ navigation }) => ({
          title: "Quotes",
        })}
      />
      <Stack.Screen
        name="Edit Quote"
        component={EditProject}
        options={({ navigation }) => ({
          title: "Edit Quote",
        })}
      />
      <Stack.Screen name="Commissions" component={ViewCommissions} />
    </Stack.Navigator>
  );
};

export default SettingsStack;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
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
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
    display: "none",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
    width: 50,
  },
  listStyle: {
    width: 200,
    // padding: 10,
    // marginRight: 50,
    position: "absolute",
    left: 190,
    top: 85,
  },
});
