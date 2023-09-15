import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { mockData } from "../MOCK_DATA";
import QuotesList from "./QuotesList";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EditQuote from "./EditQuote";
import AddQuote from "./AddQuote";
import QuoteDetail from "./QuoteDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const QuotesLayout = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Quote");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New Quote
        </Text>
      </Pressable>

      <QuotesList navigation={navigation} />
    </View>
  );
};

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
  jobs: [{}],
};

const ViewQuotes = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Quotes"
        component={QuotesLayout}
        options={({ navigation }) => ({
          headerLeft: () => (
            <MaterialIcons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      />
      <Stack.Screen name="Edit Quotes" component={EditQuote} />
      <Stack.Screen name="Add Quote" component={AddQuote} />
      <Stack.Screen name="Quote Details" component={QuoteDetail} />
    </Stack.Navigator>
  );
};

export default ViewQuotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
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

  buttonClose: {
    backgroundColor: "#055C9D",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
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
