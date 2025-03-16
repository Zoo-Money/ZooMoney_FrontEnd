import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { IoIosArrowForward } from "react-icons/io";
import "./stockHistory.css";
import axios from 'axios';

function StockHistory(props) {
    const [ranking, setRanking] = useState([]);
    const navi = useNavigate();
    const goHistoryDetail = (item)=>{
        navi("/stock/stockHistoryDetail", {state: {item}});
    };

    useEffect(()=>{
        axios({
          url: "http://localhost:7777/zoomoney/stock/result/list",
          method: "get",
        })
          .then((responseData)=>{
            setRanking(responseData.data);
          })
          .catch((err)=>{
            console.log(err);
          });
    },[]);

    const afterOneWeek = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate()+6);
        return d.toISOString().split('T')[0];
    };
    return (
        <div className="mock-container">
            <Header title="나의 랭킹 히스토리"></Header>
            <button className="history-button">내 투자 내역 보러가기</button>
            <div className="history-list-box">
                {ranking && ranking.map((item, index)=>(
                    <div className='history-list' key={index}>
                        <span className='history-list-title'>시즌{index+1}</span>
                        <span className='history-list-date'>{item.result_date} ~ {afterOneWeek(item.result_date)}</span>
                        <span className='history-list-rank'>{item.result_rank}위</span>
                        <IoIosArrowForward className="forwardIcon" onClick={() => goHistoryDetail(item)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StockHistory;