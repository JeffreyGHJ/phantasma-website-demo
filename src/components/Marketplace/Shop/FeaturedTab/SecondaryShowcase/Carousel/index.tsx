import { useEffect, useState } from "react";
import "./index.scss";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ItemTall from "../ItemTall";

const Carousel = ({ items, currencies, currencyToDisplay }) => {
    const [carouselItems, setCarouselItems] = useState([]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        return () => clearInterval(timer as any);
    }, []);

    useEffect(() => {
        if (timer) clearInterval(timer);
        if (carouselItems.length > 0) {
            let timer = setInterval(() => rotateLeft(), 9000) as any;
            setTimer(timer);
        }
    }, [carouselItems]);

    const rotateLeft = () => {
        let rotatedItems = [] as any;
        rotatedItems = [...carouselItems];
        let moveToRight = rotatedItems.shift();
        rotatedItems.push(moveToRight);
        setCarouselItems(rotatedItems);
    };

    const rotateRight = () => {
        let rotatedItems = [] as any;
        rotatedItems = [...carouselItems];
        let moveToLeft = rotatedItems.pop();
        rotatedItems.unshift(moveToLeft);
        setCarouselItems(rotatedItems);
    };

    useEffect(() => {
        let res = [] as any;
        let uid = 0;
        while (res.length < 5) {
            for (let item of Object.values(items) as any) {
                // console.log(item);
                let objCopy = {
                    ...item,
                    uid: uid++,
                };
                res.push(objCopy);
            }
        }
        // console.log(res);
        setCarouselItems(res);
    }, [items]);

    return (
        <div id="carousel">
            <div className="header">
                <div className="nav-arrows">
                    <div className="nav-arrow" onClick={() => rotateRight()}>
                        <NavigateBeforeIcon />
                    </div>
                    <div className="nav-arrow" onClick={() => rotateLeft()}>
                        <NavigateNextIcon />
                    </div>
                </div>
            </div>
            <div className="viewport">
                {carouselItems.map((item: any, index) => {
                    if (index === 0) {
                        return (
                            <ItemTall
                                key={item.name + (item?.uid || "")}
                                styles={"left"}
                                item={item}
                                currencyToDisplay={currencyToDisplay}
                            />
                        );
                    } else if (index === 1) {
                        return (
                            <ItemTall
                                key={item.name + (item?.uid || "")}
                                styles={"active-left"}
                                item={item}
                                currencyToDisplay={currencyToDisplay}
                            />
                        );
                    } else if (index === 2) {
                        return (
                            <ItemTall
                                key={item.name + (item?.uid || "")}
                                styles={"active-right"}
                                item={item}
                                currencyToDisplay={currencyToDisplay}
                            />
                        );
                    } else if (index === 3) {
                        return (
                            <ItemTall
                                key={item.name + (item?.uid || "")}
                                styles={"right"}
                                item={item}
                                currencyToDisplay={currencyToDisplay}
                            />
                        );
                    } else return;
                })}
            </div>
        </div>
    );
};

export default Carousel;
