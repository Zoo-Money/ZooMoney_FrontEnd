import React from "react";
import { Route, Routes } from "react-router-dom";
import CardMain from "../card/CardMain";
import CardCreate from "../card/CardCreate";
import CardCreateSuccess from "../card/CardCreateSuccess";
import CardModify from "../card/CardModify";
import CardModifySuccess from "../card/CardModifySuccess";

function AccountRouter() {
  return (
    <div>
      <Routes>
        <Route path="/card/main" element={<CardMain />} />
        <Route path="/card/create" element={<CardCreate />} />
        <Route path="/card/success" element={<CardCreateSuccess />} />
        <Route path="/card/modify" element={<CardModify />} />
        <Route path="/card/modifySuccess" element={<CardModifySuccess />} />
      </Routes>
    </div>
  );
}

export default AccountRouter;
