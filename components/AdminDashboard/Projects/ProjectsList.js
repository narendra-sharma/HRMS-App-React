import { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { apiGetAllProjects } from "../../../apis/projects";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";

const ProjectsList = ({ navigation }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [modalData, setModalData] = useState();
  const [qrExists, setQrExits] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const viewShotRef = useRef();

  const dateToday = new Date();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllProjects = async () => {
        const res = await apiGetAllProjects();
        console.log("projects", res.data.data);
        //set projects list
        setProjectsList(res.data.data);
      };

      getAllProjects();

      return () => {
        isActive = false;
      };
    }, [deleteFlag, refresh])
  );

  const handleDelete = async (name, id) => {
    const deleteProject = async () => {
      try {
        const res = await apiDeleteProject(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Project Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(`Delete ${name}`, `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteProject() },
    ]);
  };

  const handleQrClicked = async (item) => {
    console.log("project qr icon clicked: ", item);
    setModalData({ ...item });
    setModalVisible(true);
  };

  //functions to handle qr code download
  const captureScreenshot = async () => {
    try {
      if (viewShotRef.current) {
        // Capture the screenshot and get the URI
        const uri = await viewShotRef.current.capture();
        console.log("Screenshot captured:", uri);

        // Save the screenshot to the camera roll
        await saveQRCodeToCameraRoll(uri);
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const saveQRCodeToCameraRoll = async (uri) => {
    try {
      // Request permission to access the media library
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        // Save the QR code image to the media library
        await MediaLibrary.createAssetAsync(uri);

        Alert.alert(
          "QR Code Saved",
          "The QR code has been saved to your camera roll."
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access the camera roll to save the QR code."
        );
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
    }
  };

  //handle list refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  return projectsList?.length > 0 ? (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()} />
        }
        // render labels
        ListHeaderComponent={() => (
          <View
            style={[
              styles.listItem,
              {
                borderWidth: 0,
                width: "100%",
                backgroundColor: "#e5e5e5",
              },
            ]}
          >
            <Text
              style={[
                styles.item,
                {
                  fontWeight: "bold",
                  fontSize: 11.5,
                  textDecorationLine: "underline",
                  // textAlign: "center",
                },
              ]}
            >
              Projects
            </Text>
            <View style={[styles.iconsContainer]}>
              <Text
                style={[
                  styles.item,
                  {
                    fontWeight: "bold",
                    fontSize: 11.5,
                    textDecorationLine: "underline",
                    textAlign: "center",
                    paddingHorizontal: 0,
                  },
                ]}
              >
                QR Code
              </Text>
              <Text
                style={[
                  styles.item,
                  {
                    fontWeight: "bold",
                    fontSize: 11.5,
                    textDecorationLine: "underline",
                    textAlign: "center",
                    paddingHorizontal: 0,
                  },
                ]}
              >
                Calendar
              </Text>
            </View>
          </View>
        )}
        data={projectsList}
        //render list
        renderItem={({ item }) => (
          <>
            <Pressable
              // onPress={() => {
              //   navigation.navigate("Project Details", item);
              //   // navigation.setOptions({ title: "Updated!" });
              // }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.name}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => handleQrClicked(item)}>
                  <Icon
                    name="qrcode"
                    size={22}
                    // color="blue"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("View Calendar", item)}
                >
                  <Icon
                    name="calendar-alt"
                    size={22}
                    // color="blue"
                  />
                </TouchableOpacity>

                {/* <Icon
                  onPress={() => navigation.navigate("Edit Project", item)}
                  name="pen"
                  size={22}
                  // color="blue"
                /> 
                <Icon
                  onPress={() => handleDelete(item.name, item.id)}
                  name="trash-alt"
                  size={22}
                  color="red"
                /> */}
              </View>
            </Pressable>
          </>
        )}
      />

      {/* View QR on Screen */}
      <Modal
        animationType="slide"
        // transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("QR Code has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Text
            style={{
              textAlign: "center",
              padding: 4,
              fontSize: 16,
              lineHeight: 28,
            }}
          >
            {modalData?.name} {"\n"} {moment(dateToday).format("YYYY-MM-DD")}
          </Text>

          {modalData?.image ? (
            <>
              <ViewShot ref={viewShotRef}>
                <View style={{ padding: 30 }}>
                  <Image
                    style={styles.qrimage}
                    source={{
                      uri: modalData?.image,
                    }}
                  />
                </View>
              </ViewShot>
              {/* {console.log("data", getDataURL())} */}
              <View>
                <TouchableOpacity
                  style={styles.opacity}
                  onPress={captureScreenshot}
                  // onPress={handleDownload}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Save to camera roll
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View
              style={{
                // borderWidth: 1,
                // borderColor: "#d9d9d9",
                display: "flex",
                flexDirection: "column",
                padding: 12,
                alignItems: "center",
                marginTop: 22,
              }}
            >
              <Text>QR Code Not Generated For {modalData?.name} Today</Text>
              <TouchableOpacity
                style={styles.opacity}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("QR Code", {
                    screen: "Generate QR Code",
                    params: { project_id: modalData?.id },
                  });
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Generate QR Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.opacity}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  ) : (
    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
      No Recent Projects
    </Text>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  centeredView: {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "pink",
    padding: 20,
    margin: 20,
    marginTop: 50,
    height: "60%",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  opacity: {
    width: 200,
    marginTop: 20,
    backgroundColor: "#1FAAE2",
    padding: 10,
    borderRadius: 4,
  },

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor: "pink",
  },

  listItem: {
    backgroundColor: "#fff",
    marginVertical: 2,
    minWidth: "100%",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
  },

  item: {
    padding: 10,
    fontSize: 16,
    width: "50%",
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "50%",
    justifyContent: "space-around",
  },

  qrimage: {
    height: 300,
    width: 300,
  },
});
