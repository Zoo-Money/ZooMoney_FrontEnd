import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";
import QuizEnd from "./quiz/QuizEnd";
import QuizMain from "./quiz/QuizMain";
import QuizQuiz from "./quiz/QuizQuiz";
import QuizSuccess from "./quiz/QuizSuccess";
import QuizFailure from "./quiz/QuizFailure";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<StockBegin />} /> */}
        {/* <Route path="/" element={<QuizEnd />} /> */}
        {/* <Route path="/" element={<QuizMain />} /> */}
        {/* <Route path="/" element={<QuizQuiz />} /> */}
        <Route path="/" element={<QuizSuccess />} />
        {/* <Route path="/" element={<QuizFailure />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
