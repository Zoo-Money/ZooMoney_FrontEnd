import React, { useState } from "react";

function InputComponent({
  title,
  img,
  category,
  handleInputChange,
  index,
  isLast,
}) {
  const [value, setValue] = useState(category);
   const handleValueChange = (e) => {
     let inputValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외의 문자는 제거
     // 숫자로 변환 후, 로컬 문자열 형식으로 변환
     let formattedValue = inputValue
       ? parseInt(inputValue, 10).toLocaleString()
       : "";
     // 실시간으로 포맷된 값 업데이트
     setValue(formattedValue);
     handleInputChange(e, index + 1);
   };

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
          value={value}
          onChange={handleValueChange}
        />
      </div>
    </>
  );
}

export default InputComponent;