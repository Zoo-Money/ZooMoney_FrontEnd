import React from "react";
import { Route, Routes } from "react-router-dom";
import ChildEventSend from "../parent/ChildEventSend";
import MoneyPlanConfirm from '../parent/MoneyPlanConfirm';
import ParentAccount from "../parent/ParentAccount";
import ParentMain from "../parent/ParentMain";

function ContractRouter() {
  return (
    <Routes>
      <Route path="/parent/main" element={<ParentMain />}></Route>
      <Route path="/parent/childEventSend" element={<ChildEventSend />}></Route>
      <Route path="/parent/account" element={<ParentAccount />}></Route>
      <Route path='/parent/confirm' element={<MoneyPlanConfirm />}></Route>
    </Routes>
  );
}

export default ContractRouter;
