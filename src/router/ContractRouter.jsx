import React from "react";
import { Route, Routes } from "react-router-dom";
import ContractDetail from "../contract/ContractDetail";
import ContractSelect from "../contract/ContractSelect";
import ContractWrite from "../contract/ContractWrite";
import ContractWriteChild from "../contract/ContractWriteChild";
import MoneyContractManage from "../contract/MoneyContractManage";

function ContractRouter() {
  return (
    <Routes>
      <Route
        path="/contract/contractWriteChild"
        element={<ContractWriteChild />}
      ></Route>
      <Route
        path="/contract/moneyContractManage"
        element={<MoneyContractManage />}
      ></Route>
      <Route path="/contract/contractWrite" element={<ContractWrite />}></Route>
      <Route
        path="/contract/contractSelect"
        element={<ContractSelect />}
      ></Route>
      <Route
        path="/contract/contractDetail1"
        element={<ContractDetail />}
      ></Route>
    </Routes>
  );
}

export default ContractRouter;
