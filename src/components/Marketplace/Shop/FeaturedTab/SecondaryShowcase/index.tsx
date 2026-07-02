import "./index.scss";
import Carousel from "./Carousel";

const SecondaryShowcase = ({ shopItems, currencies, currencyToDisplay }) => {
    return (
        <div id="secondary-showcase">
            <Carousel
                items={shopItems.specials}
                currencies={currencies}
                currencyToDisplay={currencyToDisplay}
            />
        </div>
    );
};

export default SecondaryShowcase;
