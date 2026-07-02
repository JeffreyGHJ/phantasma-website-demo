import "./index.scss";
import { Tab, Tabs } from "@mui/material";
import { ImageTag } from "../../../../utils/ImageUtil";
import Loading from "../../../widgets/Loading";
import { useTranslation } from "react-i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";

const MarketTabs = ({ tab, handleTabChange }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "AssetCategories",
    });
    return (
        <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            className="CategoryTabs"
        >
            <Tab
                label={
                    <div className="tab">
                        <DashboardIcon
                            fontSize="large"
                            className="nav-item-icon"
                        />

                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("dashboard", {
                                    defaultValue: "Dashboard",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
                            height="auto"
                            width="22px"
                            alt="ghosts"
                        />

                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("littleghosts", {
                                    defaultValue: "LittleGhosts",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                            height="auto"
                            width="22px"
                            alt="pets"
                        />
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("ectoskeletons", {
                                    defaultValue: "EctoSkeletons",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
                            height="auto"
                            width="22px"
                            alt="armory"
                        />
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("armory", { defaultValue: "Armory" })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
                            height="auto"
                            width="22px"
                            alt="supplies"
                        />
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("supplies", {
                                    defaultValue: "Supplies",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/souleater_toon.png`}
                            height="auto"
                            width="22px"
                            alt="souleaters"
                        />
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("souleaters", {
                                    defaultValue: "SoulEaters",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            {/* <Tab
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Scrolls.png`}
                            height="auto"
                            width="22px"
                            alt="ghosts"
                        />
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("multipliers", {
                                    defaultValue: "Multipliers",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
                disabled
            /> */}
        </Tabs>
    );
};

export default MarketTabs;
