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
import EditProject from "./Projects/EditProject";
import QuoteDetail from "./Quotes/QuoteDetail";
import ProjectDetail from "./Projects/ProjectDetail";
import TaskDetail from "./Projects/Tasks/TaskDetail";
import EditTask from "./Projects/Tasks/EditTask";
import AddCompany from "./AddCompany";
import ViewCommissions from "./Commissions/ViewCommissions";
import CommissionDetail from "./Commissions/CommissionDetail";
import EditCommission from "./Commissions/EditCommission";
import ViewUsers from "./Users/ViewUsers";
import UserDetail from "./Users/UserDetails";
import EditUser from "./Users/EditUser";
import AddUser from "./Users/AddUser";
import AddQuote from "./Quotes/AddQuote";
import EditQuote from "./Quotes/EditQuote";
import AddProject from "./Projects/AddProject";

const Stack = createNativeStackNavigator();

const DropdownMenu = ({ navigation }) => {
  const [value, setValue] = useState(null);

  const data = [
    { label: "Projects", value: "View Projects" },
    { label: "View Quotes", value: "View Quotes" },
    { label: "All Tasks", value: "All Tasks" },
    { label: "Commissions", value: "Commissions" },
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
          headerRight: () => <DropdownMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Add Company"
        component={AddCompany}
        options={({ navigation }) => ({
          title: "Add New Company",
          // headerShown: false,
          // headerRight: () => <DropdownMenu navigation={navigation} />,
          // headerRight: () => <MaterialIcon name="dots-vertical" size={30} />,
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
        name="Edit Company Details"
        component={EditCompanyDetails}
      />
      {/* <Stack.Screen
        name="Projects"
        component={ViewProjects}
        options={({ navigation }) => ({
          title: "My Projects",
        })}
      /> */}
      <Stack.Screen
        name="Add Project"
        component={AddProject}
        options={({ navigation }) => ({
          title: "Add Project",
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
        name="View Quotes"
        component={ViewQuotes}
        options={({ navigation }) => ({
          title: "All Quotes",
        })}
      />
      <Stack.Screen
        name="Add Quote"
        component={AddQuote}
        options={({ navigation }) => ({
          title: "Quotes",
        })}
      />
      <Stack.Screen
        name="Edit Quote"
        component={EditQuote}
        options={({ navigation }) => ({
          title: "Edit Quote",
        })}
      />
      <Stack.Screen
        name="Quote Details"
        component={QuoteDetail}
        options={({ navigation }) => ({
          title: "Quote Detail",
        })}
      />
      <Stack.Screen name="Commissions" component={ViewCommissions} />
      <Stack.Screen name="Commission Details" component={CommissionDetail} />
      <Stack.Screen name="Edit Commission" component={EditCommission} />
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
      <Stack.Screen
        name="Edit User"
        component={EditUser}
        options={({ navigation }) => ({
          title: "Edit User",
        })}
      />
      <Stack.Screen
        name="Add User"
        component={AddUser}
        options={({ navigation }) => ({
          title: "Add New User",
          // headerShown: false,
          // headerRight: () => <DropdownMenu navigation={navigation} />,
          // headerRight: () => <MaterialIcon name="dots-vertical" size={30} />,
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
