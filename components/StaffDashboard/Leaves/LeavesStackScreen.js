import react from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import ApplyLeaves from "./ApplyLeaves";
import AllLeaves from "./AllLeaves";

const Stack = createNativeStackNavigator();

const LeavesStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="All Leaves">
      <Stack.Screen
        name="All Leaves"
        component={AllLeaves}
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
      <Stack.Screen name="Apply Leaves" component={ApplyLeaves} />
    </Stack.Navigator>
  );
};

export default LeavesStackScreen;
