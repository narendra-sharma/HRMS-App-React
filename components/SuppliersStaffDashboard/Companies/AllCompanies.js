import { useEffect, useState, useCallback } from "react";
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
import { mockData } from "./MOCK_DATA";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
import { apiGetAllCompanies } from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";

const AllCompanies = ({ navigation }) => {
  const [companiesList, setCompaniesList] = useState(mockData);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllCompanies = async () => {
        try {
          const res = await apiGetAllCompanies();
          console.log(res.data.data);
          setCompaniesList([...res.data.data]);
        } catch (err) {
          console.log(err);
        }
      };

      getAllCompanies();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const res = await apiGetAllCompanies();
        console.log(res.data.data);
        setCompaniesList([...res.data.data]);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCompanies();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={companiesList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Company Details", { id: item.id });
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.name}</Text>
              <Icon name="angle-right" size={28} />
            </Pressable>
          </>
        )}
      />
    </ScrollView>
  );
};

export default AllCompanies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "pink",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
    height: "80%",
    padding: 20,
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
    height: "80%",
  },

  button: {
    margin: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "40%",
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

  input: {
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },

  addButton: {
    margin: 5,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
