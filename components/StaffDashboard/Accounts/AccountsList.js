import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";

const randomHexColor = () => {
  return "#b7d0d1";
};

const AccountsList = ({ navigation, usersList }) => {
  const [list, setList] = useState(usersList);
  const [deleteFlag, setDeteleFlag] = useState(false);
  console.log("users list", usersList[0].name);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleRadius, setRippleRadius] = useState(10);
  const [rippleOverflow, setRippleOverflow] = useState(true);

  const handleDelete = async (name, id) => {
    // const deleteProject = async () => {
    //   try {
    //     const res = await apiDeleteProject(id);
    //     console.log(res.data);
    //     if (res.data.message == "Deleted successfully") {
    //       setDeteleFlag((prev) => !prev);
    //       ToastAndroid.show("Project Deleted Successfully", ToastAndroid.SHORT);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // Alert.alert(`Delete ${name}`, `Are you sure you want to delete ${name}?`, [
    //   {
    //     text: "Cancel",
    //     onPress: () => console.log("Cancel Pressed"),
    //     style: "cancel",
    //   },
    //   { text: "OK", onPress: () => deleteProject() },
    // ]);
  };

  return (
    // <Text> Users List</Text>
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={usersList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Account Details", item);
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.name}</Text>
              <View style={styles.iconsContainer}>
                <Icon
                  onPress={() => navigation.navigate("Edit Account", item)}
                  name="pen"
                  size={22}
                  // color="blue"
                />
                <Icon
                  onPress={() => handleDelete(item.project_name, item.id)}
                  name="trash-alt"
                  size={22}
                  color="red"
                />
              </View>
            </Pressable>
          </>
        )}
      />
    </View>
  );
};

export default AccountsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    // height: "100%",
    // backgroundColor: "pink",
  },
  listItem: {
    backgroundColor: "#fff",
    // margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    padding: 10,
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
});
