import React from 'react';
import "../css/style.css";

const UploadImage = ({ Url, fileName }) => {

  const handleFileClick = () => {
    window.open(Url, '_blank');
  };

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(Url);
  const isPdf = /\.pdf$/i.test(Url);

  return (
    <>
      {Url && (
        <div className="pdf-container" onClick={handleFileClick}>
          {isImage && (
            <img src={Url} alt="document" className="document-image" />
          )}
          {isPdf && (
            <img width="100px" height="100px" src="https://westpress.com/wp-content/uploads/2018/10/pdf.jpg" />
          )}
          <h2 className="file-name">{fileName}</h2>
        </div>
      )}
    </>
  );
};

export default UploadImage;
