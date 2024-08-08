import React, { useState } from "react";
import "../css/style.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const GroupForm = ({ handledata }) => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [file, setFile] = useState(null); // Change to null for consistent state

  const previewfile = (data) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      setFile({
        base64: reader.result,
        type: data.type,
        name: data.name,
      });
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    previewfile(groupImage); // Ensure the file is previewed and set in the state before form submission
    console.log(file);
    const formData = {
      groupName,
      groupImage: file, // Pass the file object in the form data
    };
    handledata(formData);

    // Clear the input fields
    setGroupName("");
    setGroupImage(null);
    setFile(null); // Reset the file state
  };

  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
    previewfile(e.target.files[0]); // Preview the image as soon as it is selected
  };

  return (
    <div className='groupform'>
      <form onSubmit={handleSubmit}>
        <div className='formgroup'>
          <label htmlFor='groupName'>Group Name</label>
          <input
            type="text"
            id='groupName'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div className='formgroup'>
          <label htmlFor='groupImage'><span>Upload Image : </span><AttachFileIcon /></label>
          <input
            type='file'
            id='groupImage'
            onChange={handleImageChange}
            style={{ display: 'none' }}
            required
          />
        </div>
        <button type='submit' className='submitbutton'>OK</button>
      </form>
    </div>
  );
};

export default GroupForm;
