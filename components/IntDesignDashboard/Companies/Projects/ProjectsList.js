import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { mockProjects } from "./MockProjects";
import Icon from "react-native-vector-icons/FontAwesome5";

const ProjectsList = ({ navigation }) => {
  const [projectsList, setProjectsList] = useState(mockProjects);
  useEffect(() => {}, [projectsList]);

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={projectsList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Project Details", item);
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.projectName}</Text>
              <Icon name="angle-right" size={28} />
            </Pressable>
          </>
        )}
      />
    </View>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor: "pink",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "77%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  item: {
    padding: 4,
    fontSize: 16,
  },
});
