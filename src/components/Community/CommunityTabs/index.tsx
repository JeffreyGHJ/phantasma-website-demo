// import "./index.scss";
import { Tab, Tabs } from "@mui/material";
import { ImageTag } from "../../../utils/ImageUtil";
import Loading from "../../widgets/Loading";
import { useTranslation } from "react-i18next";

const CommunityTabs = ({ tab, handleTabChange }) => {
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
                        {/* <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
                            height="auto"
                            width="22px"
                            alt="ghosts"
                        /> */}

                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("dao", {
                                    defaultValue: "Vote",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        {/* <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
                            height="auto"
                            width="22px"
                            alt="mint"
                        /> */}
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("mint", { defaultValue: "Mint" })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        {/* <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                            height="auto"
                            width="22px"
                            alt="nft-bridge"
                        /> */}
                        <span className="label">
                            <Loading loading={!ready} width="40px">
                                {t("nft bridge", {
                                    defaultValue: "Nft Bridge",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
            <Tab
                label={
                    <div className="tab">
                        {/* <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
                            height="auto"
                            width="22px"
                            alt="ghosts"
                        /> */}

                        <span className="label">
                            <Loading loading={!ready} width="40px">
                             Treasury
                            </Loading>
                        </span>
                    </div>
                }
            />

        </Tabs>
    );
};

export default CommunityTabs;
