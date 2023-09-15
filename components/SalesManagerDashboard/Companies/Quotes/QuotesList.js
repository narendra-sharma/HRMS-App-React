import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { MockQuotes } from "./MockQuotes";
import Icon from "react-native-vector-icons/FontAwesome5";

const QuotesList = ({ navigation }) => {
  const [quotesList, setQuotesList] = useState(MockQuotes);

  useEffect(() => {}, [quotesList]);

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={quotesList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Quote Details", item)}
            style={styles.listItem}
          >
            <Text style={styles.item}>{item.customerName}</Text>
            <Icon name="angle-right" size={28} />
          </Pressable>
        )}
      />
    </View>
  );
};

export default QuotesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "83.5%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  item: {
    padding: 10,
    fontSize: 16,
  },

  addButton: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
