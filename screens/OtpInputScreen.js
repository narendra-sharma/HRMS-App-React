import React, { useState } from "react";
import OtpInput from "../components/OtpInput/OtpInput";

const OtpInputScreen = ({ navigation, route }) => {
  const [otpCode, setOtpCode] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);
  const maximumCodeLength = 4;

  return (
    <>
      <OtpInput
        code={otpCode}
        setCode={setOtpCode}
        setIsPinReady={setIsPinReady}
        maximumLength={maximumCodeLength}
        navigation={navigation}
        isPinReady={isPinReady}
        route={route}
      />
    </>
  );
};

export default OtpInputScreen;
