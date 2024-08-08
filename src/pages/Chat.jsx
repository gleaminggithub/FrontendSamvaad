import React, { useEffect, useState, useRef ,useMemo} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/style.css";
import { allUsersRoute, host ,fetchChat} from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  socket.current = useMemo(()=>io(host),[]);
  useEffect(() => {
    if (!localStorage.getItem("Users")) {
      navigate("/login");
      } else {
        const User=async()=>{
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem("Users")
          )
        );
      }
      User();
    } 
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      console.log(socket.current);
      console.log(currentUser._id);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const list=async()=>{
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log(data.data);
          // const userData = await axios.get(`${fetchChat}/${currentUser._id}`);
          // console.log(userData);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    list();
  }, [currentUser,navigate]);
  const handleChatChange = (chat) =>{
    console.log("Selected Contact:",chat);
    console.log(chat);
    setCurrentChat(chat);
  };
  return(
    <>
      <div className="Container">
        <div className="Box">
          <Contacts contacts={contacts} changeChat={handleChatChange} socket={socket}/>
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </>
  );
}
