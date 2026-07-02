import "./index.scss";

import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tab,
    Tabs,
} from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import {
    allOfferActionTypes,
    offerActionTypes,
} from "../../constants/offerActionTypes";
import { useNavigate, useParams } from "react-router-dom";

import { ImageTag } from "../../../../utils/ImageUtil";
import Loading from "../../../widgets/Loading";
import NoWalletAlert from "../../../widgets/Alert/NoWalletAlert";
import OffersArmoriesCreated from "./Armory/Created";
import OffersArmoriesReceived from "./Armory/Received";
import OffersGhostsCreated from "./Ghosts/Created";
import OffersGhostsReceived from "./Ghosts/Received";
import OffersPetsCreated from "./Pets/Created";
import OffersPetsReceived from "./Pets/Received";
import OffersSuppliesCreated from "./Supply/Created";
import OffersSuppliesReceived from "./Supply/Received";
import RouteUtilModel from "../../../../models/util_models/RouteUtilModel";
import { getOfferActionTypeFromURL } from "../../../../utils/filterUtil";
import { useActiveWeb3React } from "../../../../hooks";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

const params = new URLSearchParams(window.location.search);

function getQueryStringFromStates({
    asset,
    offerActionType,
}: {
    asset: string;
    offerActionType: string;
}) {
    if (!Object.keys(RouteUtilModel.CATEGORY_ROUTES_TAB_MAP).includes(asset)) {
        return "/marketplace/profile/offers/ghosts";
    }
    const baseURI = `/marketplace/profile/offers/${asset}`;
    const queryStrings = [] as Array<string>;

    if (allOfferActionTypes.includes(offerActionType)) {
        queryStrings.push(`offerActionType=${offerActionType}`);
    }

    const queryString = queryStrings.join("&");

    if (queryString) {
        return `${baseURI}?${queryString}`;
    }

    return baseURI;
}

