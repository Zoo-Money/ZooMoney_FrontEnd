import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ title }) => {
  const navigate = useNavigate(); //페이지 이동을 위한 훅
  return (
    <div className="header">
      <IoIosArrowBack className="back-icon" onClick={() => navigate(-1)} />
      <h1 className="header-title">{title}</h1>
    </div>
  );
};

export default Header;
