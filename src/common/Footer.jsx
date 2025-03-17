import React from "react";
import "./Footer.css";
import { FiUser } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import { HiChartBar } from "react-icons/hi2";

const Footer = () => {
  return (
    <div className="footer">
      <a href="/main">
        <GoHome className="icon" />
      </a>
      <a href="/account">
        <TbPigMoney className="iconPig" />
      </a>
      <a href="/stock/stockMain">
        <HiChartBar className="icon" />
      </a>
      <a href="/member/mypage">
        <FiUser className="iconMypage" />
      </a>
    </div>
  );
};

export default Footer;
