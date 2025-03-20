import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FooterParent from "../common/FooterParent";
import rabbit02 from "../images//rabbit/rabbit02.png";
import bear04 from "../images/bear/bear04.png";
import deer02 from "../images/deer/deer02.png";
import pig02 from "../images/pig/pig02.png";
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
  const [selectedChild, setSelectedChild] = useState(null);
  const selectedChildInfo = children.find(
    (child) => child.memberNum === selectedChild
  );
  const [cardMoney, setCardMoney] = useState(0);

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
        params: { parentId: parentId },
      })
      .then((response) => {
        setChildren(response.data);

        // query parameter에서 childNum이 있는지 확인
        const searchParams = new URLSearchParams(location.search);
        const queryChildNum = Number(searchParams.get("childNum"));

        if (queryChildNum) {
          setSelectedChild(queryChildNum);
          sessionStorage.setItem("childNum", String(queryChildNum));
        } else if (response.data.length > 0) {
          const firstChildNum = response.data[0].memberNum;
          setSelectedChild(response.data[0].memberNum || null);
          sessionStorage.setItem("childNum", String(firstChildNum));
        }
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  }, [location, parentId]);

  useEffect(() => {
    if (selectedChild) {
      axios
        .get("http://localhost:7777/zoomoney/contract/child/money", {
          params: { memberNum: selectedChild },
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
    navigate("/parent/confirm");
  };
  const goChildEventSend = () => {
    navigate("/parent/childEventSend");
  };
  const gocusumehistory = () => {
    navigate("/parent/usehistoryParent");
  };
  const goPattern = () => {
    navigate("/parent/patternParent");
  };
  const goAccount = () => {
    navigate("/parent/account", { state: { target: selectedChild } }); // state로 전달
  };
  return (
    <div className="mock-container">
      <div className="parent-main-zoo-money-title">
        <span className="parent-zoo">Zoo</span>
        <span className="parent-money">Money</span>
      </div>

      {/* 프로필 영역 */}
      <div className="parent-main-profile-container">
        {" "}
        {/* 가로로 정렬을 위한 추가 */}
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
              {/* 이름을 프로필 아래에 위치 */}
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
              <span className="allowance-cild-name">
                {selectedChildInfo ? selectedChildInfo.memberName : "자녀 없음"}{" "}
              </span>
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
      <div className="parent-grid grid-cols-2 gap-3 mt-1 w-full">
        <div
          className="parent-card card-yellow"
          onClick={handleMoneyContractManageClick}
        >
          <img className="parent-bear" src={bear04} alt="용돈 계약서" />
          <p>용돈 계약서</p>
        </div>
        <div className="parent-card card-blue" onClick={goMoneyPlan}>
          <img className="parent-deer" src={deer02} alt="용돈 계획확인" />
          <p>용돈 계획 확인</p>
        </div>
        <div className="parent-card card-purple" onClick={goPattern}>
          <img className="parent-rabbit" src={rabbit02} alt="소비패턴 분석" />
          <p>소비 패턴 분석</p>
        </div>
        <div className="parent-card card-pink" onClick={goAccount}>
          <img className="parent-pig" src={pig02} alt="저금통 확인" />
          <p>저금통 확인</p>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <FooterParent />
    </div>
  );
};
export default ParentMain;
