import react from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import QRCodeGenerator from "./QRCodeGenerator";
import QRMainScreen from "./QRMainScreen";
import QRScanner from "./QRScanner";

const Stack = createNativeStackNavigator();

const QRStackScreen = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="QR Code Main Screen"
        component={QRMainScreen}
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
      /> */}
      <Stack.Screen
        name="Scan QR Code"
        component={QRScanner}
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
      {/* <Stack.Screen name="Generate QR Code" component={QRCodeGenerator} /> */}
    </Stack.Navigator>
  );
};

export default QRStackScreen;
