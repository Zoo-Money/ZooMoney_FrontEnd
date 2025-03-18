import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import allowanceContract from "../images/allowanceContract.png";
import allowancePlan from "../images/allowancePlan.png";
import consumpPattern from "../images/consumpPattern.png";
import piggyBank from "../images/piggyBank.png";
import profile1 from "../images/profile1.png";
import profile2 from "../images/profile2.png";
import "./css/parentMain.css";

const ParentMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMoneyContractManageClick = () => {
    navigate("/contract/moneyContractManage");
  };
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null); // 선택한 자녀의 memberNum
  const selectedChildInfo = children.find(
    (child) => child.memberNum === selectedChild
  );
  const [cardMoney, setCardMoney] = useState(0); //카드 잔액상태

  // 부모, 아이 정보가 모두 필요한 화면이라 혼동을 막기 위해 parentId 사용
  const parentId = sessionStorage.getItem("member_num");

  // 부모 ID 기반으로 자녀 목록 불러오기
  useEffect(() => {
    if (!parentId) {
      console.error("부모 ID가 없습니다. 로그인 후 시도하세요.");
      return;
    }
    axios
      .get("http://localhost:7777/zoomoney/contract/getChildByParent", {
        params: { parentId: parentId }, // 임시 부모 ID (로그인 로직에서 받아오도록 변경 필요)
      })
      .then((response) => {
        setChildren(response.data);

        // query parameter에서 childNum이 있는지 확인
        const searchParams = new URLSearchParams(location.search);
        const queryChildNum = Number(searchParams.get("childNum"));

        if (queryChildNum) {
          setSelectedChild(queryChildNum); // query parameter 값이 우선
        } else if (response.data.length > 0) {
          setSelectedChild(response.data[0].memberNum || null); // 첫 번째 자녀 선택 (기본값)
        }
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  }, [location]); // location 추가

  useEffect(() => {
    if (selectedChild) {
      axios
        .get("http://localhost:7777/zoomoney/contract/child/money", {
          params: { memberNum: selectedChild }, // 선택한 자녀의 memberNum 전달
        })
        .then((response) => {
          setCardMoney(response.data.cardMoney);
        })
        .catch((error) => {
          console.error("카드 정보 불러오기 실패:", error);
          setCardMoney(0); // 카드 데이터가 없을 경우 기본 값 0 설정
        });
    }
  }, [selectedChild]);

  // 자녀 선택 시 상태 업데이트
  const handleChildSelect = (childNum) => {
    setSelectedChild(childNum);
    sessionStorage.setItem("childNum", String(childNum)); // 문자열로 저장해야 함
  };

  const goMoneyPlan = () => {
    navigate("/moneyPlan/confirm");
  };
  const goChildEventSend = () => {
    navigate("/parent/childEventSend");
  };
  const gocusumehistory = () => {
    navigate("/card/usehistoryParent");
  };
  const goPattern = () => {
    navigate("/card/pattern");
  };
  const goAccount = () => {
    navigate("/parent/account", { state: { target: selectedChild } }); // state로 전달
  };
  return (
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      {/* <div className="zoo-money flex justify-start items-center"> */}
      <div className="parent-main-zoo-money-title">
        <span className="zoo">Zoo</span>
        <span className="money">Money</span>
      </div>

      {/* 프로필 영역 */}
      <div className="parent-main-profile-container">
        {" "}
        {/* 🔹 가로로 정렬을 위한 추가 */}
        {children.map((child) => (
          <div
            key={child.memberNum}
            className={`profile-wrapper ${
              selectedChild === child.memberNum ? "selected" : ""
            }`}
            onClick={() => {
              handleChildSelect(child.memberNum);
              setTimeout(
                () => sessionStorage.setItem("childNum", child.memberNum),
                0
              ); // 즉시 실행 (이 시점에서 selectedChild는 아직 변경되지 않았을 수 있음)
            }}
          >
            <img
              className="profile-image"
              src={child.memberNum % 2 === 0 ? profile1 : profile2}
              alt={child.memberName}
            />
            <div className="profile-name">
              {" "}
              {/* 🔹 이름을 프로필 아래에 위치 */}
              <span>{child.memberName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 용돈 정보 카드 */}

      <div className="allowance-card">
        <div className="card-header">
          <div className="allowance-text">
            <p className="allowance-title">
              {selectedChildInfo ? selectedChildInfo.memberName : "자녀 없음"}{" "}
              의 용돈주머니
            </p>
            <p className="allowance-amount"> {cardMoney.toLocaleString()} 원</p>
          </div>
          <button
            className="consumptionhistory-button"
            onClick={gocusumehistory}
          >
            소비내역 확인
          </button>
        </div>
        <button className="sendmoney-button" onClick={goChildEventSend}>
          송금하기
        </button>
      </div>

      {/* 기능 카드 버튼 */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div
          className="feature-card card-yellow"
          onClick={handleMoneyContractManageClick}
        >
          <img src={allowanceContract} alt="용돈 계약서" />
          <p>용돈 계약서</p>
        </div>
        <div className="feature-card card-blue" onClick={goMoneyPlan}>
          <img src={allowancePlan} alt="용돈 계획확인" />
          <p>용돈 계획확인</p>
        </div>
        <div className="feature-card card-purple" onClick={goPattern}>
          <img src={consumpPattern} alt="소비패턴 분석" />
          <p>소비패턴 분석</p>
        </div>
        <div className="feature-card card-pink" onClick={goAccount}>
          <img src={piggyBank} alt="저금통 확인" />
          <p>저금통 확인</p>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <Footer />
    </div>
  );
};
export default ParentMain;
