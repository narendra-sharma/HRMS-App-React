import React from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useCustomDrawerStatus } from "../../../Contexts/DrawerStatusContext";
import ProjectsList from "../Projects/ProjectsList";

const Home = ({ navigation }) => {
  // const isDrawerOpen = useDrawerStatus();

  // const { setDrawerStatus } = useCustomDrawerStatus();
  // console.log(isDrawerOpen);
  // setDrawerStatus(isDrawerOpen);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewContainer}
        keyboardShouldPersistTaps="always"
      >
        <ProjectsList navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollviewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 18,
    // alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: 16,
    minWidth: "90%",
    maxWidth: "90%",
  },
});
