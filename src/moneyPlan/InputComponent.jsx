import React from "react";

function InputComponent({
  title,
  img,
  category,
  handleInputChange,
  index,
  isLast,
}) {
  return (
    <>
      <div className="planwrite-input-list">
        <img
          src={img}
          alt={title}
          style={
            isLast
              ? { marginLeft: "20px", marginRight: "30px", width: "30px" }
              : {}
          }
        />
        <span style={isLast ? { marginRight: "25px", marginLeft: "15px" } : {}}>
          {title}
        </span>
        <input
          type="text"
          placeholder="금액 입력"
          value={category}
          onChange={(e) => handleInputChange(e, index + 1)}
        />
      </div>
    </>
  );
}

export default InputComponent;