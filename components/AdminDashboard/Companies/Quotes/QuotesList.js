import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import { MockQuotes } from "./MockQuotes";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiDeleteQuote, apiGetAllQuotes } from "../../../../apis/quotes";
import { useFocusEffect } from "@react-navigation/native";

const randomHexColor = () => {
  return "#b7d0d1";
};

const QuotesList = ({ navigation, companyId }) => {
  const [quotesList, setQuotesList] = useState([]);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = useState(true);
  const [deleteFlag, setDeteleFlag] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllQuotes = async () => {
        const res = await apiGetAllQuotes();
        // console.log(res.data.quotations);
        //listing of quotes for a specific company
        if (companyId) {
          const quotes = res.data.quotations.filter(
            (quote) => quote.company_id == companyId
          );
          setQuotesList(quotes);
        } else {
          //listing all quotes
          setQuotesList(res.data.quotations);
        }
      };

      getAllQuotes();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  // useEffect(() => {
  //   const getAllQuotes = async () => {
  //     const res = await apiGetAllQuotes();
  //     console.log(res.data.quotations);
  //     //listing of quotes for a specific company
  //     if (companyId) {
  //       const quotes = res.data.quotations.filter(
  //         (quote) => quote.company_id == companyId
  //       );
  //       setQuotesList(quotes);
  //     } else {
  //       //listing all quotes
  //       setQuotesList(res.data.quotations);
  //     }
  //   };

  //   getAllQuotes();
  // }, []);

  //function to delete the quote
  const handleDelete = async (id) => {
    const deleteQuote = async () => {
      try {
        const res = await apiDeleteQuote(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Quote Deleted Successfully", {
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
    Alert.alert(`Delete Quote`, `Are you sure you want to delete this quote?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteQuote() },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={quotesList}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.listItem}>
              <Pressable
                style={{ width: "76%" }}
                onPress={() => {
                  navigation.navigate("Quote Details", item);
                }}
              >
                <Text style={styles.item}>{item.description}</Text>
              </Pressable>

              <View style={styles.iconsContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    navigation.navigate("Edit Quote", {
                      company: item,
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
                    handleDelete(item.id);
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
    </View>
  );
};

export default QuotesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
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
