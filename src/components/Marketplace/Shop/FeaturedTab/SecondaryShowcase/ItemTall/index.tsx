import "./index.scss";
import CurrencyIcon from "../../../../../CurrencyIcon";
import { useEffect, useState } from "react";
import { usePurchasePage } from "../../../../../../hooks/usePurchasePage";

const ItemTall = ({ item, styles, currencyToDisplay }) => {
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
            className={"item-tall " + styles}
            onClick={() => goToPurchasePage(item)}
        >
            <div className="item-content">
                <div className="img-container">
                    <img
                        src={`${process.env.PUBLIC_URL}` + item.image_source}
                        className="img"
                    />
                </div>
                <div className="item-info text-shadow">
                    <div className="item-header">NEW</div>
                    <div className="item-name">{item?.name || "name"}</div>
                </div>
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

export default ItemTall;
