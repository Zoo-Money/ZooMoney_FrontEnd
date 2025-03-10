import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountTest from "../account/AccountTest";

function AccountRouter() {
  return (
    <div>
      <Routes>
        <Route path="/account" element={<AccountTest />}></Route>
      </Routes>
    </div>
  );
}

export default AccountRouter;
