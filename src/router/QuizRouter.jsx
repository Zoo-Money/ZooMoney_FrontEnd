import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import QuizQuiz from "../quiz/QuizQuiz";
import QuizMain from "../quiz/QuizMain";
import QuizSuccess from "../quiz/QuizSuccess";
import QuizFailure from "../quiz/QuizFailure";
import QuizEnd from "../quiz/QuizEnd";

function QuizRouter(props) {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/quiz/main" element={<QuizMain />}></Route>
          <Route path="/quiz/quiz" element={<QuizQuiz />}></Route>
          <Route path="/quiz/success" element={<QuizSuccess />}></Route>
          <Route path="/quiz/failure" element={<QuizFailure />}></Route>
          <Route path="/quiz/end" element={<QuizEnd />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default QuizRouter;
