import React, { createContext, useContext, useState } from "react";

// Create a context
const DrawerStatusContext = createContext();

// Create a provider component
export const DrawerStatusProvider = ({ children }) => {
  const [drawerStatus, setDrawerStatus] = useState("closed");

  return (
    <DrawerStatusContext.Provider value={{ drawerStatus, setDrawerStatus }}>
      {children}
    </DrawerStatusContext.Provider>
  );
};

// Create a custom hook to access the drawer status
export const useCustomDrawerStatus = () => {
  const context = useContext(DrawerStatusContext);
  if (!context) {
    throw new Error(
      "useDrawerStatus must be used within a DrawerStatusProvider"
    );
  }
  return context;
};
