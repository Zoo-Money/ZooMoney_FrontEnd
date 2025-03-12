import React from "react";
import { Route, Routes } from "react-router-dom";
import QuizEnd from "../quiz/QuizEnd";
import QuizFailure from "../quiz/QuizFailure";
import QuizMain from "../quiz/QuizMain";
import QuizQuiz from "../quiz/QuizQuiz";
import QuizSuccess from "../quiz/QuizSuccess";

function QuizRouter(props) {
  return (
    <div>
        <Routes>
          <Route path="/quiz/main" element={<QuizMain />}></Route>
          <Route path="/quiz/quiz" element={<QuizQuiz />}></Route>
          <Route path="/quiz/success" element={<QuizSuccess />}></Route>
          <Route path="/quiz/failure" element={<QuizFailure />}></Route>
          <Route path="/quiz/end" element={<QuizEnd />}></Route>
        </Routes>
    </div>
  );
}

export default QuizRouter;
