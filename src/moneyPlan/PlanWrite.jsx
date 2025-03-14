import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import hamburger from "../images/hamburger.png";
import cart from "../images/cart.png";
import game from "../images/game.png";
import pig from "../images/pig.png";
import etc from "../images/etc.png";
import axios from 'axios';
import "./moneyPlan.css";
import { useNavigate } from 'react-router-dom';
import InputComponent from './InputComponent';
import {categoryName} from "./planCommon.js";

function PlanWrite(props) {
    const [planMoney, setPlanMoney] = useState();
    const [category, setCategory] = useState({
        1: "", 2: "", 3: "", 4: "", 5: ""
    });
    const [message, setMessage] = useState();
    const navi = useNavigate();
    const images = [ hamburger, cart, game, pig, etc];

    //용돈가져오기
    useEffect(()=>{
        const memberNum = 1;
        axios({
          url: `http://localhost:7777/zoomoney/moneyplan/getAllowance?memberNum=${memberNum}`,
          method: "get",
        })
          .then((resposeData) => {
            setPlanMoney(resposeData.data);
          })
          .catch((error) => {
            console.log(error);
          });
    },[]);

    //유효성검사
    useEffect(()=>{
        const total = Object.values(category).reduce((acc, curr)=>acc + Number(curr),0);
        if (Object.values(category).every(value => value === "")){
            setMessage("설정한 용돈 금액에 맞춰 계획 금액을 입력해주세요");
        } else if (total === planMoney) {
            setMessage("받은 용돈과 계획한 금액이 일치합니다.");
        } else {
            setMessage("받은 용돈과 계획한 금액이 일치하지 않습니다. 다시 입력해주세요.");
        }
    }, [category, planMoney]);

    //입력된 값 넣어주기
    const handleInputChange = (e, key) => {
        const value = e.target.value;
        setCategory(prev => ({
            ...prev, [key]: Number(value) || ""
        }));
    };

    //이동, 데이터 전달
    const handleNext = () => {
        navi("/moneyPlan/planchart", {state: {category, planMoney}});
    };

    return (
      <div className="mock-container">
          <Header title="용돈 계획 세우기"></Header>
        <div className="planwrite-content">
          <p>
            일주일 동안 <span>{planMoney}원</span>을 어떻게 나눠쓸까요?<br/>
            어떻게 용돈을 쓸지 선택해주세요.</p>
        </div>
        <div className="planwrite-container">
          {images.map((item, index) => (
            <InputComponent
              key={index}
              title={categoryName[index]}
              img={images[index]}
              handleInputChange={handleInputChange}
              index={index}
            ></InputComponent>
          ))}
          <p>{message}</p>
        </div>
        <button className='planwrite-button' onClick={handleNext}>다음</button>
        <Footer></Footer>
      </div>
    );
}

export default PlanWrite;