import { Tab, Tabs } from "@mui/material";
import "./index.scss";

const ShopNavbar = ({ tab, setTab }) => {
    return (
        <Tabs
            id="ShopNavbar"
            value={tab}
            onChange={(tabIndex) => setTab(tabIndex)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
        >
            <Tab className="tab" onClick={() => setTab(0)} label={"Featured"} />
            <Tab className="tab" onClick={() => setTab(1)} label={"Items"} />
        </Tabs>
    );
};

export default ShopNavbar;
