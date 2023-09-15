import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const QuoteDetail = ({ navigation, route }) => {
  const [quoteData, setQuoteData] = useState({});

  useEffect(() => {
    setQuoteData({ ...route.params });
    navigation.setOptions({
      title: `${route.params.companyName} - ${route.params.customerName}`,
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{quoteData.companyName}</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Customer: </Text>
          <Text>{quoteData.customerName} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Items: </Text>
        </View>
        <FlatList
          data={quoteData.items}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Description: </Text>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Quantity: </Text>
                <Text>{item.qty}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Total Cost of Line: </Text>
                <Text>{item.totalCostOfLine}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Tax: </Text>
                <Text> {item.tax}%</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Discount: </Text>
                <Text>{item.discount}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Customer Details: </Text>
              </View>
              <Text>{item.cust_details}</Text>
            </View>
          )}
        />

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => navigation.navigate("Edit Quote")}
          >
            <Text style={styles.textStyle}>Edit Quote</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            // onPress={handleDeleteCompany}
          >
            <Text style={styles.textStyle}>Delete Quote</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default QuoteDetail;

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
