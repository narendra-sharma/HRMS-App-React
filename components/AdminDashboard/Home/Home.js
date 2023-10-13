import React from "react";
import { View, Text, Button } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useCustomDrawerStatus } from "../../../Contexts/DrawerStatusContext";

const Home = () => {
  // const isDrawerOpen = useDrawerStatus();

  // const { setDrawerStatus } = useCustomDrawerStatus();
  // console.log(isDrawerOpen);
  // setDrawerStatus(isDrawerOpen);

  return (
    <View>
      <Text>Admin Dashboard</Text>
    </View>
  );
};

export default Home;
