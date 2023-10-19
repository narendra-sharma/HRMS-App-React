import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TouchableNativeFeedback,
  RefreshControl,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
// import { apiDeleteCompany, apiGetAllCompanies } from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";
import {
  apiGetAllLeaves,
  apiGetLeaveTypes,
  apiGetLeavesGroup,
} from "../../../apis/leaves";
import moment from "moment";

const randomHexColor = () => {
  return "#b7d0d1";
};

const LeavesList = ({ navigation }) => {
  const [leavesList, setLeavesList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleRadius, setRippleRadius] = useState(10);
  const [rippleOverflow, setRippleOverflow] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllLeaves = async () => {
        try {
          const res = await apiGetAllLeaves();
          setLeavesList([...res?.data?.leaves]);
          console.log("leaves: ", res?.data.leaves);
        } catch (err) {
          console.log(err);
        }
      };

      getAllLeaves();

      return () => {
        isActive = false;
      };
    }, [deleteFlag, refresh])
  );

  //handle delete function
  const handleDelete = async () => {};

  const dateSort = (a, b) => {
    const formattedA = moment(a.from).format("MM/DD/YYYY");
    const formattedB = moment(b.from).format("MM/DD/YYYY");

    if (formattedA < formattedB) {
      return 1;
    } else {
      return -1;
    }
  };

  //handle list refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  return leavesList.length > 0 ? (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()} />
      }
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      // style={{ height: 100 }}
      data={leavesList.sort(dateSort)}
      renderItem={({ item }) => (
        <>
          <Pressable style={styles.listItem}>
            <Pressable
              style={{ width: "100%" }}
              onPress={() => {
                // navigation.navigate("Job Details", { id: item.id });
                // navigation.setOptions({ title: "Updated!" });
              }}
            >
              <Text style={[styles.item, { fontSize: 14.5 }]}>
                {item?.leave_type?.type} {"\n"}
                Date: {item?.from} {item?.to > item?.from && <>to {item?.to}</>}{" "}
                ({/* compute the number of days leave is applied for */}
                {(moment(item.to).toDate().getTime() -
                  moment(item.from).toDate().getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1}{" "}
                {(moment(item.to).toDate().getTime() -
                  moment(item.from).toDate().getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1 >
                1 ? (
                  <>days</>
                ) : (
                  <>day</>
                )}
                ){"\n"}
                {/* {item.to && item.to != item.from && <> to {item.to} </>} */}
                Applied on: {moment(item?.created_at).format(
                  "YYYY-MM-DD"
                )} at {moment(item?.created_at).format("hh:mm a")}
              </Text>
              <Text style={[styles.item, { fontSize: 14.5 }]}>
                Status:{" "}
                <Text
                  style={[
                    item.status == "Pending"
                      ? { color: "orange", fontWeight: "600" }
                      : item.status == "Approved"
                      ? {
                          color: "lightgreen",
                          fontWeight: "600",
                          // margin: 4,
                          // color: "#fff",
                        }
                      : { color: "red", fontWeight: "600" },
                  ]}
                >
                  {item.status}
                </Text>
              </Text>
            </Pressable>

            {/* <View style={styles.iconsContainer}> 
              {/* <TouchableNativeFeedback
                onPress={() => {
                  setRippleColor(randomHexColor());
                  navigation.navigate("Edit Job", {
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
                  handleDelete(item.title, item.id);
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
               */}
          </Pressable>
        </>
      )}
    />
  ) : (
    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
      No Recent Leaves
    </Text>
  );
};

export default LeavesList;

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  listItem: {
    backgroundColor: "#fff",
    // margin: 2,
    minWidth: "100%",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
  },

  item: {
    padding: 4,
    fontSize: 16,
    width: "100%",
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
    backgroundColor: "#B76E79",
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
