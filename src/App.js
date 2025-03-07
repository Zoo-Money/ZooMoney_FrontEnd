import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        {/*
        <Route path="/" element={<Header>} />
        <Route path="/" element={<Footer />} />
        <Route path="/" element={<Join />} />
        <Route path="/" element={<Login />} />
        <Route path="/" element={<MyPage />} />
        <Route path="/" element={<PlanMain />} />
        <Route path="/" element={<PlanWrite />} />
        <Route path="/" element={<PlanResult />} />
        <Route path="/" element={<AccountMain />} />
        <Route path="/" element={<AccountDetail />} />
        <Route path="/" element={<AccountCreate />} />
        <Route path="/" element={<AccountInsert />} />
        <Route path="/" element={<AccountInsertEnd />} />
        <Route path="/" element={<AccountFinish />} />
        <Route path="/" element={<AccountCancel />} />
        <Route path="/" element={<AccountCancelFinish />} />
        <Route path="/card/main" element={<CardMain />} />
        <Route path="/" element={<CardCreate />} />
        <Route path="/" element={<CardHistory />} />
        <Route path="/" element={<CardConsumeSelect />} />
        <Route path="/" element={<CardConsumeCompare />} />
        <Route path="/" element={<CardImageChange />} />
        <Route path="/" element={<QuizMain />} />
        <Route path="/" element={<QuizStart />} />
        <Route path="/" element={<QuizEnd />} />
        <Route path="/" element={<QuizSuccess />} />
        <Route path="/" element={<QuizFailure />} />
        <Route path="/" element={<QuizQuiz />} />
        <Route path="/" element={<DailyMain />} />
        <Route path="/" element={<DailyEnd />} />
        <Route path="/" element={<ParentMain />} />
        <Route path="/" element={<ParentChildHistory />} />
        <Route path="/" element={<ContractWrite />} />
        <Route path="/" element={<ChildAccountSelect />} />
        <Route path="/" element={<ChildAccountDetail />} />
        <Route path="/" element={<MoneyContractMange />} />
        <Route path="/" element={<ContractSelect />} />
        <Route path="/" element={<ContractDetail />} />
        <Route path="/" element={<ChildMoneySend />} />
        <Route path="/" element={<ChildEventSend />} />
        */}
        <Route path="/" element={<StockBegin />} />
        {/*
        <Route path="/" element={<StockMain />} />
        <Route path="/" element={<MyStockDetail />} />
        <Route path="/" element={<MyStockProfit />} />
        <Route path="/" element={<StockRank />} />
        <Route path="/" element={<StockDetail />} />
        <Route path="/" element={<StockInfo />} />
        <Route path="/stock/:infoNum" element={<StockInfoDetail />} />
        <Route path="/" element={<StockNews />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;
