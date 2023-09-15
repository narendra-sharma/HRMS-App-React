import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { mockUsers } from "./MockUsers";

const UsersList = ({ navigation }) => {
  const [usersList, setUsersList] = useState(mockUsers);
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
              <View>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.subText}>Email/Username: {item.email}</Text>
              </View>

              <Icon name="angle-right" size={28} />
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
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "92%",
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

  subText: {
    fontSize: 12,
  },
});
