import "./index.scss";
import Item from "../../../Item";
import { useEffect, useState } from "react";

const MIN_ITEMS = 6;

const FeaturedItems = ({ featuredItems, currencyToDisplay }) => {
    const [items, setItems] = useState([...featuredItems]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        return () => clearInterval(timer as any);
    }, []);

    useEffect(() => {
        if (timer) clearInterval(timer);
        if (items.length > 0) {
            let timer = setInterval(() => rotateLeft(), 7000) as any;
            setTimer(timer);
        }
    }, [items]);

    const rotateLeft = () => {
        let rotatedItems = [] as any;
        rotatedItems = [...items];
        let moveToRight = rotatedItems.shift();
        rotatedItems.push(moveToRight);
        setItems(rotatedItems);
    };

    const rotateRight = () => {
        let rotatedItems = [] as any;
        rotatedItems = [...items];
        let moveToLeft = rotatedItems.pop();
        rotatedItems.unshift(moveToLeft);
        setItems(rotatedItems);
    };

    const positionClass = (index) => {
        if (index === 0) return " left ";
        else if (index === 1) return " active-1 ";
        else if (index === 2) return " active-2 ";
        else if (index === 3) return " active-3 ";
        else if (index === 4) return " active-4 ";
        else return " right ";
    };

    // add uid to items so they can be keyed
    useEffect(() => {
        let res = [] as any;
        let uid = 0;
        while (res.length < MIN_ITEMS) {
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
        setItems(res);
    }, [items.length]);

    return (
        <div id="featured-items">
            {items[0].uid !== undefined &&
                items.map((item, index) => {
                    if (index <= MIN_ITEMS) {
                        return (
                            <Item
                                classes={"carousel-item" + positionClass(index)}
                                item={item}
                                key={item.uid}
                                currencyToDisplay={currencyToDisplay}
                            />
                        );
                    } else return;
                })}
        </div>
    );
};

export default FeaturedItems;
