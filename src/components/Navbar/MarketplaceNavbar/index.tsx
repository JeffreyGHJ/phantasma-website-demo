import "./index.scss";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    useAccountBnbBalance,
    useOverrodeNavbarStickiness,
    useUser,
} from "../../../state/application/hooks";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { Grid } from "@mui/material";
import IconButton from "../../widgets/Button/IconButton/IconButton";
import { ImageTag } from "../../../utils/ImageUtil";
import Loading from "../../widgets/Loading";
import { MARKETPLACE_NAV_COMPONENTS } from "../../Marketplace/constants/navComponents";
import MenuIcon from "@mui/icons-material/Menu";
import RouteUtilModel from "../../../models/util_models/RouteUtilModel";
import SidebarOverlay from "../../widgets/Overlay/SidebarOverlay";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WalletModal from "../../shared/WalletModal/WalletModal";
import { displayAddress } from "../../../utils/StringUtil";
import { useAccountBnbBalanceDisplay } from "../../../hooks/useAccountBalanceDisplay";
import { useActiveWeb3React } from "../../../hooks";
import useNavbarMobileLayout from "../../../hooks/useNavbarMobileLayout";
import { useTranslation } from "react-i18next";
import { useWalletModal } from "../../../hooks/useWalletModal";
import useWindowSize from "../../../models/util_models/ScreenUtilModel/hooks/useWindowSize";
import MarketplaceNavSidebar from "./MarketplaceNavSidebar";

// const navComponents = ["dashboard", "vault", "profile", "login", "shop"];
const navComponents = [
    "home",
    "marketplace",
    "community",
    "shop",
    "profile",
    "login",
    "knowledge",
];

