import React from 'react';

const ContentInput = ({imageSrc, label, value, onChange, className})=>{
    return (
        <div className={className}>
            <img src={imageSrc} alt={label} className="content-image" />
            <span>{label}</span>
            <input type="text" value={value} className='content-input' onChange={onChange} placeholder='금액입력' />
        </div>
    );
};

export default ContentInput;