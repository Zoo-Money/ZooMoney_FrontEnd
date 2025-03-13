import React from "react";
import { Route, Routes } from "react-router-dom";
import NotifyTest from "../account/resources/NotifyTest";

function NotifyRouter() {
  return (
    <div>
      <Routes>
        <Route path="/notify" element={<NotifyTest />}></Route>
      </Routes>
    </div>
  );
}

export default NotifyRouter;
