import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

const FooterParent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const target = sessionStorage.getItem("childNum");

  // 현재 경로에 따라 active 클래스를 동적으로 할당
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="footer">
      <div className="footer-container">
        <HomeRoundedIcon
          className={`footer-icon ${isActive("/parent/main") ? "active" : ""}`}
          onClick={() => {
            navigate("/parent/main");
          }}
        />
        홈
      </div>
      <div className="footer-container">
        <SavingsRoundedIcon
          className={`footer-icon ${
            isActive("/parent/account") ? "active" : ""
          }`}
          onClick={() => {
            navigate("/parent/account", { state: { target: target } });
          }}
        />
        저금통
      </div>
      <div className="footer-container">
        <PersonRoundedIcon
          className={`footer-icon ${
            isActive("/member/mypage") ? "active" : ""
          }`}
          onClick={() => {
            navigate("/member/mypage");
          }}
        />
        마이페이지
      </div>
    </div>
  );
};

export default FooterParent;
