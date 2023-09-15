import react from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import AllAccounts from "./AllAccounts";
import EditAccount from "./EditAccount";
import AccountDetails from "./AccountDetails";

const Stack = createNativeStackNavigator();

const AccountsStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Accounts"
        component={AllAccounts}
        options={({ navigation }) => ({
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
        name="Account Details"
        component={AccountDetails}
        options={({ navigation }) => ({
          title: "Account Details",
        })}
      />
      <Stack.Screen
        name="Edit Account"
        component={EditAccount}
        options={({ navigation }) => ({
          title: "Edit Account",
        })}
      />
    </Stack.Navigator>
  );
};

export default AccountsStackScreen;
