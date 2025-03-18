import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPage from "../common/MyPage";
import Login from "../member/Login";
import Main from "../member/Main";
import SignUp from "../member/SignUp";

function MemberRouter(props) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/main" element={<Main />} />
        <Route path="/member/mypage" element={<MyPage />}></Route>
        <Route path="/member/signup" element={<SignUp />}></Route>
      </Routes>
    </div>
  );
}

export default MemberRouter;
