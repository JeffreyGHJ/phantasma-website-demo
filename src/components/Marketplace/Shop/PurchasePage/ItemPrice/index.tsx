import "./index.scss";
import CurrencyIcon from "../../../../CurrencyIcon";

export const ItemPrice = ({ item }) => {
    return (
        <div className="item-prices">
            {item.matic !== undefined && (
                <div className="price">
                    <CurrencyIcon currency={"MATIC"} width={32} height={32} />
                    <div>
                        {item.free ? "FREE" : item.matic.toLocaleString()}
                    </div>
                </div>
            )}
            {item.ecto !== undefined && (
                <div className="price">
                    <CurrencyIcon currency={"ECTO"} width={32} height={32} />
                    <div className="price-text">
                        {item.free ? "FREE" : item.ecto.toLocaleString()}
                    </div>
                </div>
            )}
            {item.bnb !== undefined && (
                <div className="price">
                    <CurrencyIcon currency={"BNB"} width={32} height={32} />
                    <div>{item.free ? "FREE" : item.bnb.toLocaleString()}</div>
                </div>
            )}
        </div>
    );
};
