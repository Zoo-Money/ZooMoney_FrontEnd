import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlanMain from "../moneyPlan/PlanMain";
import PlanWrite from "../moneyPlan/PlanWrite";
import "../moneyPlan/moneyPlan.css"
import PlanChart from '../moneyPlan/PlanChart';
import PlanComplete from '../moneyPlan/PlanComplete';
import MoneyPlanConfirm from '../parent/MoneyPlanConfirm';

function MoneyPlanRouter(props) {
    return (
        <div>
            <Routes>
                <Route path='/moneyPlan/main' element={<PlanMain></PlanMain>}></Route>
                <Route path='/moneyPlan/write' element={<PlanWrite></PlanWrite>}></Route>
                <Route path='/moneyPlan/planchart' element={<PlanChart></PlanChart>}></Route>
                <Route path='/moneyPlan/complete' element={<PlanComplete></PlanComplete>}></Route>
                <Route path='/moneyPlan/confirm' element={<MoneyPlanConfirm></MoneyPlanConfirm>}></Route>
            </Routes>
        </div>
    );
}

export default MoneyPlanRouter;