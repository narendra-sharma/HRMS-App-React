import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import RightDrawer from "../components/IntDesignDashboard/RightDrawer/RightDrawer";

const IntDesignDashScreen = ({ navigation }) => {
  return <RightDrawer navigation={navigation} />;
};

export default IntDesignDashScreen;
