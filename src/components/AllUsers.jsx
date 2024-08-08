import React, { useState, useEffect } from "react";
import "../css/style.css";
import SearchIcon from '@mui/icons-material/Search';
import {accessChat, fetchChat } from '../utils/APIRoutes';
import axios from "axios";
export default function AllUsers({userList}) {
    const [currentSelected, setCurrentSelected] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const changeCurrentChat = async(index, User) => {
        setCurrentSelected(index);
        console.log(User);
        const data = await JSON.parse(localStorage.getItem("Users"));
          console.log("data",data._id);
          console.log("User",User._id);
        const newChat=await axios.post(accessChat,{users:[data._id,User._id]});
        console.log(newChat);
        // chatList(newChat);
    };
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };
    const filteredContacts = userList.filter((User) =>
        User.username.toLowerCase().includes(searchQuery)
    );
    const data = searchQuery ? filteredContacts : userList;
    return (
    <div className="add-user">
        <div className="search-box">
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search..."
            className="query-input"
          />
        </div>
        <div className="contacts-list">
          {data.map((user, index) => (
            <div
              key={user._id}
              className={`contact-item ${index === currentSelected ? "selected" : ""}`}
              onClick={() => changeCurrentChat(index, user)}
            >
              <div className="avatar">
                <img
                  src={user.avatarImage}
                  alt="Avatar"
                />
              </div>
              <div className="username">
                <h3>{user.username}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

