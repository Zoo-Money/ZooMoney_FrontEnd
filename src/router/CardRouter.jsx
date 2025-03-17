import React from "react";
import { Route, Routes } from "react-router-dom";
import CardMain from "../card/CardMain";
import CardCreate from "../card/CardCreate";
import CardCreateSuccess from "../card/CardCreateSuccess";

function CardRouter() {
  return (
    <div>
      <Routes>
        <Route path="/card/main" element={<CardMain />}></Route>
        <Route path="/card/create" element={<CardCreate />}></Route>
        <Route path="/card/success" element={<CardCreateSuccess />}></Route>
        <Route path="/card/cardImageChange" element={<CardMain />}></Route>
      </Routes>
    </div>
  );
}

export default CardRouter;
