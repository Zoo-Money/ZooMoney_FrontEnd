import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountCreate from "../account/AccountCreate";
import AccountMain from "../account/AccountMain";
import AccountMint from "../account/AccountMint";

function AccountRouter() {
  return (
    <div>
      <Routes>
        <Route path="/account" element={<AccountMain />}></Route>
        <Route path="/account/create" element={<AccountCreate />}></Route>
        <Route path="/account/mint" element={<AccountMint />}></Route>
      </Routes>
    </div>
  );
}

export default AccountRouter;
