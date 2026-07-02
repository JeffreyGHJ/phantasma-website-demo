import { useEffect, useState } from "react";
import CurrencyIcon from "../../../CurrencyIcon";
import "./index.scss";
import { usePurchasePage } from "../../../../hooks/usePurchasePage";

const Item = ({ item, classes = "", currencyToDisplay = "BNB" }) => {
    const { goToPurchasePage } = usePurchasePage();

    const [activeCurrency, setActiveCurrency] = useState(
        item[currencyToDisplay.toLowerCase()]
            ? currencyToDisplay
            : item.ecto
            ? "ECTO"
            : item.matic
            ? "MATIC"
            : "BNB"
    );

    useEffect(() => {
        if (item[currencyToDisplay.toLowerCase()]) {
            setActiveCurrency(currencyToDisplay);
        } else {
            item.ecto
                ? setActiveCurrency("ECTO")
                : item.matic
                ? setActiveCurrency("MATIC")
                : setActiveCurrency("BNB");
        }
    }, [currencyToDisplay, activeCurrency]);

    return (
        <div
            id="Item"
            className={classes}
            onClick={() => goToPurchasePage(item)}
        >
            <div className="item-content">
                <img
                    src={`${process.env.PUBLIC_URL}` + item.image_source}
                    className="img"
                />
                <div className="info-shadow" />
                <div className="item-info">{item.name}</div>
            </div>
            <div className="item-footer">
                <CurrencyIcon currency={activeCurrency} />
                <div className="item-value">
                    {item.free ||
                    Number(item[activeCurrency?.toLowerCase()]) === 0
                        ? "FREE"
                        : item[activeCurrency?.toLowerCase()]?.toLocaleString()}
                </div>
                <div className="price-glow" />
            </div>
        </div>
    );
};

export default Item;
