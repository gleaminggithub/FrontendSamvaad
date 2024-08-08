import React, { useState ,useContext} from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import SendIcon from '@mui/icons-material/Send';
import "../css/style.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { MyContext } from "../ContextApi/remove";
export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [file,setfile] =useState("");
  const [image,setimage] =useState("");
  const { state, setState, msgstate, setMsgstate } = useContext(MyContext);
  const previewfile = (data) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      setfile({
        base64: reader.result,
        type: data.type,
        name: data.name,
      });
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  };
  const handleChange = (e) => {
    console.log(e.target.files[0]);
    previewfile(e.target.files[0]);
  };
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  // const handleEmojiClick = (event, emojiObject) => {
  //   let message = msg;
  //   // console.log(emojiObject);
  //   // console.log(emojiObject.target.src);
  //   // console.log(`${<img src={emojiObject.target.src}/>}`);
  //   message =message + ;
  //   console.log(message);
  //   setMsg(message);
  //   // setShowEmojiPicker("");
  // };

  const handleEmoji = (d) => {
    console.log(d.native);
    let message = msg;
    message += d.native;
    setMsg(message);
    console.log(msg);
  };

  const sendChat = (event)=>{
    event.preventDefault();
    if (msg.length > 0){
      console.log(msg);
      setMsgstate(!msgstate);
      handleSendMsg({msg,file});
      setMsg("");
    }else
    {
      console.log("Message is empty");
    }
  };
  return (
    <>
  
    <div className="inputContainer">
      {/* Message Input Form */}
      <form className="input-form" onSubmit={(event) => sendChat(event)}>
      <label htmlFor="file-upload" className="upload-button">
            <AttachFileIcon />
          </label>
        <button className="upload-button">
          {/* Actual File Input */}
          <input
            type="file"
            id="file-upload"
            onChange={handleChange}
            style={{ display: 'none' }} // Hide the default file input
          />
        </button>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          style={{ outline: "none" }}
        />
        {/* Emoji Picker */}
        <div className={`emoji-container ${showEmojiPicker ? 'expanded' : ''}`}>
  <BsEmojiSmileFill
    className="emoji-icon"
    onClick={handleEmojiPickerhideShow}
  />
  {showEmojiPicker && (
    <Picker data={data} onEmojiSelect={handleEmoji} />
  )}
</div>
        <button type="submit">
          <SendIcon className="submit_button" />
        </button>
      </form>
    </div>
    </>
  );
}
