import React from "react";
import { Route, Routes } from "react-router-dom";
import ContractWrite from "../parent/ContractWrite";
import ContractWriteChild from "../parent/ContractWriteChild";
import MoneyContractManage from "../parent/MoneyContractManage";
// import ContractSelect from "../parent/ContractSelect";
import ContractDetail1 from "../parent/ContractDetail1";

function ContractRouter() {
  return (
    <div>
      <Routes>
        <Route
          path="/contract/contractWrite"
          element={<ContractWrite />}
        ></Route>
        <Route
          path="/contract/contractWriteChild"
          element={<ContractWriteChild />}
        ></Route>
        <Route
          path="/contract/moneyContractManage"
          element={<MoneyContractManage />}
        ></Route>
        <Route
          path="/contract/contractSelect"
          element={<ContractSelect />}
        ></Route>
        <Route
          path="/contract/contractDetail1"
          element={<ContractDetail1 />}
        ></Route>
      </Routes>
    </div>
  );
}

export default ContractRouter;
