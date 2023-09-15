import { useState, useCallback, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiGetAllUsers } from "../../../apis/companies";
import AccountsList from "./AccountsList";

const AllAccounts = ({ navigation }) => {
  const [consultantsList, setConsultantsList] = useState([]);
  const [consultantManagersList, setConsultantManagersList] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const tempCm = users.filter((user) => user.user_type == 3);
    setConsultantManagersList([...tempCm]);

    const tempConsults = users.filter((user) => user.user_type == 4);
    setConsultantsList([...tempConsults]);

    const tempContractors = users.filter((user) => user.user_type == 5);
    setContractorList([...tempContractors]);

    const tempCustomers = users.filter((user) => user.user_type == 6);
    setContractorList([...tempCustomers]);

    console.log("c m: ", consultantManagersList);
  }, [users]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllUsers = async () => {
        try {
          const res = await apiGetAllUsers();
          console.log(res.data.data);
          setUsers([...res.data.data]);
        } catch (err) {
          console.log(err);
        }
      };

      getAllUsers();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text> Consultant managers:</Text>
      {consultantManagersList.length > 0 && (
        <AccountsList
          navigation={navigation}
          usersList={consultantManagersList}
        />
      )}

      <Text>Consultants:</Text>
      {consultantsList.length > 0 && (
        <AccountsList navigation={navigation} usersList={consultantsList} />
      )}

      <Text>Contractors:</Text>
      {contractorList.length > 0 && (
        <AccountsList navigation={navigation} usersList={contractorList} />
      )}

      <Text>Customers:</Text>
      {customersList.length > 0 && (
        <AccountsList navigation={navigation} usersList={consultantsList} />
      )}
    </ScrollView>
  );
};

export default AllAccounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    // width: "100%",
    // height: "100%",
    padding: 12,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
