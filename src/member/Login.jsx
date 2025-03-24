import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_PATH } from "../common/config.js";
import bear03 from "../images/bear/bear03.png";
import "./login.css";

function Login(props) {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const navi = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: `${API_PATH}/zoomoney/member/login`,
      method: "post",
      params: {
        member_id: memberId,
        member_pw: memberPw,
      },
      withCredentials: true,
    })
      .then((responseData) => {
        if (responseData.data.message === "로그인 성공") {
          const {
            member_id,
            member_num,
            member_phone,
            member_point,
            member_name,
            member_type,
            member_parent,
          } = responseData.data;
          sessionStorage.setItem("member_id", member_id);
          sessionStorage.setItem("member_num", member_num);
          sessionStorage.setItem("member_phone", member_phone);
          sessionStorage.setItem("member_point", member_point);
          sessionStorage.setItem("member_name", member_name);
          sessionStorage.setItem("member_type", member_type);
          sessionStorage.setItem("member_parent", member_parent);
          if (member_type === "parent") {
            navi("/parent/main");
          } else {
            navi("/main");
          }
        } else {
          toast.error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((err) => {
        console.error("로그인 오류 발생", err);
      });
  };

  return (
    <div className="mock-container">
      <div className="login-container">
        <div className="login-header">
          <span>Zoo</span>Money
          <img className="login-bear" src={bear03} alt="bear03" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-box">
            <label htmlFor="username">아이디</label>
            <input
              className="login-input"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
          </div>
          <div className="login-input-box">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              className="login-input"
              placeholder="비밀번호를 입력해주세요"
              value={memberPw}
              onChange={(e) => setMemberPw(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
