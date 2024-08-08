import React,{ createContext, useState } from 'react';

export const MyContext = createContext();
export const MyProvider = ({ children }) => {
    const [state, setState] = useState(false);
    const [msgstate, setMsgstate] = useState(false);
    const [VideoCall, setVideoCall] = useState(false);
    return (
      <MyContext.Provider value={{ state, setState,msgstate,setMsgstate,VideoCall,setVideoCall }}>
        {children}
      </MyContext.Provider>
    );
  };