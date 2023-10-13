// import React, { useRef } from "react";
// import ExpoPixi from "expo-pixi";
// import { Text, View, TouchableOpacity } from "react-native";

// const Signature = () => {
//   const signatureCanvas = useRef();

//   const clearCanvas = () => {
//     signatureCanvas.current.clear();
//   };

//   const saveCanvas = async () => {
//     const signature_result = await signatureCanvas.current.takeSnapshotAsync({
//       format: "jpeg", // 'png' also supported
//       quality: 0.5, // quality 0 for very poor 1 for very good
//       result: "file", //
//     });
//     //    yourFnToSaveItInYourAPI(signature_result);
//     // inside the fn above, use signature_result.uri to get the absolute file path
//     console.log(signature_result);
//   };

//   return (
//     <View
//       style={{
//         borderWidth: 1,
//         height: 200,
//         minWidth: "100%",
//         // maxWidth: "100%",
//       }}
//     >
//       <ExpoPixi.Signature
//         ref={signatureCanvas} //Important to be able to call this obj
//         strokeWidth={3} // thickness of the brush
//         strokeAlpha={0.5} // opacity of the brush
//       />
//       <TouchableOpacity onPress={clearCanvas}>
//         <Text>Reset</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={saveCanvas}>
//         <Text>Sign</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Signature;
