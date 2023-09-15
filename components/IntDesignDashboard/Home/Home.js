import React from "react";
import { View, Text, Button } from "react-native";

const Home = () => {
  return (
    <View>
      <Text>Home component</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          // onPress={() => navigation.navigate("About")}
          title="About"
        />
      </View>
    </View>
  );
};

export default Home;
