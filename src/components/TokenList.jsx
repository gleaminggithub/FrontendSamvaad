import React, { useState, useEffect } from 'react';
import axios from "axios";
import { getToken, bookedToken, resetToken } from "../utils/APIRoutes";
import VideoCalling from './VideoCalling';
import '../css/style.css';

const TokenList = () => {
  const [items, setItems] = useState([]);
  const [video, setVideo] = useState(false);
  const [meet, setMeet] = useState(null);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(getToken);
        console.log(response.data);
        setItems(response.data.availableTokens);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  const handleBookToken = async (id) => {
    try {
        console.log(id);
      const response = await axios.post(`${bookedToken}/${id}`);
      console.log(response);
      setMeet(response.data);
      setVideo(true);
      // Update the list of items with the new status
    } catch (err) {
      console.error(err);
    }
  };

  return (<>{!video ? (<div className="item-list">
    <h2 className="list-title">Item List</h2>
  
      <ul className="scrollable-list">
        {items.map((item, index) => (
          <li key={index} className="list-item" onClick={() => handleBookToken(item._id)}>
            <div className="item-content">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLXsvLE0dGD2_5ibZIlyIiH_nNM_x0LnnFgg&s"
                alt="VideoCallImage"
                className="avatar"
              />
              <div>
                <h3 className="item-title">{item.userId}</h3>
                <p className="item-description">Click to Start a Call</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
  </div>) : (
      <VideoCalling stream={meet} />)}</>
    )
};
export default TokenList;
