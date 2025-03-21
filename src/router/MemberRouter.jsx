import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../member/Login";
import Main from "../member/Main";
import MyPage from "../member/MyPage";

function MemberRouter(props) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/main" element={<Main />} />
        <Route path="/member/mypage" element={<MyPage />}></Route>
      </Routes>
    </div>
  );
}

export default MemberRouter;
