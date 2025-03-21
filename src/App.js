import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./common/Footer";
import FooterParent from "./common/FooterParent";
import Routers from "./router/Routers";

function Init() {
  const member_type = sessionStorage.getItem("member_type");
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  // Footer 렌더링 설정
  useEffect(() => {
    location.pathname === "/" ? setShowFooter(false) : setShowFooter(true);
  }, [location.pathname]); // 경로가 변경될 때마다 실행

  return (
    <>
      <Routers />
      <ToastContainer autoClose={1000} />
      {showFooter && (member_type === "child" ? <Footer /> : <FooterParent />)}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Init />
    </BrowserRouter>
  );
}
