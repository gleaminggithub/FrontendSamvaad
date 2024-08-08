import React, { useState, useEffect, useContext } from "react";
import "../css/style.css";
import Logo from "../assets/images.jpeg";
import Button from "@mui/material/Button";
import DuoIcon from "@mui/icons-material/Duo";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import Logout from "./Logout";
import AllUsers from "./AllUsers";
import { fetchChat } from "../utils/APIRoutes";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import GroupList from "./GroupsList";
import CloseIcon from "@mui/icons-material/Close";
import { MyContext } from "../ContextApi/remove";

export default function Contacts({ contacts, changeChat, socket }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [addPerson, setAddPerson] = useState(false);
  const [dataId, setDataId] = useState();
  const [userList, setUserList] = useState([]);
  const [group, setGroup] = useState(false);
  const [datalist, setDatalist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { state, setState, msgstate, setMsgstate } = useContext(MyContext);

  useEffect(() => {
    const fetch = async () => {
      const data = await JSON.parse(localStorage.getItem("Users"));
      setDataId(data._id);
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetch();
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    console.log(contact);
    socket.current.emit("join-room", contact.chatId);
    changeChat(contact);
    setState(true);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Ensure case-insensitive search
  };
  const handlePersonAdd = () => {
    setAddPerson(!addPerson);
    if (addPerson) {
      setGroup(false);
    }
  };
  const handlegroup = () => {
    setGroup(!group);
    if (group) {
      setAddPerson(false);
    }
  };
  useEffect(() => {
    const connectUserList = async () => {
      const data = await JSON.parse(localStorage.getItem("Users"));
      const userData = await axios.get(`${fetchChat}/${data._id}`);
      console.log(userData.data);
      setUserList(userData.data);
      userData.data.forEach((chat) => {
        socket.current.emit("join-room", chat.chatId);
      });
      console.log(contacts);
      setState(true);
    };
    connectUserList();
  }, [addPerson, group, state, msgstate]);

  const Datalist = userList.map((list) => {
    const arr = [];
    if (!list.isGroupChat) {
      const usersId = list.users;
      usersId.forEach((user) => {
        if (user._id !== dataId) {
          arr.push({
            user: user,
            chatId: list._id,
            isGroupChat: false,
            list,
          });
        }
      });
    } else {
      const user = {
        username: list.chatName,
        avatarImage: list.chatImage,
      };
      arr.push({
        user: user,
        chatId: list._id,
        isGroupChat: true,
        list,
      });
    }
    return arr;
  });
  const flattenedDatalist = Datalist.flat();

  console.log(flattenedDatalist);

  const filteredContacts = flattenedDatalist.filter((e) => {
    return e.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  console.log(filteredContacts);
  console.log(filteredContacts[0]);

  const data = searchQuery ? filteredContacts : flattenedDatalist;
  console.log(data);
  // const listDataFromFlattened = flattenedDatalist.map(item => item.list.latestMessage);
  // console.log('List data from flattenedDatalist:', listDataFromFlattened);

  return (
    <>
      {currentUserImage && currentUserName && (
        <div className="contactContainer">
          <div className="ContactNavbar">
            <div className="current-user">
              <div className="avatar">
                <img
                  // src={`data:image/svg+xml;base64,${currentUserImage}`}
                  src={currentUserImage}
                  alt="avatar"
                />
                <div className="username">
                  <h2>{currentUserName}</h2>
                </div>
              </div>
              <div className="SidebarIcon">
                <span className="chat-Sideheader-icon">
                  <IconButton onClick={handlePersonAdd}>
                    {addPerson ? <AddIcon /> : <PersonAddIcon />}
                  </IconButton>
                </span>
                <span className="chat-Sideheader-icon">
                  <IconButton onClick={handlegroup}>
                    {group ? <CloseIcon /> : <GroupAddIcon />}
                  </IconButton>
                </span>
                <span className="chat-Sideheader-icon">
                  <IconButton>
                    <Logout />
                  </IconButton>
                </span>
              </div>
            </div>
          </div>
          {addPerson ? (
            <AllUsers userList={contacts} />
          ) : (
            <>
              {group ? (
                <GroupList />
              ) : (
                <>
                  <div className="searchBox">
                    <span>
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      className="Query"
                    />
                  </div>
                  <div className="contacts">
                    {data.map((contact, index) => (
                      <div
                        key={contact._id}
                        className={`contact ${
                          index === currentSelected ? "selected" : ""
                        }`}
                        onClick={() => changeCurrentChat(index, contact)}
                      >
                        <div className="avatar">
                          <img
                            src={contact.user.avatarImage}
                            alt="Avatar Image"
                          />
                        </div>
                        <div className="contact-box">
                        <div className="username">
                          <h3>{contact.user.username}</h3>
                        </div>
                        <div className="latestMessage">
                          <h4>
                            {contact.list.latestMessage
                              ? contact.list.latestMessage.message.text
                              : "Start a Message"}
                          </h4>
                        </div>
                        </div>
                        <div className="Time">
                          <h4>
                            {contact.list.Time
                              ? `${new Date(contact.list.Time).toLocaleString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}`
                              : ""}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
