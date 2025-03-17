import React, { useState } from 'react';
import Header from '../common/Header';
import bear04 from '../images/bear04.png';
import "./login.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  // 상태 관리
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [message, setMessage] = useState("");
  const navi = useNavigate();

  // 폼 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: `http://localhost:7777/zoomoney/member/login`,
      method: "post",
      params: {
        member_id: memberId,
        member_pw: memberPw,
      },
      withCredentials: true, // 세션 유지
    })
      .then((responseData) => {
        console.log(responseData.data);
        // 로그인 성공 시 세션과 sessionStorage에 값 저장
        if (responseData.data.message === "로그인 성공") {
          setMessage("로그인 성공!");
          // 서버에서 반환된 세션 데이터를 sessionStorage에 저장
          const {
            member_id,
            member_num,
            member_phone,
            member_point,
            member_name,
            member_type,
            member_parent,
          } = responseData.data;
          // 세션 스토리지에 값 저장
          sessionStorage.setItem("member_id", member_id);
          sessionStorage.setItem("member_num", member_num);
          sessionStorage.setItem("member_phone", member_phone);
          sessionStorage.setItem("member_point", member_point);
          sessionStorage.setItem("member_name", member_name);
          sessionStorage.setItem("member_type", member_type);
          sessionStorage.setItem("member_parent", member_parent);
          // 로그인 성공 후 페이지 이동
          navi("/card/main");
        } else {
          setMessage("로그인 실패!");
        }
      })
      .catch((err) => {
        console.log("로그인 중 오류", err);
      });
  };

  return (
    <div className="mock-container">
      <Header title="로그인"></Header>
      <div className="login-container">
        <div className="login-header">
          <span>Zoo</span>Money
          <img src={bear04} alt="bear04" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              placeholder="아이디를 입력하세요"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
          </div>
          <div className="login-input">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={memberPw}
              onChange={(e) => setMemberPw(e.target.value)}
            />
          </div>
          {message && <p className="login-error">{message}</p>}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
      <button className="login-forgotPW">비밀번호를 잊으셨나요?</button>
    </div>
  );
}
export default Login;