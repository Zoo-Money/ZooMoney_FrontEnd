import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./CardMainHeader.css";

const CardHeader = ({ title }) => {
  const navigate = useNavigate(); //페이지 이동을 위한 훅
  return (
    <div className="card-header">
      <span className="cardback-icon-container">
        <IoIosArrowBack
          className="cardback-icon"
          onClick={() => navigate(-1)}
        />
      </span>
      <div>
        <span className="cardheader-title-container">
          <h1 className="cardheader-title">{title}</h1>
        </span>
      </div>
    </div>
  );
};

export default CardHeader;
