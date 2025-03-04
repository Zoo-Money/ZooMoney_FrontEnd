import React from "react";
import "./Footer.css";
import { FiUser } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import { HiChartBar } from "react-icons/hi2";

const Footer = () => {
  return (
    <div className="footer">
      <a href="link1">
        <GoHome className="icon" />
      </a>
      <a href="link2">
        <TbPigMoney className="iconPig" />
      </a>
      <a href="link3">
        <HiChartBar className="icon" />
      </a>
      <a href="link4">
        <FiUser className="iconMypage" />
      </a>
    </div>
  );
};

export default Footer;
