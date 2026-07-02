import { useEffect, useState } from "react";
import "./index.scss";
import Item from "../Item";
import ItemNavMenu from "./ItemNavMenu";
import useWindowSize from "../../../../models/util_models/ScreenUtilModel/hooks/useWindowSize";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { filterAndSortItems } from "./functions";
import ItemSubFilters from "./ItemSubFilters";
import EmptyItem from "../Item/EmptyItem";

const SORTINGS = {
    FEATURED: "Featured",
    NEW: "New",
    OLD: "Old",
    PRICE_HIGH_LOW: "Price: High to Low",
    PRICE_LOW_HIGH: "Price: Low to High",
};

const ITEM_TYPES = {
    0: "All",
    1: "Lootboxes",
    2: "Appearance",
    3: "Emotes & Spray",
    4: "Clothing",
    5: "Weapons",
    6: "Armour",
    7: "Pets",
    8: "Utility",
};

const SUPPORTED_CURRENCIES = ["ECTO", "MATIC", "BNB"];

const ItemsTab = ({
    items,
    currencies,
    currencyToDisplay,
    setCurrencies,
    setCurrencyToDisplay,
}) => {
    const shopItems = Object.values(items); // every available item in the shop
    const [itemsToShow, setItemsToShow] = useState(Object.values(items));
    const [selectedItemType, setSelectedItemType] = useState(ITEM_TYPES[0]);
    const [subFilter, setSubFilter] = useState("All");
    const [sortBy, setSortBy] = useState(SORTINGS.FEATURED);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [emptyItems, setEmptyItems] = useState(0);
    const { width } = useWindowSize();

    const toggleCurrency = (currency) => {
        let res = [...currencies];
        if (res.includes(currency)) res.splice(res.indexOf(currency), 1);
        else res.push(currency);
        console.log(res);
        setCurrencies(res);
    };

    useEffect(() => {
        if (currencies.length === 0) setCurrencies(SUPPORTED_CURRENCIES);
        else if (!currencies.includes(currencyToDisplay))
            setCurrencyToDisplay(currencies[0]);
    }, [currencies]);

    // useEffect(() => {
    //     console.log("currency to display: ", currencyToDisplay);
    // }, [currencyToDisplay]);

    // useEffect(() => {
    //     console.log(currencies);
    // }, [currencies]);

    useEffect(() => {
        setSubFilter("All");
    }, [selectedItemType]);

    useEffect(() => {
        if (width > 850 && showMobileMenu) setShowMobileMenu(false);
    }, [showMobileMenu, width]);

    useEffect(() => {
        filterAndSortItems(
            shopItems,
            selectedItemType,
            sortBy,
            subFilter,
            setItemsToShow,
            width,
            setEmptyItems,
            currencies,
            SUPPORTED_CURRENCIES
        );
    }, [selectedItemType, sortBy, subFilter, width, currencies]);

    return (
        <div id="ItemsTab" className="">
            <div className="mobile-btn-container">
                <div
                    className="mobile-menu-btn"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <MenuOpenIcon />
                    {selectedItemType}
                </div>
            </div>

            <div className="items-tab-inner">
                <ItemNavMenu
                    SORTINGS={SORTINGS}
                    ITEM_TYPES={ITEM_TYPES}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedItemType={selectedItemType}
                    setSelectedItemType={setSelectedItemType}
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                    currencies={currencies}
                    toggleCurrency={toggleCurrency}
                />
                <div className="items">
                    <ItemSubFilters
                        shopItems={shopItems}
                        selectedItemType={selectedItemType}
                        subFilter={subFilter}
                        setSubFilter={setSubFilter}
                    />
                    <div className="items-grid-scroll scrollbar">
                        <div className="items-grid-container ">
                            <div className="items-grid ">
                                {itemsToShow.map((item) => (
                                    <Item
                                        key={(item as any).name}
                                        item={item}
                                        currencyToDisplay={currencyToDisplay}
                                    />
                                ))}
                                {emptyItems > 0 &&
                                    new Array(emptyItems).fill(0).map(() => {
                                        return <EmptyItem />;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsTab;
