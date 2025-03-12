import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import hamburger from "../images/hamburger.png";
import cart from "../images/cart.png";
import game from "../images/game.png";
import pig from "../images/pig.png";
import etc from "../images/etc.png";
import Footer from '../common/Footer';
import ContentInput from './ContentInput';
import axios from 'axios';
import PlanChart from './PlanChart';

//화폐단위포맷함수
const formatCurrency = (value) => {
  if (!value) return "0";
  value = String(value);
  let formattedValue = value.replace(/[^\d]/g, '');
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedValue;
};

function PlanWrite() {
    const [allowance, setAllowance] = useState(0);
    const [values, setValues] = useState({});
    const [message, setMessage] = useState('');
    const [planConfirmed, setPlanConfirmed] = useState(false);
    const contentItems = [
      {label: "먹기", imageSrc: hamburger, className: "content-eat"},
      {label: "쇼핑", imageSrc: cart, className: "content-cart"},
      {label: "놀기", imageSrc: game, className: "content-game"},
      {label: "저금", imageSrc: pig, className: "content-pig"},
      {label: "기타", imageSrc: etc, className: "content-etc"}
    ];

    //용돈 가져오기
    useEffect(()=>{
      //세션에서 memberNum 가져오기
      // const memberNum = sessionStorage.getItem('memberNum');

      // if(!memberNum){
      //   console.log("로그인 정보 없음~");
      //   return;
      // }
      const memberNum = 1;
      axios({
        url: `http://localhost:7777/zoomoney/moneyplan/getAllowance?memberNum=${memberNum}`,
        method: "get"
      })
      .then((responseData)=>{
        console.log(responseData.data);
        if(responseData.data){
          setAllowance(responseData.data);
        }
      })
      .catch((err)=>{
        console.log(err);
      });
    },[]);

    //값 변환 이벤트
    const handleInputChange = (label, e)=>{
      setValues((prev)=>({
        ...prev, [label]: formatCurrency(e.target.value)
      }));
    };

    //용돈과 입력값 비교
    useEffect(()=>{
      const total = Object.values(values).reduce((sum,val)=>sum+(parseInt(val.replace(/[^0-9]/g, ''), 10) || 0), 0);
      if (Object.keys(values).length === 0){
        setMessage("설정한 용돈 금액에 맞춰 계획 금액을 입력해주세요");
      } else if (total === allowance) {
        setMessage("받은 용돈과 계획한 금액이 일치합니다.");
      } else {
        setMessage("받은 용돈과 계획한 금액이 일치하지 않습니다. 다시 입력해주세요.");
      }
    }, [values, allowance]);

    //다음 버튼 클릭 시 넘어가기기
    const handleConfirmPlan = ()=>{
      setPlanConfirmed(true);
    };

    const handelSave = ()=>{
      alert("계획저장완료");
    };

    return (
      <div className="mock-container">
        <div className="header">
          <Header title="용돈 계획 세우기"></Header>
        </div>
        <div className="content">
          <p>
            일주일동안 <span>{formatCurrency(allowance)}원</span>을<br></br>
            어떻게 나눠쓸까요?
          </p>
          <small>어떻게 용돈을 쓸지 선택해주세요.</small>
        </div>
        {planConfirmed ? (
          <PlanChart
            values={values}
            allowance={allowance}
            handelSave={handelSave}
            formatCurrency={formatCurrency}
          ></PlanChart>
        ) : (
          <div>
            {contentItems.map(({ label, imageSrc, className }) => (
              <ContentInput
                key={label}
                imageSrc={imageSrc}
                label={label}
                value={values[label] ? values[label] + "원" : ""}
                onChange={(e) => handleInputChange(label, e)}
                onFocus={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [label]: prev[label]?.replace("원", ""),
                  }))
                }
                onBlur={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [label]: prev[label] ? prev[label] + "원" : "",
                  }))
                }
                className={className}
              ></ContentInput>
            ))}
            <p>{message}</p>
          </div>
        )}
            <button className="plan-button" onClick={handleConfirmPlan}>
              다음
            </button>

        <Footer></Footer>
      </div>
    );
}

export default PlanWrite;