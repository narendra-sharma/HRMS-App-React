import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";

const initialCommissionData = {
  customerName: "",
  consultant: "",
  pointOfContact: "",
  projectLocation: "",
};

const EditCommission = ({ navigation }) => {
  const [commissionData, setCommissionData] = useState({});

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Project Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={commissionData.projectName}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, projectName: text })
            }
            placeholder="Project Name"
          />
          <Text>Total Commission:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={commissionData.totalCommission}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, totalCommission: text })
            }
            placeholder="Total Commission"
          />
          <Text>Amount Paid:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={commissionData.amountPaid}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, amountPaid: text })
            }
            placeholder="Amount Paid"
          />
          <Text>Amount Pending:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={commissionData.amountPending}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, amountPending: text })
            }
            placeholder="Amount Pending"
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditCommission;

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
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

  submitButton: {
    marginTop: 10,
    backgroundColor: "#055C9D",
    padding: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
