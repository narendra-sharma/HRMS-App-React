import { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProjectsList from "./Projects/ProjectsList";
import QuotesList from "./Quotes/QuotesList";
import {
  apiDeleteCompany,
  apiGetCompanyDetails,
} from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";
import CommissionsList from "./Commissions/CommissionsList";
import UsersList from "./User/UserList";

const initialCompanyData = {
  companyName: "",
  email: "",
  phoneNo: "",
  address: "Indian bank, jhujhar nagar",
};

const CompanyInfo = ({ companyData, navigation }) => {
  // const handleDeleteCompany = async () => {
  //   const deleteCompany = async () => {
  //     try {
  //       const res = await apiDeleteCompany(route.params.id);
  //       console.log(res.data);
  //       if (res.data.message == "Deleted successfully") {
  //         ToastAndroid.show("Company Deleted Successfully", ToastAndroid.SHORT);
  //         navigation.navigate("All Companies");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   Alert.alert(
  //     `Delete ${companyData.name}`,
  //     `Are you sure you want to delete ${companyData.name}?`,
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel",
  //       },
  //       { text: "OK", onPress: () => deleteCompany() },
  //     ]
  //   );
  // };

  return (
    <View style={styles.companyContainer}>
      <View style={styles.innerCompanyContainer}>
        {/* <Text style={styles.heading}>{companyData?.name}</Text> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Name: </Text>
          <Text>{companyData?.name}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Email: </Text>
          <Text>{companyData?.email}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Phone Number: </Text>
          <Text>{companyData?.phoneNo}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Location: </Text>
          <Text style={styles.wrapField}>{companyData?.address}</Text>
        </View>
      </View>

      {/* <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() =>
            navigation.navigate("Edit Company Details", companyData)
          }
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text style={styles.textStyle}>Edit Company Details</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleDeleteCompany}>
          <Text style={styles.textStyle}>Delete Company</Text>
        </Pressable>
      </View> */}
    </View>
  );
};

const CompanyDetail = ({ navigation, route }) => {
  const [companyData, setCompanyData] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getCompanyDetails = async () => {
        try {
          const res = await apiGetCompanyDetails(route.params.id);
          // console.log(res.data);
          navigation.setOptions({
            title: res.data.data.name,
          });
          setCompanyData(res.data.data);
        } catch (error) {
          console.log(error);
        }
      };
      getCompanyDetails();

      return () => (isActive = false);
    }, [])
  );

  const tabsData = [
    {
      name: "Details",
    },
    {
      name: "Projects",
    },
    {
      name: "Quotes",
    },
    {
      name: "All Tasks",
    },
    {
      name: "Commissions",
    },
    {
      name: "Users",
    },
    // {
    //   name: "Analytics",
    // },
  ];

  const renderTabOptions = () => {
    switch (selectedTab) {
      case 0:
        return (
          <CompanyInfo companyData={companyData} navigation={navigation} />
        );
      case 1:
        return <ProjectsList navigation={navigation} />;
      case 2:
        return <QuotesList navigation={navigation} />;
      case 3:
        return <Text>Tasks</Text>;
      case 4:
        return <CommissionsList navigation={navigation} />;
      case 5:
        return <UsersList navigation={navigation} />;
      // case 6:
      //   return <Text>Analytics</Text>;
      default:
        return <Text>case default</Text>;
    }
  };

  // console.log(route.params);

  return (
    <View style={styles.centeredView}>
      <View style={styles.scrollBoxContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          horizontal={true}
        >
          {tabsData.map((tab, index) => {
            return (
              <Pressable
                key={index}
                style={
                  selectedTab === index
                    ? [styles.scrollBox, styles.tabActive]
                    : styles.scrollBox
                }
                onPress={() => setSelectedTab(index)}
              >
                <Text>{tab.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={styles.angleRight}>
          <Icon name="angle-right" size={20} />
        </Text>
      </View>

      {/* <View style={styles.innerContainer}> */}
      {renderTabOptions()}
      {/* </View> */}
    </View>
  );
};

export default CompanyDetail;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    padding: 10,
    transition: "0.2s",
  },

  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  scrollBoxContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    // paddingTop: 10,
    height: 80,
    marginVertical: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignContent: "center",
  },

  scrollContainer: {
    // backgroundColor: "yellow",
  },

  tabActive: {
    borderBottomWidth: 1,
    transition: "0.2s",
    // backgroundColor: "yellow",
    borderBottomColor: "#055C9D",
  },

  scrollBox: {
    height: 24,
    // backgroundColor: "#1faadb",
    margin: 5,
    // padding: 2,
  },

  angleRight: {
    // backgroundColor: "red",
    marginLeft: 10,
  },

  companyContainer: {
    paddingHorizontal: 16,
    display: "flex",
    height: "80%",
    flexDirection: "column",
    justifyContent: "space-between",
    // borderWidth: 1,
  },

  innerCompanyContainer: {
    // borderWidth: 1,
  },

  heading: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
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

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  wrapField: {
    flex: 1,
    flexWrap: "wrap",
  },
});
