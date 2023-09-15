import { useState } from "react";
import CompanyDetail from "./CompanyDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllCompanies from "./AllCompanies";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewProjects from "./Projects/ViewProjects";
import { Text, StyleSheet } from "react-native";
import { default as MaterialIcon } from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
// import AllTasks from "./Tasks/AllTasks";
import ProjectDetail from "./Projects/ProjectDetail";
import TaskDetail from "./Projects/Tasks/TaskDetail";
import EditTask from "./Projects/Tasks/EditTask";
import ViewUsers from "./User/ViewUsers";
import UserDetail from "./User/UserDetails";

const Stack = createNativeStackNavigator();

const DropdownMenu = ({ navigation }) => {
  const [value, setValue] = useState(null);

  const data = [
    { label: "Projects", value: "View Projects" },
    { label: "All Tasks", value: "All Tasks" },
    { label: "View Users", value: "View Users" },
    { label: "View Projects", value: "View Projects" },
  ];
  return (
    <Dropdown
      style={styles.dropdown}
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
        // console.log(navigation);
        navigation.navigate(item.label);
      }}
      renderRightIcon={() => <MaterialIcon name="dots-vertical" size={30} />}
    />
  );
};

const CompanyStackScreen = ({ navigation }) => {
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
        name="Company Details"
        component={CompanyDetail}
        options={({ navigation }) => ({
          title: "Company Details",
          // headerShown: false,
          headerRight: () => <DropdownMenu navigation={navigation} />,
          // headerRight: () => <MaterialIcon name="dots-vertical" size={30} />,
        })}
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
        name="View Projects"
        component={ViewProjects}
        options={({ navigation }) => ({
          title: "View Projects",
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
        name="View Users"
        component={ViewUsers}
        options={({ navigation }) => ({
          title: "All Users",
        })}
      />
      <Stack.Screen
        name="User Details"
        component={UserDetail}
        options={({ navigation }) => ({
          title: "User Details",
        })}
      />
    </Stack.Navigator>
  );
};

export default CompanyStackScreen;

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