const Offers = () => {
    usePageTitle("Offers | Phantasma");
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "AssetCategories",
    });

    const { t: t_offer, ready: ready_offer } = useTranslation("translation", {
        keyPrefix: "ProfileSections.Offers",
    });

    const { account } = useActiveWeb3React();
    const { asset } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(
        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP[asset || ""] ||
            RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts
    );
    const [offerActionType, setOfferActionType] = useState(
        getOfferActionTypeFromURL(params)
    );

    const handleTabChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: number
    ) => {
        navigate(
            `/marketplace/profile/offers/${RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[newValue]}`
        );
    };

    const handleTabDropdownChange = (event: SelectChangeEvent<string>) => {
        const value = +event.target.value;
        navigate(
            `/marketplace/profile/offers/${RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[value]}`
        );
    };

    const handleOfferActionTypeChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            const _offerActionType = event.target.value;
            const queryString = getQueryStringFromStates({
                asset:
                    asset ||
                    RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts
                    ],
                offerActionType: _offerActionType,
            });
            navigate(queryString);
        },
        [asset, navigate]
    );

    useEffect(() => {
        if (asset && !(asset in RouteUtilModel.CATEGORY_ROUTES_TAB_MAP)) {
            navigate("/marketplace/profile/offers/ghosts");
        } else if (asset) {
            setTab(RouteUtilModel.CATEGORY_ROUTES_TAB_MAP[asset]);
        }
    }, [asset, navigate]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const _params = new URLSearchParams(window.location.search);
        const _offerActionType = getOfferActionTypeFromURL(_params);
        if (_offerActionType !== offerActionType) {
            setOfferActionType(_offerActionType);
        }
    });

    return (
        <div id="Offers">
            <section className="category-section">
                <div className="category-and-type">
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
                                        alt="Supplies"
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
                        <Tab
                            label={
                                <div className="tab">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Scrolls.png`}
                                        height="auto"
                                        width="22px"
                                        alt="Multipliers"
                                    />
                                    <span className="label">
                                        <Loading loading={!ready}>
                                            {t("multipliers", {
                                                defaultValue: "Multipliers",
                                            })}
                                        </Loading>
                                    </span>
                                </div>
                            }
                            disabled
                        />
                    </Tabs>
                    <div className="category-dropdown">
                        <FormControl
                            variant="outlined"
                            style={{
                                minWidth: "160px",
                            }}
                        >
                            <Select
                                value={tab}
                                onChange={handleTabDropdownChange}
                            >
                                <MenuItem
                                    value={
                                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP
                                            .ghosts
                                    }
                                >
                                    <div className="tab">
                                        <ImageTag
                                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
                                            height="auto"
                                            width="22px"
                                            alt="ghosts"
                                        />
                                        <span className="label ms-2">
                                            Ghosts
                                        </span>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    value={
                                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP
                                            .pets
                                    }
                                >
                                    <div className="tab">
                                        <ImageTag
                                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                                            height="auto"
                                            width="22px"
                                            alt="ghosts"
                                        />
                                        <span className="label ms-2">Pets</span>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    value={
                                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP
                                            .armory
                                    }
                                >
                                    <div className="tab">
                                        <ImageTag
                                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
                                            height="auto"
                                            width="22px"
                                            alt="ghosts"
                                        />
                                        <span className="label ms-2">
                                            Armory
                                        </span>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    value={
                                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP
                                            .supplies
                                    }
                                >
                                    <div className="tab">
                                        <ImageTag
                                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
                                            height="auto"
                                            width="22px"
                                            alt="ghosts"
                                        />
                                        <span className="label ms-2">
                                            Supplies
                                        </span>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    value={
                                        RouteUtilModel.CATEGORY_ROUTES_TAB_MAP
                                            .multipliers
                                    }
                                >
                                    <div className="tab">
                                        <ImageTag
                                            src={`${process.env.PUBLIC_URL}/assets/images/icons/Scrolls.png`}
                                            height="auto"
                                            width="22px"
                                            alt="ghosts"
                                        />
                                        <span className="label ms-2">
                                            Multipliers
                                        </span>
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="offer-type">
                        <FormControl
                            variant="outlined"
                            style={{
                                minWidth: "120px",
                            }}
                        >
                            <Select
                                value={offerActionType}
                                onChange={handleOfferActionTypeChange}
                            >
                                <MenuItem value={offerActionTypes.RECEIVED}>
                                    <Loading loading={!ready_offer}>
                                        {t_offer("received", {
                                            defaultValue: "Received",
                                        })}
                                    </Loading>
                                </MenuItem>
                                <MenuItem value={offerActionTypes.CREATED}>
                                    <Loading loading={!ready_offer}>
                                        {t_offer("created", {
                                            defaultValue: "Created",
                                        })}
                                    </Loading>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <CategoryContent tab={tab} offerActionType={offerActionType} />
            </section>
        </div>
    );
};

const CategoryContent = ({
    tab,
    offerActionType,
}: {
    tab: number;
    offerActionType: string;
}) => {
    switch (tab) {
        case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts: {
            if (offerActionType === offerActionTypes.CREATED) {
                return <OffersGhostsCreated />;
            }
            return <OffersGhostsReceived />;
        }
        case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.pets: {
            if (offerActionType === offerActionTypes.CREATED) {
                return <OffersPetsCreated />;
            }
            return <OffersPetsReceived />;
        }
        case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.supplies: {
            if (offerActionType === offerActionTypes.CREATED) {
                return <OffersSuppliesCreated />;
            }
            return <OffersSuppliesReceived />;
        }
        case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.armory: {
            if (offerActionType === offerActionTypes.CREATED) {
                return <OffersArmoriesCreated />;
            }
            return <OffersArmoriesReceived />;
        }
        default: {
            if (offerActionType === offerActionTypes.CREATED) {
                return <OffersGhostsCreated />;
            }
            return <OffersGhostsReceived />;
        }
    }
};

export default Offers;
