import React from "react";
import { Route, Routes } from "react-router-dom";
import DailyEnd from "../daily/DailyEnd";
import DailyMain from "../daily/DailyMain";

function DailyRouter(props) {
  return (
    <div>
      <Routes>
        <Route path="/daily/main" element={<DailyMain />}></Route>
        <Route path="/daily/end" element={<DailyEnd />}></Route>
      </Routes>
    </div>
  );
}

export default DailyRouter;
