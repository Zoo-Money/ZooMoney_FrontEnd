import React from "react";
import "./CardHeader.css";
import { ReactComponent as BellIcon } from "../images/bell.svg"; // SVG를 React 컴포넌트로 import
const CardMainHeader = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-orange">Zoo</span>
        <span className="logo-black">Money</span>
      </div>
      <div className="icon">
        <BellIcon className="notification-icon" />
      </div>
    </header>
  );
};

export default CardMainHeader;
