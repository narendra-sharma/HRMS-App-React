import React, { useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Agenda, AgendaList, CalendarProvider } from "react-native-calendars";

const MonthlyAgenda = () => {
  const [items, setItems] = useState({
    "2023-09-17": [{ name: "item 1" }],
    "2023-09-18": [{ name: "item 2" }],
    "2023-09-23": [],
    "2023-09-25": [{ name: "item 3 " }, { name: "any js object" }],
  });

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Text> {item.name} </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda items={items} renderItem={renderItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default MonthlyAgenda;
