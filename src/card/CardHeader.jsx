import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./CardHeader.css";

const CardHeader = ({ title }) => {
  const navigate = useNavigate(); //페이지 이동을 위한 훅
  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
    </div>
  );
};

export default CardHeader;
