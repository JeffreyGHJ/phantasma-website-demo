import "./index.scss";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CheckIcon from "@mui/icons-material/Check";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import CurrencyIcon from "../../../../CurrencyIcon";

const SUPPORTED_CURRENCIES = ["ECTO", "MATIC", "BNB"];

const ItemSort = ({
    SORTINGS,
    sortBy,
    setSortBy,
    setShowMobileMenu,
    currencies,
    toggleCurrency,
}) => {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor !== null);
    const openMenu = (e) => setAnchor(e.currentTarget);
    const closeMenu = () => setAnchor(null);

    const selectSort = (desiredSort) => {
        setSortBy(desiredSort);
        setShowMobileMenu(false);
        closeMenu();
    };

    return (
        <>
            <div className="sortings-menu-button " onClick={openMenu}>
                <MenuOpenIcon />
                {sortBy}
            </div>
            <Menu
                anchorEl={anchor}
                open={open}
                onClose={closeMenu}
                id="sortings-menu"
            >
                {Object.values(SORTINGS).map((sort: any) => (
                    <MenuItem
                        className={"menu-item " + (sort === sortBy && "active")}
                        onClick={() => selectSort(sort)}
                    >
                        {sort}
                        {sort === sortBy && <CheckIcon className="check" />}
                    </MenuItem>
                ))}
                <hr />
                {SUPPORTED_CURRENCIES.map((currency) => (
                    <MenuItem
                        className="menu-item"
                        onClick={() => toggleCurrency(currency)}
                    >
                        <div className="currency">
                            <CurrencyIcon currency={currency} />
                            {currency}
                        </div>
                        <div
                            id="radio-btn"
                            className={
                                currencies.includes(currency) ? "r-active" : ""
                            }
                        >
                            <div
                                id="radio-btn-inner"
                                className={
                                    currencies.includes(currency)
                                        ? "r-active-inner"
                                        : ""
                                }
                            />
                        </div>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ItemSort;
