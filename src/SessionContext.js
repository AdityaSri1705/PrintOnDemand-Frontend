// SessionContext.js
import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [sessionData, setSessionData] = useState({
    Covers: [],
    FrontPage: [],
    Layouts: [],
    Addins: [],
    Dates: []
  });

  const updateSessionData = (key, newData) => {
    setSessionData((prevSessionData) => {
      if(key==="Covers"){
        const updatedData = [...prevSessionData.Covers];
        updatedData[0] = newData;
        console.log("key=>", key, updatedData);
        return {
          ...prevSessionData,
          Covers: updatedData,
        };
      }
      
      if(key==="FrontPage"){
        const updatedData = [...prevSessionData.FrontPage];
        updatedData[1] = newData;
        return {
          ...prevSessionData,
          FrontPage: updatedData,
        };
      }
      if(key==="Layouts"){
        const updatedData = [...prevSessionData.Layouts];
        updatedData[2] = newData;
        return {
          ...prevSessionData,
          Layouts: updatedData,
        };
      }
      if(key==="Addins"){
        const updatedData = [...prevSessionData.Addins];
        updatedData[4] = newData;
        return {
          ...prevSessionData,
          Addins: updatedData,
        };
      }
      if(key==="Dates"){
        const updatedData = [...prevSessionData.Dates];
        updatedData[5] = newData;
        return {
          ...prevSessionData,
          Dates: updatedData,
        };
      }
    });
  };

  return (
    <SessionContext.Provider value={{ sessionData, updateSessionData }}>
      {children}
    </SessionContext.Provider>
  );
}