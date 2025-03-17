import React from "react";
import { Route, Routes } from "react-router-dom";
import CardConsumeChart from "../card/CardConsumeChart";
import CardCreate from "../card/CardCreate";
import CardCreateSuccess from "../card/CardCreateSuccess";
import CardHistory from "../card/CardHistory";
import CardModify from "../card/CardModify";
import CardModifySuccess from "../card/CardModifySuccess";

function CardRouter() {
  return (
    <div>
      <Routes>
        <Route path="/card/create" element={<CardCreate />} />
        <Route path="/card/success" element={<CardCreateSuccess />} />
        <Route path="/card/modify" element={<CardModify />} />
        <Route path="/card/modifySuccess" element={<CardModifySuccess />} />
        <Route path="/card/usehistory" element={<CardHistory />} />
        <Route path="/card/pattern" element={<CardConsumeChart />} />
      </Routes>
    </div>
  );
}

export default CardRouter;
