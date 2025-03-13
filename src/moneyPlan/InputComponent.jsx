import React from 'react';

function InputComponent({ title, img, category, handleInputChange, index}) {
  return (
    <>
      <div className='planwrite-input'>
        <img src={img} alt={title} />
        <span>{title}</span>
        <input
          type="text"
          placeholder="금액입력"
          value={category}
          onChange={(e) => handleInputChange(e, index)}
        />
      </div>
    </>
  );
}

export default InputComponent;