import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TouchableNativeFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { apiDeleteUser, apiGetUsersFromUsers } from "../../../../../apis/users";
import Toast from "react-native-root-toast";

const randomHexColor = () => {
  return "#b7d0d1";
};

const AllConsultants = ({ navigation }) => {
  const [consultantList, setConsultantList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleRadius, setRippleRadius] = useState(10);
  const [rippleOverflow, setRippleOverflow] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getConsultantManagers = async () => {
        const res = await apiGetUsersFromUsers();
        console.log(res.data);
        // console.log(res.data.data);

        setConsultantList([...res.data.consultants]);
      };

      getConsultantManagers();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  //function to delete the user
  const handleDelete = async (user, userId) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteUser(userId);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("User Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          // navigation.navigate("All Companies");
        }
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(`Delete ${user}`, `Are you sure you want to delete ${user}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteUser() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Consultant");
          // setAddCompanyModalVisible(true);
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        // style={{ height: 100 }}
        data={consultantList}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.listItem}>
              <Pressable
                style={{ width: "76%" }}
                onPress={() => {
                  navigation.navigate("Consultant Details", { id: item.id });
                  // navigation.setOptions({ title: "Updated!" });
                }}
              >
                <Text style={styles.item}>{item.name}</Text>
              </Pressable>

              <View style={styles.iconsContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    navigation.navigate("Edit Consultant", {
                      id: item.id,
                    });
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon
                        name="pen"
                        size={18}
                        // color="blue"
                      />
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    handleDelete(item.name, item.id);
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon name="trash-alt" size={18} color="red" />
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </Pressable>
          </>
        )}
      />
      {/* <Signature /> */}
    </ScrollView>
  );
};

export default AllConsultants;

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

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
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
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "20%",
    justifyContent: "space-between",
  },

  rippleView: {
    padding: 2,
    borderRadius: 10,
    overflow: "hidden",
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
    marginBottom: 20,
  },

  addText: {
    color: "#fff",
  },
});
