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
      params:{
          member_id: memberId,
          member_pw: memberPw,
      },
    })
      .then((responseData) => {
        if (responseData.data.message === "로그인 성공"){
            setMessage("로그인 성공!");
            navi("/card/main");
        } else {
            setMessage("로그인 실패!");
        }
      })
      .catch((err) => {
        console.log("로그인 중 오류" ,err);
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
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='login-input'>
                <label htmlFor="username">아이디</label>
                <input
                    type="text"
                    id="username"
                    placeholder="아이디를 입력하세요"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                />
            </div>
            <div className='login-input'>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={memberPw}
                onChange={(e) => setMemberPw(e.target.value)}
              />
            </div>
            {message && <p className='login-error'>{message}</p>}
            <button type="submit" className='login-button'>
                로그인
            </button>
        </form>
        </div>
        <button className='login-forgotPW'>비밀번호를 잊으셨나요?</button>
    </div>
  );
}
export default Login;