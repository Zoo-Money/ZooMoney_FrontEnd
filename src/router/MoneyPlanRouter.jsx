import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlanMain from "../moneyPlan/PlanMain";
import PlanWrite from "../moneyPlan/PlanWrite";
import "../moneyPlan/planMain.css"
function MoneyPlanRouter(props) {
    return (
        <div>
            <Routes>
                <Route path='/moneyPlan/main' element={<PlanMain></PlanMain>}></Route>
                <Route path='/moneyPlan/write' element={<PlanWrite></PlanWrite>}></Route>
            </Routes>
        </div>
    );
}

export default MoneyPlanRouter;