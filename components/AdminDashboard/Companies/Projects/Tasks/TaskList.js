import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const TasksList = ({ navigation, tasks = [] }) => {
  const [taskList, setTasksList] = useState([...tasks]);
  // console.log(taskList);
  useEffect(() => {}, [taskList]);

  //ok, so we gotta sort the task according to the status
  function sortTasks(a, b) {
    if (a.status == b.status) {
      return a.date - b.date;
    } else if (a.status == "to do" && b.status !== "to do") {
      return -1;
    } else if (b.status == "to do" && a.status !== "to do") {
      return 1;
    } else if (a.status == "in progress" && b.status !== "in progress") {
      return -1;
    } else if (b.status == "in progress" && a.status !== "in progress") {
      return 1;
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={taskList.sort(sortTasks)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("Task Detail", item);
              // navigation.setOptions({ title: "Updated!" });
            }}
            style={
              (item.status == "completed" && [
                styles.listItem,
                { backgroundColor: "lightgreen" },
              ]) ||
              (item.status == "in progress" && [
                styles.listItem,
                { backgroundColor: "lightblue" },
              ]) ||
              (item.status == "to do" && [
                styles.listItem,
                { backgroundColor: "orange" },
              ])
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                style={{ marginRight: 8 }}
                name="clipboard-list"
                size={30}
              />
              <View>
                <Text style={styles.item}>Name: {item.taskName}</Text>
                <Text style={styles.subText}>Status: {item.status}</Text>
              </View>
            </View>
            <View style={styles.iconsContainer}>
              <Icon
                onPress={() => navigation.navigate("Edit Task", item)}
                name="pen"
                size={22}
                // color="blue"
              />
              <Icon
                // onPress={() => handleDelete(item.name, item.id)}
                name="trash-alt"
                size={22}
                color="red"
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default TasksList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "pink",
  },

  button: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  item: {
    fontSize: 16,
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "20%",
    justifyContent: "space-between",
  },

  subText: {
    fontSize: 12,
  },
});
