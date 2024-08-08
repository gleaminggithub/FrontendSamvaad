import React, { useState, useEffect, useRef, useContext } from "react";
import "../css/style.css";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import UploadImage from "./UploadImage";
import {
  sendMessageRoute,
  recieveMessageRoute,
  exitGroup,
} from "../utils/APIRoutes";
import { IconButton } from "@mui/material";
import { Videocam } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import LogoutIcon from "@mui/icons-material/Logout";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import TokenList from "./TokenList";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MyContext } from "../ContextApi/remove";
import Welcome from "./Welcome";
import { useNavigate } from "react-router-dom";
export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [ShowChatBot, setShowChatbot] = useState(true);
  // const [VideoCall, setVideoCall] = useState(false);
  const [status, setStatus] = useState(false);
  const { state, setState, msgstate, setMsgstate,VideoCall,setVideoCall } = useContext(MyContext);

  const [dataId,setDataID] = useState();
  const navigate = useNavigate();
  console.log(currentChat);
  useEffect(() => {
    const transport = async () => {
      const data = await JSON.parse(localStorage.getItem("Users"));
      setDataID(data._id);
      console.log(currentChat);
      const response = await axios.post(recieveMessageRoute, {
        currentChat,
      });
      console.log(response.data);
      setMessages(response.data);
    };
    transport();
  }, [currentChat,state]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("Users"))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);
  const handleSendMsg = async ({ msg, file }) => {
    console.log(msg);
    console.log(typeof msg);
    console.log(file);
    const data = await JSON.parse(localStorage.getItem("Users"));
    // const users=await axios.post()
    const msgs = [...messages];
    console.log(currentChat.list.users);
    if (file && file.size !== 0) {
      const response = await axios.post(sendMessageRoute, {
        currentChat,
        message: { text: msg, file, Image: data.avatarImage },
        userId: data._id,
      });
      console.log("File Exist");
      console.log(response);
      const { url, name, Time } = response.data.message.file;
      
      // const {image} = response.data.message.Image;
      socket.current.emit("send-msg", {
        currentChat,
        msg: {
          text: msg,
          Image: data.avatarImage,
          fileName: name,
          url,
          Time: new Date(),
        },
        data,
      });
      console.log("Line 67 ChatContainer", msgs);
      msgs.push({
        fromSelf: true,
        text: msg,
        url,
        fileName: name,
        Time: Time || new Date(),
        Image: data.avatarImage,
      });
      setMessages(msgs);
    } else {
      await axios.post(sendMessageRoute, {
        currentChat,
        message: {
          text: msg,
          file: { Time: new Date() },
          Image: data.avatarImage,
        },
        userId: data._id,
      });
      // console.log("Line 67 ChatContainer", msgs);
      
      socket.current.emit("send-msg", {
        currentChat,
        msg:{
          text: msg,
          Image: data.avatarImage,
          Time: new Date(),
        },
        data,
      });
      msgs.push({
        fromSelf: true,
        text: msg,
        url: null,
        fileName: null,
        Time: new Date(),
        Image: data.avatarImage,
      });
      setMessages(msgs);
    }

  };
  const deleteCurrentUser = async () => {
    console.log("Delete User");
    const { chatId } = currentChat;
    try {
      const data = await JSON.parse(localStorage.getItem("Users"));
      const remove = {
        chatId,
        userId: data._id,
        isGroupChat: currentChat.isGroupChat,
      };
      const Del = await axios.post(exitGroup, remove);
      setState(false);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log("msg-receive");
        console.log(msg);
        setArrivalMessage({
          fromSelf: false,
          text: msg.text,
          Image: msg.Image,
          Time: new Date(),
          url: msg.url,
          fileName: msg.fileName,
        });
      });
    }
  }, [socket.current]);

  useEffect(()=>{
    if(!currentChat.isGroupChat){
      console.log(currentChat);
      socket.current.emit('check-status',(currentChat.user._id));
      socket.current.on('user-status', (data) => {
        console.log(data);
        console.log(data.online);
        console.log("chat-person",currentChat.user._id);
        console.log(data.userId);
        if (data.online && data.userId===currentChat.user._id) {
            setStatus(true);
        }
        else {
            setStatus(false);
        }
    });
    }
  },[state,currentChat,socket.current]);
  useEffect(() => {
    console.log(arrivalMessage);
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    console.log(messages);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const toggleChatbot = () => {
    setShowChatbot(!ShowChatBot);
  };
  const toggleVideoCall = () => {
    setVideoCall(!VideoCall);
  };
  return (
    <>
       {!state ?(<Welcome/>):(<div className="chatContainer background-image">
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={currentChat.user.avatarImage}
                  alt="Avatar"
                  className="current_avatars"
                />
              </div>
              <div className="username">
                <h3 className="nameHead">{currentChat.user.username}</h3>
                {!currentChat.isGroupChat && <h3 className="status">{status ? "Online" : "Offline"}</h3>}
              </div>
            </div>
            <div className="chat_header_icons">
              <span onClick={toggleChatbot} className="chat-header-icon">
                <IconButton>
                  {ShowChatBot ? (
                    <FaceRetouchingNaturalIcon />
                  ) : (
                    <CloseIcon className="Close-Button" />
                  )}
                </IconButton>
              </span>
              <span onClick={toggleVideoCall} className="chat-header-icon">
                <IconButton>
                  <Videocam />
                </IconButton>
              </span>
              <span className="chat-header-icon">
                <IconButton>
                  <CallIcon />
                </IconButton>
              </span>
              <span className="chat-header-icon" onClick={deleteCurrentUser}>
                <IconButton>
                  <DeleteOutlineIcon />
                </IconButton>
              </span>
            </div>
          </div>
          {!ShowChatBot && <ChatBot />}
          {VideoCall && (
            <div className="VideoCall">
              <TokenList />
            </div>
          )}
          <div className="chat-messages">
            {messages.map((message) => {
              {/* console.log(message); */}
              const isSent = message.fromSelf;
              return (
                <div ref={scrollRef} key={uuidv4()} className="message-box">
                  <div className={`message ${isSent ? "sent" : "received"}`}>
                    <div className="message-content">
                      {!isSent && (
                        <div className="InnerContent-received">
                          {message.Image && (
                            <img
                              className="chat-image received"
                              src={message.Image}
                              alt="Chat"
                            />
                          )}
                          <span className="message-time">
                            {`${new Date(message.Time).toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}`}
                          </span>
                        </div>
                      )}
                      <div className="ImageUpload">
                        <UploadImage
                          Url={message.url}
                          fileName={message.fileName}
                        />
                        {!isSent && (
                          <p className="left-align-message">{message.text}</p>
                        )}
                        {isSent && (
                          <p className="right-align-message">{message.text}</p>
                        )}
                      </div>
                      {isSent && (
                        <div className="InnerContent-sent">
                          {message.Image && (
                            <img
                              className="chat-image sent"
                              src={message.Image}
                              alt="Chat"
                            />
                          )}
                          <span className="message-time">
                            {`${new Date(message.Time).toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>) } 
    </>
  );
}
