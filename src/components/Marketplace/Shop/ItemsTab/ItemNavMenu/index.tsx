import "./index.scss";
import ItemSort from "../ItemSort";
import ItemTypeList from "../ItemTypeList";
import LeftDrawerSidebar from "../../../../widgets/Sidebar/LeftDrawerSidebar";
import CloseIcon from "@mui/icons-material/Close";

const ItemNavMenu = ({
    SORTINGS,
    ITEM_TYPES,
    sortBy,
    setSortBy,
    selectedItemType,
    setSelectedItemType,
    showMobileMenu,
    setShowMobileMenu,
    currencies,
    toggleCurrency,
}) => {
    return (
        <>
            {showMobileMenu && (
                <div id="overlay" onClick={() => setShowMobileMenu(false)} />
            )}
            <LeftDrawerSidebar className={showMobileMenu ? "show" : "clear"}>
                <CloseIcon
                    className="close-btn"
                    onClick={() => setShowMobileMenu(false)}
                />
                <div id="mobile-item-nav-menu">
                    <ItemSort
                        SORTINGS={SORTINGS}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        setShowMobileMenu={setShowMobileMenu}
                        currencies={currencies}
                        toggleCurrency={toggleCurrency}
                    />
                    <ItemTypeList
                        ITEM_TYPES={ITEM_TYPES}
                        selectedItemType={selectedItemType}
                        setSelectedItemType={setSelectedItemType}
                        setShowMobileMenu={setShowMobileMenu}
                    />
                </div>
            </LeftDrawerSidebar>

            <div id="item-nav-menu">
                <ItemSort
                    SORTINGS={SORTINGS}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setShowMobileMenu={setShowMobileMenu}
                    currencies={currencies}
                    toggleCurrency={toggleCurrency}
                />
                <ItemTypeList
                    ITEM_TYPES={ITEM_TYPES}
                    selectedItemType={selectedItemType}
                    setSelectedItemType={setSelectedItemType}
                    setShowMobileMenu={setShowMobileMenu}
                />
            </div>
        </>
    );
};

export default ItemNavMenu;
