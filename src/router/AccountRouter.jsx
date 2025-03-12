import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountMain from "../account/AccountMain";
import AccountCreate from "../account/AccountCreate";

function AccountRouter() {
  return (
    <div>
      <Routes>
        <Route path="/account" element={<AccountMain />}></Route>
        <Route path="/account/create" element={<AccountCreate />}></Route>
      </Routes>
    </div>
  );
}

export default AccountRouter;
