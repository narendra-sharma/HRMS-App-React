import React from "react";
import { View, Text } from "react-native";
import QuotesList from "./QuotesList";

const ViewQuotes = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>All Quotes</Text>
      <QuotesList navigation={navigation} />
    </View>
  );
};

export default ViewQuotes;
