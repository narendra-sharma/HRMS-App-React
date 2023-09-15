import { useState } from "react";
import { Button, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRMainScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
      }}
    >
      <Button
        style={{ width: "30%" }}
        onPress={() => navigation.navigate("Generate QR Code")}
        title="Generate QR Code >"
      />
      <Button
        style={{ width: "30%" }}
        onPress={() => navigation.navigate("Scan QR Code")}
        title="Scan QR Code >"
      />
    </View>
  );
};

export default QRMainScreen;
