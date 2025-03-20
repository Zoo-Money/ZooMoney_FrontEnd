import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import hamburger from "../images/hamburger.png";
import cart from "../images/cart.png";
import game from "../images/game.png";
import pig from "../images/pig.png";
import etc from "../images/etc.png";
import axios from "axios";
import "../moneyPlan/css/planWrite.css";
import { useNavigate } from "react-router-dom";
import InputComponent from "./InputComponent";
import { categoryName } from "../moneyPlan/resource/planCommon.js";
import { toast } from "react-toastify";

function PlanWrite(props) {
  const [planMoney, setPlanMoney] = useState();
  const [category, setCategory] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [message, setMessage] = useState();
  const navi = useNavigate();
  const images = [hamburger, cart, game, pig, etc];
  const memberNum = sessionStorage.getItem("member_num");
  
  //용돈가져오기
  useEffect(() => {
    axios.get(`http://localhost:7777/zoomoney/moneyplan/getAllowance?memberNum=${memberNum}`,{
      params:{ memberNum }
    },
    )
      .then((resposeData) => {
        const formattedMoney = new Intl.NumberFormat().format(resposeData.data);
        setPlanMoney(formattedMoney);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  //유효성검사
  useEffect(() => {
    const total = Object.values(category).reduce(
      (acc, curr) => acc + Number(curr),
      0
    );
    const numericPlanMoney = Number(planMoney?.replace(/,/g, "")) || 0; // 숫자로 변환
    if (Object.values(category).every((value) => value === "")) {
      setMessage("설정한 용돈 금액에 맞춰 계획 금액을 입력해주세요");
    } else if (total === numericPlanMoney) {
      setMessage("받은 용돈과 계획한 금액이 일치합니다.");
    } else {
      setMessage(
        "받은 용돈과 계획한 금액이 일치하지 않습니다. 다시 입력해주세요."
      );
    }
  }, [category, planMoney]);

  //이동+유효성검사+데이터전달
  const handleNext = () => {
    const total = Object.values(category).reduce(
      (acc, curr) => acc + Number(curr),
      0
    );
    const numericPlanMoney = Number(planMoney?.replace(/,/g, "")) || 0; // 숫자로 변환
    if (Object.values(category).every((value) => value === "")) {
      toast.error("설정한 용돈 금액에 맞춰 계획 금액을 입력해 주세요");
    } else if (total !== numericPlanMoney) {
      toast.error(
        "받은 용돈과 계획한 금액이 일치하지 않아요. 다시 입력해 주세요."
      );
    } else {
      navi("/moneyPlan/planchart", {
        state: { category, planMoney: numericPlanMoney },
      });
    }
  };

  //입력된 값 넣어주기
  const handleInputChange = (e, key) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); //숫자만 남기기
    if (value) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천 원 단위로 끊기
    }
    setCategory((prev) => ({
      ...prev,
      [key]: value.replace(/,/g, "") || "",
    }));
  };

  return (
    <div className="mock-container">
      <Header title="용돈 계획 세우기" />
      <div className="planwrite-content">
        <p>
          일주일 동안 <span>{planMoney}원</span>을<br />
          어떻게 나눠쓸까요?
          <br />
          어떻게 용돈을 쓸지 입력해주세요.
        </p>
      </div>
      <div className="planwrite-container">
        {images.map((item, index) => (
          <InputComponent
            key={index}
            title={categoryName[index]}
            img={images[index]}
            handleInputChange={handleInputChange}
            index={index}
            isLast={index === images.length - 1}
          />
        ))}
        <p>{message}</p>
      </div>
      <button className="planwrite-button" onClick={handleNext}>
        다음
      </button>
      <Footer />
    </div>
  );
}

export default PlanWrite;
