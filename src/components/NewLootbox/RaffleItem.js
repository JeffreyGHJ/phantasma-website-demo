import React from 'react';

const shadow_open_img = "https://csgospeed.com/images/case_shadow.png";


const RaffleItem = ({ id, img, text, isWinning }) => {
    return (
        <div id={id} className={`case_item ${isWinning ? 'winning-item' : ''}`}>
            <div className="bottom-skin">{text}</div>
            <img src={img} className="case_item_image" alt="Raffle Item" />
        </div>
    );
};

export default RaffleItem;
