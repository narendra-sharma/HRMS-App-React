import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import TasksList from "./Tasks/TaskList";
import { useFocusEffect } from "@react-navigation/native";

const ProjectDetail = ({ navigation, route }) => {
  const [projectData, setProjectData] = useState({ consultant: "" });
  const [consultant, setConsultant] = useState("");
  const [customer, setCustomer] = useState("");
  const [company, setCompany] = useState("");
  const [users, setUsers] = useState([]);

  const [totalCost, setTotalCost] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllData = async () => {
        try {
          const res = await apiGetPreFilledProjectDetails(route.params.id);
          setProjectData({ ...res.data.project });

          const tempConsultant = res.data.consultant.filter(
            (consultant) => consultant.id == projectData.consultant_id
          );
          setConsultant(
            res.data.consultant[
              res.data.consultant.findIndex(
                (consultant) => consultant.id == projectData.consultant_id
              )
            ].name
          );

          const tempCustomer = res.data.customers.filter(
            (customer) => customer.id == projectData.customer_id
          );
          setCustomer(tempCustomer[0].name);

          const tempCompany = res.data.companies.filter(
            (company) => company.id == projectData.company_id
          );
          setCompany(tempCompany[0].name);
        } catch (error) {
          console.log(error);
        }
      };

      getAllData();
      return () => (isActive = false);
    }, [])
  );

  useEffect(() => {
    setProjectData({
      ...projectData,
      company: company,
      customer: customer,
      consultant: consultant,
    });
  }, [company, customer, consultant]);

  return (
    <View style={styles.centeredView}>
      <Text style={styles.item}>{projectData.companyName}</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Name: </Text>
        <Text> {projectData.project_name} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Consultant: </Text>
        <Text> {projectData.consultant} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Customer: </Text>
        <Text> {consultant} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Company: </Text>
        <Text> {company} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Phone Number: </Text>
        <Text> {projectData.contact_number} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Project Location: </Text>
        <Text> {projectData.address} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Start Date: </Text>
        <Text> {projectData.start_date} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Deadline: </Text>
        <Text> {projectData.end_date} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Description: </Text>
        <Text> {projectData.description} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Total Estimated Hours: </Text>
        <Text> {projectData.estimated_hours} </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Billing Type: </Text>
        <Text> {projectData.billing_type} </Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Tasks: </Text>
      </View>

      <TasksList tasks={route.params.tasks} navigation={navigation} />

      <View
        style={[
          styles.fieldContainer,
          // { backgroundColor: "pink", padding: 2, marginTop: -10 },
        ]}
      >
        <Text style={styles.fieldName}>Total cost of all tasks:</Text>
        <Text>{totalCost}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text
            style={styles.textStyle}
            onPress={() =>
              navigation.navigate("Edit Project", { id: projectData.id })
            }
          >
            Edit Project Details
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Project</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
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

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
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
