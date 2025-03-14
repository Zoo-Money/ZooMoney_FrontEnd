import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountClose from "../account/AccountClose";
import AccountCreate from "../account/AccountCreate";
import AccountDetail from "../account/AccountDetail";
import AccountEnd from "../account/AccountEnd";
import AccountInsert from "../account/AccountInsert";
import AccountMain from "../account/AccountMain";

function AccountRouter() {
  return (
    <div>
      <Routes>
        <Route path="/account" element={<AccountMain />}></Route>
        <Route path="/account/create" element={<AccountCreate />}></Route>
        <Route path="/account/detail" element={<AccountDetail />}></Route>
        <Route path="/account/insert" element={<AccountInsert />}></Route>
        <Route path="/account/end" element={<AccountEnd />}></Route>
        <Route path="/account/close" element={<AccountClose />}></Route>
      </Routes>
    </div>
  );
}

export default AccountRouter;
