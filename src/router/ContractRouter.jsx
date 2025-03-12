import React from "react";
import { Route, Routes } from "react-router-dom";
import ContractWrite from "../parent/ContractWrite";
import ContractWriteChild from "../parent/ContractWriteChild";

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
      </Routes>
    </div>
  );
}

export default ContractRouter;
