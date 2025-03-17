import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../member/Login';
import SignUp from '../member/SignUp';

function MemberRouter(props) {
    return (
        <div>
            <Routes>
                <Route path='/member/login' element={<Login></Login>}></Route>
                <Route path='/member/signup' element={<SignUp></SignUp>}></Route>
            </Routes>
        </div>
    );
}

export default MemberRouter;