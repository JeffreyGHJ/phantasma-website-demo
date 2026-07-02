import { useEffect, useState } from "react";
import FeaturedTab from "./FeaturedTab";
import ItemsTab from "./ItemsTab";
import ShopNavbar from "./ShopNavbar";
import "./index.scss";
import ShopItems from "./shop-items.json";
import { useLocation, useNavigate } from "react-router";

const SUPPORTED_CURRENCIES = ["ECTO", "MATIC", "BNB"];

const getTab = (
    tab,
    setTab,
    shopItems,
    currencies,
    currencyToDisplay,
    setCurrencies,
    setCurrencyToDisplay
) => {
    switch (tab) {
        case 0:
            return (
                <FeaturedTab
                    setTab={setTab}
                    shopItems={shopItems}
                    currencies={currencies}
                    currencyToDisplay={currencyToDisplay}
                />
            );
        case 1:
            return (
                <ItemsTab
                    items={shopItems.items}
                    currencies={currencies}
                    currencyToDisplay={currencyToDisplay}
                    setCurrencies={setCurrencies}
                    setCurrencyToDisplay={setCurrencyToDisplay}
                />
            );
        default:
            return (
                <FeaturedTab
                    setTab={setTab}
                    shopItems={shopItems}
                    currencies={currencies}
                    currencyToDisplay={currencyToDisplay}
                />
            );
    }
};

const getInitialTab = (hash) => {
    if (hash === "#featured") return 0;
    if (hash === "#items") return 1;
    return 0;
};

const Shop = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tab, setTab] = useState(getInitialTab(location.hash));
    const [shopItems, setShopItems] = useState(ShopItems);
    const [timer, setTimer] = useState(null);
    const [currencies, setCurrencies] = useState(SUPPORTED_CURRENCIES);
    const [currencyToDisplay, setCurrencyToDisplay] = useState(
        SUPPORTED_CURRENCIES[0]
    );

    const rotateCurrencyToDisplay = () => {
        let currIndex = currencies.indexOf(currencyToDisplay);
        let nextIndex = (currIndex + 1) % currencies.length;
        if (nextIndex < 0) nextIndex = currencies.length + nextIndex;
        setCurrencyToDisplay(currencies[nextIndex]);
    };

    useEffect(() => {
        if (timer) clearInterval(timer);
        const t = setInterval(rotateCurrencyToDisplay, 3000);
        setTimer(t as any);
    }, [currencies, currencyToDisplay]);

    // change url based on selected tab
    useEffect(() => {
        if (tab === 0) navigate("/shop#featured", { replace: true });
        else if (tab === 1) navigate("/shop#items", { replace: true });
    }, [tab]);

    // change selected tab based on url
    useEffect(() => {
        if (location.hash.includes("#featured")) setTab(0);
        else if (location.hash.includes("#items")) setTab(1);
    }, [location]);

    return (
        <div id="Shop">
            <div className="content">
                <ShopNavbar tab={tab} setTab={setTab} />
                <div className="tab-content scrollbar">
                    {getTab(
                        tab,
                        setTab,
                        shopItems,
                        currencies,
                        currencyToDisplay,
                        setCurrencies,
                        setCurrencyToDisplay
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
