import React from 'react';
import gold from "../images/gold.png";
import silver from "../images/silver.png";
import bronze from "../images/bronze.png";

function RankList({gold}) {
  const images = [gold, silver, bronze];
    return (
      <>
        <div>
          <img src={images} alt="gold" />
          <div>
            <div>
              <span>김은정(kej01*****)</span>
            </div>
            <div className="">
              수익률 <span>+178.4%</span>
            </div>
          </div>
        </div>
      </>
    );
}

export default RankList;