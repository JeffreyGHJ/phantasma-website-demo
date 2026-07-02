import "./index.scss";
import CurrencyIcon from "../../../CurrencyIcon";
import { Tab, Tabs } from "@mui/material";

const bookIcon = "/assets/images/icons/book_icon.png";
const lgIcon = "/assets/images/icons/lg.png";
const seIcon = "/assets/images/icons/souleater.png";

const KnowledgeTabs = ({ tab, setTab }) => {
    return (
        <Tabs
            id="KnowledgeTabs"
            value={tab}
            onChange={(e, tabIndex) => setTab(tabIndex)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
        >{/**
            <Tab
                className="tab"
                label={
                    <div className="inner">
                        <img src={bookIcon} width={22} />
                        The Story
                    </div>
                }
            />
         **/}
            <Tab
                className="tab"
                label={
                    <div className="inner">
                        <CurrencyIcon currency={"ECTO"} />
                        ECTO
                    </div>
                }
            />
            <Tab
                className="tab"
                label={
                    <div className="inner">
                        <img src={lgIcon} width={15} />
                        LittleGhosts
                    </div>
                }
            />
            <Tab
                className="tab"
                label={
                    <div className="inner">
                        <img src={seIcon} width={22} />
                        SoulEaters
                    </div>
                }
            />
        </Tabs>
    );
};

export default KnowledgeTabs;
