import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { mockCommissions } from "./MockCommissions";

const CommissionsList = ({ navigation }) => {
  const [commissionsList, setCommissionsList] = useState(mockCommissions);
  useEffect(() => {}, [commissionsList]);

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={commissionsList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Commission Details", item);
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

export default CommissionsList;

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
    width: "76%",
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
