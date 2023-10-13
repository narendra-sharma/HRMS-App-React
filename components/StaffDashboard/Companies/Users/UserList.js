import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { mockUsers } from "./MockUsers";

const UsersList = ({ navigation, usersList }) => {
  // const [usersList, setUsersList] = useState(mockUsers);
  useEffect(() => {}, [usersList]);

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={usersList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("User Details", item);
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              {/* <View>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.subText}>Email/Username: {item.email}</Text>
              </View>

              <Icon name="angle-right" size={28} /> */}
              <View>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.subText}>Email: {item.email}</Text>
              </View>

              <View style={styles.iconsContainer}>
                <Icon
                  onPress={() => navigation.navigate("Edit User", item)}
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
          </>
        )}
      />
    </View>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "pink",
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
