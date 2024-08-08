import React, { useState, useEffect } from "react";
import "../css/style.css";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetch=async()=>{
      const data=localStorage.getItem("Users");
      if(!data.username!=null)
      {
        setUserName(
          await JSON.parse(
            localStorage.getItem("Users")
          ).username
        );
      }
      // else 
      // {
      //   navigate("")
      // }
      }
   fetch();
  }, []);
  return (
    <div className="welcome">
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}