const MarketplaceNavbar = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceNavbar",
    });
    const { t: t_sidebar, ready: ready_sidebar } = useTranslation(
        "translation",
        {
            keyPrefix: "ProfileLayoutSidebar",
        }
    );
    const [navComponent, setNavComponent] = useState("");
    const [profileSection, setProfileSection] = useState("");
    const location = useLocation();
    const { account } = useActiveWeb3React();
    const navbarMobileLayout = useNavbarMobileLayout();
    const overrodeStickiness = useOverrodeNavbarStickiness();
    const [showSidebar, setShowSidebar] = useState(false);
    const accountBnbBalance = useAccountBnbBalanceDisplay({
        balance: useAccountBnbBalance(),
        decimal: 3,
    });
    const {
        isWalletModalOpen,
        handleModalOpen,
        handleModalClose,
        handleWalletClick,
    } = useWalletModal();

    // #region (Global redux)
    const user = useUser();
    // #endregion

    useEffect(() => {
        const paths = location.pathname.split("/").filter((x) => x !== "");
        // console.log("paths", paths);
        if (paths.length > 2) {
            // console.log("a: ", paths);
            let path = paths[2];
            if (paths[1] === "profile") {
                if (
                    [
                        RouteUtilModel.PROFILE_SECTIONS.DASHBOARD,
                        RouteUtilModel.PROFILE_SECTIONS.INVENTORY,
                        RouteUtilModel.PROFILE_SECTIONS.OFFERS,
                        RouteUtilModel.PROFILE_SECTIONS.CLAIM_REWARDS,
                        RouteUtilModel.PROFILE_SECTIONS.FAVORITES,
                        RouteUtilModel.PROFILE_SECTIONS.ACCOUNT_SETTINGS,
                        RouteUtilModel.PROFILE_SECTIONS.EARNING_CALCULATOR,
                    ].includes(path)
                ) {
                    setProfileSection(path);
                    setNavComponent(MARKETPLACE_NAV_COMPONENTS.PROFILE);
                }
            } else if (["ghost", "skeletons"].includes(paths[1])) {
                setNavComponent("marketplace");
            }
        } else if (paths.length > 0) {
            let path = paths[0];
            if (navComponents.includes(path)) setNavComponent(path);
            setProfileSection("");
        } else {
            setNavComponent("");
            setProfileSection("");
        }
    }, [location]);

    // useEffect(() => {
    //     console.log("current nav component: ", navComponent);
    // }, [navComponent]);

    return (
        <div id="NavbarContainer">
            <nav
                id="MarketplaceNavbar"
                className={` ${overrodeStickiness ? "zero-z-index" : ""}`}
            >
                <Grid
                    container
                    justifyContent="space-between"
                    className="full-height navbar-container"
                >
                    <Link to="/" className="nav-item logo">
                        <ImageTag
                            src={process.env.PUBLIC_URL + "/phantasma-logo.png"}
                            width="134px"
                            height="auto"
                        />
                    </Link>
                    <Grid item className="nav-flex ">
                        {!navbarMobileLayout && (
                            <>
                                <Link
                                    to="/marketplace/ghosts"
                                    className={`nav-item ${
                                        navComponent ===
                                        MARKETPLACE_NAV_COMPONENTS.MARKETPLACE
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <StorefrontRoundedIcon fontSize="large" />
                                        <span className="label">
                                            <Loading
                                                loading={!ready}
                                                width="50px"
                                            >
                                                {t("marketplace", {
                                                    defaultValue: "Marketplace",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/community"
                                    className={`nav-item ${
                                        navComponent === "community"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <GroupsIcon
                                            className="community-icon"
                                            fontSize="large"
                                        />
                                        <span className="label">
                                            <Loading
                                                loading={!ready}
                                                width="50px"
                                            >
                                                {t("community", {
                                                    defaultValue: "Community",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    to="/shop"
                                    className={`nav-item ${
                                        navComponent === "shop" ? "active" : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <ShoppingBagIcon fontSize="large" />
                                        <span className="label">
                                            <Loading
                                                loading={!ready}
                                                width="50px"
                                            >
                                                {t("shop", {
                                                    defaultValue: "Shop",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    to="/knowledge"
                                    className={`nav-item ${
                                        navComponent === "knowledge"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <TipsAndUpdatesIcon fontSize="large" />
                                        <span className="label">
                                            <Loading
                                                loading={!ready}
                                                width="50px"
                                            >
                                                {t("knowledge", {
                                                    defaultValue: "Knowledge",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>
                            </>
                        )}
                    </Grid>
                    <Grid item className="nav-flex-end navbar-end">
                        <AccountNavItems
                            setShowSidebar={setShowSidebar}
                            accountBnbBalance={accountBnbBalance}
                            navComponent={navComponent}
                        />
                    </Grid>
                </Grid>
            </nav>
            <MarketplaceNavSidebar
                account={account}
                user={user}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                ready_sidebar={ready_sidebar}
                t_sidebar={t_sidebar}
                navComponent={navComponent}
                MARKETPLACE_NAV_COMPONENTS={MARKETPLACE_NAV_COMPONENTS}
                handleModalOpen={handleModalOpen}
                profileSection={profileSection}
            />
            <WalletModal
                open={isWalletModalOpen}
                handleClose={handleModalClose}
                handleWalletClick={handleWalletClick}
            />
            {showSidebar && (
                <SidebarOverlay
                    onClick={() => {
                        setShowSidebar(false);
                    }}
                />
            )}
        </div>
    );
};

const AccountNavItems = ({
    setShowSidebar,
    accountBnbBalance,
    navComponent,
}: {
    setShowSidebar: Dispatch<SetStateAction<boolean>>;
    accountBnbBalance: number;
    navComponent: string;
}) => {
    const navbarMobileLayout = useNavbarMobileLayout();
    const { account } = useActiveWeb3React();
    const user = useUser();
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceNavbar",
    });

    const { width: windowWidth } = useWindowSize();

    const getLabel = () => {
        if (windowWidth > 1200) return "My Account";
        if (windowWidth > 900) return "Account";
        return "";
    };

    return (
        <>
            {navbarMobileLayout && (
                <IconButton
                    className="icon-btn"
                    onClick={() => {
                        setShowSidebar(true);
                    }}
                >
                    <MenuIcon fontSize="large" />
                </IconButton>
            )}
            {!navbarMobileLayout && account && (
                <span className="nav-item account-info wallet-info">
                    <Grid container className="no-wrap">
                        <Grid item className="align-self-center">
                            <AccountBalanceWalletOutlinedIcon fontSize="large" />
                        </Grid>
                        <Grid item className="label align-self-center">
                            <Grid container direction="column">
                                <Grid item>
                                    <div className="balance">
                                        {accountBnbBalance} BNB
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className="account">
                                        {displayAddress(account, 5, 4)}
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </span>
            )}
            {!navbarMobileLayout && !account && !user && (
                <Link to="/marketplace/login" className="nav-item">
                    <ExitToAppOutlinedIcon fontSize="large" />
                    <span className="label ms-1">
                        <Loading loading={!ready} width="40px">
                            {t("login", {
                                defaultValue: "Login",
                            })}
                        </Loading>
                    </span>
                </Link>
            )}
            {!navbarMobileLayout && (account || user) && (
                <Link
                    to="/marketplace/profile/dashboard"
                    className={`nav-item account-info ${
                        navComponent === MARKETPLACE_NAV_COMPONENTS.PROFILE
                            ? "active"
                            : ""
                    }`}
                >
                    <div className="wrapper no-wrap">
                        <AccountCircleIcon fontSize="large" />
                        <span className="label text-no-wrap">
                            {windowWidth >= 1400 && (
                                <Loading loading={!ready} width="50px">
                                    {t("my_account", {
                                        defaultValue: "My Account",
                                    })}
                                </Loading>
                            )}
                            {windowWidth < 1400 &&
                                windowWidth >= 1200 &&
                                "Account"}
                            {windowWidth < 1200 && account && (
                                <Grid item className="label align-self-center">
                                    <Grid container direction="column">
                                        <Grid item>
                                            <div className="balance">
                                                {accountBnbBalance} BNB
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <div className="account">
                                                {displayAddress(account, 5, 4)}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                        </span>
                    </div>
                </Link>
            )}
        </>
    );
};

export default MarketplaceNavbar;
