import React, { useState } from 'react';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";

const ChatBot = () => {
  const [request, setRequest] = useState('');
  const [conversations, setConversations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (request.trim()) {
      // Add the request to conversations
      setConversations(prevConversations => [
        ...prevConversations,
        { type: 'request', text: request }
      ]);

      try {
        const response = await axios({
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCvKyh7AFzh34CNy-B6tATdUBiiiit7Y8s",
          method: 'POST',
          data: {
            "contents": [{
              "parts": [{
                "text": `Consider yourself as a chatbot for chat application so you have to respond in the form of a paragraph written in a professional manner here is your ${request}`
              }]
            }]
          }
        });

        const responseText = response.data.candidates[0].content.parts[0].text;

        // Add the response to conversations
        setConversations(prevConversations => [
          ...prevConversations,
          { type: 'response', text: responseText }
        ]);
      } catch (error) {
        console.error('Error fetching the response:', error);
      }

      setRequest(''); // Clear the input after handling
    } else {
      alert('Ask your Question I am here to help you');
    }
  };

  return (
    <div className='ChatBot'>
      <div className='chatHeader'>
        <h2>ChatBot</h2>
      </div>
      <ul className='chatBox'>
        <li className='chat incoming'>
          <span><FaceRetouchingNaturalIcon /></span>
          <p>Hi there <br /> How can I help You Today?</p>
        </li>
        {conversations.map((val, index) => (
          <li key={index} className={`chat ${val.type === 'request' ? 'outgoing' : 'incoming'}`}>
            {val.type === 'request' ? (
              <>
                <p>{val.text}</p>
                <AccountCircleIcon />
              </>
            ) : (
              <>
                <span><FaceRetouchingNaturalIcon /></span>
                <p>{val.text}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className='chatInput'>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Enter a message..."
        />
        <button onClick={handleSubmit} className='ChatBot-Button'>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
