import React, { useState } from "react";
import "./RaffleRoller.css";
import AppleIcon from "@mui/icons-material/Apple";
import LINKS from "../../constants/links";
import PurpleFilledButton from '../widgets/Button/FilledButton/PurpleFilledButton';

const knife_open_img = "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJG48ymmIWZqOf8MqjUxFRd4cJ5nqeW946n0FfgrRFqYWulIdSVdAI5NAqC-Fa2kOvv0Z-9vJ7KmidquCQr-z-DyAl0eh_q/257fx257f";
const awp_open_img = "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q42Ok_7hPoTdl3lW7Yt3iOuRrdT32wPk-UI9YW_xJo_HewJoZwuE8lbryejsh5bv7ZmYmiFjpGB8shCX1QG8/360fx360f";
const knife_open_txt = "★ Bayonet Doppler";
const awp_open_txt = "AWP Safari mesh";

const ITEMS = [
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/7.png",
        text: "Vyper Goggles",
        probability: 0.02,
        type: "rare"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/8.png",
        text: "Spring glasses",
        probability: 0.02,
        type: "rare"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/1.png",
        text: "3D Glasses",
        probability: 0.16,
        type: "common"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/2.png",
        text: "Aviator Cap",
        probability: 0.16,
        type: "common"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/3.png",
        text: "Black Santa Hat",
        probability: 0.16,
        type: "common"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/4.png",
        text: "Noun Dao",
        probability: 0.16,
        type: "common"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/5.png",
        text: "Trick or treat",
        probability: 0.16,
        type: "common"
    },
    {
        img:  process.env.PUBLIC_URL + "/assets/images/test/6.png",
        text: "Robin Hat",
        probability: 0.16,
        type: "common"
    }
];

const getRandomItem = () => {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < ITEMS.length; i++) {
        cumulativeProbability += ITEMS[i].probability;
        if (rand <= cumulativeProbability) {
            return ITEMS[i];
        }
    }
    return ITEMS[0]; // fallback, should not reach here if probabilities sum up to 1
};

const RaffleRoller = () => {
    const [items, setItems] = useState([]);
    const [margin, setMargin] = useState(0);
    const [stoppedItemIndex, setStoppedItemIndex] = useState(null);
    const [prizeName, setPrizeName] = useState("");
    const [isSpinning, setIsSpinning] = useState(false); // New state
    const [componentKey, setComponentKey] = useState(Date.now());



    const generateWinner = () => {
        // This function will determine the winner based on the probabilities
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (let item of ITEMS) {
            cumulativeProbability += item.probability;
            if (rand <= cumulativeProbability) {
                return item;
            }
        }
        return ITEMS[0];
    };

    const generateItemsListWithWinner = (winner) => {
        const items = [];
        const desiredStopPosition = 45; // This is the index at which the roller will stop
        for (let i = 0; i < 101; i++) {
            if (i === desiredStopPosition) {
                items.push(winner);
            } else {
                items.push(getRandomItem());
            }
        }
        return items;
    };

    const generate = () => {
        if (isSpinning) return; // Prevents triggering the spin if it's already spinning

        setComponentKey(Date.now())
        setIsSpinning(true); // Start spinning
        setMargin(0)
        setItems([])
        setPrizeName("")
        const winner = generateWinner();
        const itemsList = generateItemsListWithWinner(winner);
        setItems(itemsList);


        setTimeout(() => {
            setMargin(-6770);
        }, 500);

        setTimeout(() => {
            setPrizeName(winner.text);
            setIsSpinning(false); // Start spinning
            console.log("You won:", winner.text);
        }, 8500);
    };




    return (
        <div key={componentKey} className="raffle-wrapper">
            <div className="raffle-roller">
                <div id="round_draw_pointer">
                    <div id="round_draw_pointer_top"/>
                    <div id="round_draw_pointer_mid"/>
                    <div id="round_draw_pointer_bot"/> {/* Remove this if you don't need the bottom arrow */}
                </div>
                <div className="raffle-roller-holder">
                    <div className="raffle-roller-container" style={{transform: `translateX(${margin}px)`}}>
                    {items.map((item, index) => (
                            <div key={index} className={`case_item ${item.type}`}>
                                <div className="bottom-skin">{item.text}</div>
                                <img src={item.img} alt={item.text} className="case_item_image"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {prizeName && <div className="prize-text">Congrats, you have won a {prizeName}!</div>}
            <div className="button-container" >

                <PurpleFilledButton
                    disabled={isSpinning} // Disable button when spinning
                    onClick={generate}
                >
                    <div style={{ marginTop: '5px' }}>Spin</div>
                </PurpleFilledButton>
            </div>
            <div className="items-preview">
                {ITEMS.map((item, index) => (
                    <div key={index} className="item-preview">
                        <img src={item.img} alt={item.text} className="preview-image"/>
                        <div  className="item-name">{item.text}</div>
                        <div className="item-probability">{(item.probability * 100).toFixed(2)}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RaffleRoller;
