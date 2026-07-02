import "./index.scss";

import { Tab, Tabs } from "@mui/material";
import { ImageTag } from "../../../../../utils/ImageUtil";
import Loading from "../../../../widgets/Loading";

const InventoryNav = ({ t, ready, tab, handleTabChange }) => {
    return (
        <Tabs
            id="InventoryNav"
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
        >
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
                            <Loading loading={!ready}>
                                {t("ghosts", {
                                    defaultValue: "Ghosts",
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
                            alt="SoulEaters"
                        />
                        <span className="label">
                            <Loading loading={!ready}>
                                {t("souleaters", {
                                    defaultValue: "SoulEaters",
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
                            alt="Pets"
                        />
                        <span className="label">
                            <Loading loading={!ready}>
                                {t("pets", {
                                    defaultValue: "Pets",
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
                            alt="Armory"
                        />
                        <span className="label">
                            <Loading loading={!ready}>
                                {t("armory", {
                                    defaultValue: "Armory",
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
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
                            height="auto"
                            width="22px"
                            alt="ghosts"
                        />
                        <span className="label">
                            <Loading loading={!ready}>
                                {t("supplies", {
                                    defaultValue: "Supplies",
                                })}
                            </Loading>
                        </span>
                    </div>
                }
            />
        </Tabs>
    );
};

export default InventoryNav;
