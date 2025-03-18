import React from "react";
import { Route, Routes } from "react-router-dom";
import "../moneyPlan/css/moneyPlan.css";
import PlanChart from "../moneyPlan/PlanChart";
import PlanComplete from "../moneyPlan/PlanComplete";
import PlanMain from "../moneyPlan/PlanMain";
import PlanWrite from "../moneyPlan/PlanWrite";

function MoneyPlanRouter(props) {
  return (
    <div>
      <Routes>
        <Route path="/moneyPlan/main" element={<PlanMain />}></Route>
        <Route path="/moneyPlan/write" element={<PlanWrite />}></Route>
        <Route path="/moneyPlan/planchart" element={<PlanChart />}></Route>
        <Route path="/moneyPlan/complete" element={<PlanComplete />}></Route>
      </Routes>
    </div>
  );
}

export default MoneyPlanRouter;
