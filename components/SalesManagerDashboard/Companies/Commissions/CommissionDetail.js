import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const CommissionDetail = ({ navigation, route }) => {
  const [commissionData, setCommissionData] = useState({});

  useEffect(() => {
    setCommissionData({ ...route.params });
    navigation.setOptions({
      title: `Commission - ${route.params.projectName}`,
    });
  }, []);

  return (
    <View style={styles.centeredView}>
      <View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Company Name: </Text>
          <Text style={styles.item}>{commissionData.companyName}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Name: </Text>
          <Text>{commissionData.projectName} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Total Commission: </Text>
          <Text>{commissionData.totalCommission} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Amount Paid: </Text>
          <Text>{commissionData.amountPaid} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Amount Pending: </Text>
          <Text>{commissionData.amountPending} </Text>
        </View>
      </View>

      {/* <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          //  onPress={() => navigation.navigate("Edit Project")}
        >
          <Text style={styles.textStyle}>View Transaction History</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit Commission")}
        >
          <Text style={styles.textStyle}>Edit Commission Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Commission</Text>
        </Pressable>
      </View> */}
    </View>
  );
};

export default CommissionDetail;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
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

  item: {
    padding: 10,
    fontSize: 16,
  },

  listItem: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
});
