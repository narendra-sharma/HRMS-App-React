import { Text, View } from "react-native";
import RightDrawer from "../components/StaffDashboard/RightDrawer/RightDrawer";

const StaffScreen = ({ navigation }) => {
  return (
    // <View>
    //   <Text>Staff Screen</Text>
    // </View>
    <RightDrawer navigation={navigation} />
  );
};

export default StaffScreen;
