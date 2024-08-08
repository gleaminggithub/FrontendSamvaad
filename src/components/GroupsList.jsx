import React, { useState, useEffect } from "react";
import "../css/style.css";
import SearchIcon from '@mui/icons-material/Search';
import { createGroupChat, fetchGroups, addSelf } from '../utils/APIRoutes';
import axios from "axios";
import Group from './GroupForm';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function GroupList() {
    const [currentSelected, setCurrentSelected] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [groupsList, setGroupList] = useState([]);
    const [showGroupForm, setShowGroupForm] = useState(false);

    useEffect(() => {
        const fetchGroupsData = async () => {
            try {
                const response = await axios.get(fetchGroups);
                setGroupList(response.data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroupsData();
    }, []); 

    const changeCurrentChat = async (index, user) => {
        setCurrentSelected(index);
        const data = JSON.parse(localStorage.getItem("Users"));
        const person = {
            chatId: user.chatId,
            userId: data._id,
        };
        try {
            const response = await axios.put(addSelf, person);
            console.log(response.data);
        } catch (error) {
            console.error("Error adding self to chat:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handledata = async (form) => {
        const data = JSON.parse(localStorage.getItem("Users"));
        const formData = {
            name: form.groupName,
            image: form.groupImage,
            user: data._id
        };
        try {
            const response = await axios.post(createGroupChat, formData);
            setGroupList(prevList => [...prevList, response.data]);
            setShowGroupForm(false); // Hide form after successful submission
        } catch (error) {
            console.error("Error creating group chat:", error);
        }
    };

    const Datalist = groupsList.map(list => ({
        user: {
            username: list.chatName,
            avatarImage: list.chatImage
        },
        chatId: list._id
    }));

    const filteredContacts = Datalist.filter(list => 
        list.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const data = searchQuery ? filteredContacts : Datalist;

    return (
        <div className="add-user">
            <div className="search-box group-list">
                <span className="search-icon"><SearchIcon /></span>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="query-input"
                />
            </div>
            <button onClick={() => setShowGroupForm(prev => !prev)} className="toggle-button">
                {showGroupForm ? <GroupAddIcon /> : <GroupsIcon />}
            </button>
            {showGroupForm ? (
                <Group handledata={handledata} />
            ) : (
                <div className="contacts-list">
                    {data.map((user, index) => (
                        <div
                            key={user.chatId}
                            className={`contact-item ${index === currentSelected ? "selected" : ""}`}
                            onClick={() => changeCurrentChat(index, user)}
                        >
                            <div className="avatar">
                                <img
                                    src={user.user.avatarImage}
                                    alt="Avatar"
                                />
                            </div>
                            <div className="username">
                                <h3>{user.user.username}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
