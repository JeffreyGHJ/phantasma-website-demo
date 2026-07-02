import PrimaryShowcase from "./PrimaryShowcase";
import SecondaryShowcase from "./SecondaryShowcase";
import "./index.scss";

const FeaturedTab = ({ setTab, shopItems, currencies, currencyToDisplay }) => {
    return (
        <div id="featured" className="scrollbar">
            <PrimaryShowcase
                setTab={setTab}
                shopItems={shopItems}
                currencies={currencies}
                currencyToDisplay={currencyToDisplay}
            />
            <SecondaryShowcase
                shopItems={shopItems}
                currencies={currencies}
                currencyToDisplay={currencyToDisplay}
            />
        </div>
    );
};

export default FeaturedTab;
