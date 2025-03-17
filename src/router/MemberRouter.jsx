import React from "react";
import { Route, Routes } from "react-router-dom";
import CardMain from "../card/CardMain";
import Login from "../member/Login";
import SignUp from "../member/SignUp";
import MyPage from "../common/MyPage";

function MemberRouter(props) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/main" element={<CardMain />} />
        <Route path="/member/mypage" element={<MyPage />}></Route>
        <Route path="/member/signup" element={<SignUp />}></Route>
      </Routes>
    </div>
  );
}

export default MemberRouter;
