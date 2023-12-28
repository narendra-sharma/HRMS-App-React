import React from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import MonthlyCalendar from "../Calendar/MonthlyCalendar";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MonthlyCalendar />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", height: "100%", marginTop: -40 },

  scrollviewContainer: {
    backgroundColor: "#fff",
    height: "100%",
    marginTop: 80,
  },
});
