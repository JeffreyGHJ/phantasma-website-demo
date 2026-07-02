import "./index.scss";

import { Link, useParams } from "react-router-dom";
import {
    useAccountBnbBalance,
    useOverrodeNavbarStickiness,
} from "../../../state/application/hooks";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { COMMUNITY_NAV_COMPONENTS } from "../../Marketplace/constants/navComponents";
import { DisconnectButton } from "../../widgets/Button/DisconnectButton";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ExternalLink from "../../widgets/ExternalLink/ExternalLink";
import { Grid } from "@mui/material";
import IconButton from "../../widgets/Button/IconButton/IconButton";
import { ImageTag } from "../../../utils/ImageUtil";
import InternalLink from "../../widgets/InternalLink";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Loading from "../../widgets/Loading";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import RightDrawerSidebar from "../../widgets/Sidebar/RightDrawerSidebar";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarOverlay from "../../widgets/Overlay/SidebarOverlay";
import StorageIcon from "@mui/icons-material/Storage";
import { displayAddress } from "../../../utils/StringUtil";
import { useAccountBnbBalanceDisplay } from "../../../hooks/useAccountBalanceDisplay";
import { useActiveWeb3React } from "../../../hooks";
import useMobileLayout from "../../../hooks/useMobileLayout";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CommunityNavbar = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CommunityNavbar",
    });
    const { t: t_sidebar, ready: ready_sidebar } = useTranslation(
        "translation",
        {
            keyPrefix: "CommunityLayoutSidebar",
        }
    );

    const { section } = useParams();
    const { account } = useActiveWeb3React();
    const mobileLayout = useMobileLayout();
    const overrodeStickiness = useOverrodeNavbarStickiness();
    const [showSidebar, setShowSidebar] = useState(false);
    const accountBnbBalance = useAccountBnbBalanceDisplay({
        balance: useAccountBnbBalance(),
        decimal: 3,
    });

    return (
        <>
            <nav
                id="CommunityNavbar"
                className={` ${overrodeStickiness ? "zero-z-index" : ""}`}
            >
                <Grid
                    container
                    justifyContent="space-between"
                    className="full-height navbar-container"
                >
                    <Grid item className="align-self-center">
                        <Link to="/" className="nav-item logo">
                            <ImageTag
                                src={
                                    process.env.PUBLIC_URL + "/logo_styled.png"
                                }
                                width="120px"
                                height="auto"
                            />
                        </Link>

                        {!mobileLayout && (
                            <>
                                <Link
                                    to="/community/treasury"
                                    className={`nav-item ${
                                        section ===
                                        COMMUNITY_NAV_COMPONENTS.VAULT
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <StorageIcon fontSize="large" />
                                        <span className="label">
                                            <Loading loading={!ready}>
                                                {t("vault", {
                                                    defaultValue: "Vault",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/community/dao"
                                    className={`nav-item disabled ${
                                        section === COMMUNITY_NAV_COMPONENTS.DAO
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="wrapper">
                                        <PeopleIcon fontSize="large" />
                                        <span className="label">
                                            <Loading loading={!ready}>
                                                {t("dao", {
                                                    defaultValue: "DAO",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </Link>
                                <ExternalLink
                                    href="https://forums.littleghosts.com/"
                                    className={`nav-item`}
                                >
                                    <div className="wrapper">
                                        <PeopleIcon fontSize="large" />
                                        <span className="label">
                                            <Loading loading={!ready}>
                                                {t("forums", {
                                                    defaultValue: "Forums",
                                                })}
                                            </Loading>
                                        </span>
                                    </div>
                                </ExternalLink>
                            </>
                        )}
                    </Grid>
                    <Grid item className="align-self-center">
                        {!mobileLayout ? (
                            account ? (
                                <>
                                    <span className="nav-item account-info">
                                        <Grid container>
                                            <Grid
                                                item
                                                className="align-self-center"
                                            >
                                                <AccountBalanceWalletOutlinedIcon fontSize="large" />
                                            </Grid>
                                            <Grid
                                                item
                                                className="label align-self-center"
                                            >
                                                <Grid
                                                    container
                                                    direction="column"
                                                >
                                                    <Grid item>
                                                        <div className="balance">
                                                            {accountBnbBalance}{" "}
                                                            BNB
                                                        </div>
                                                    </Grid>
                                                    <Grid item>
                                                        <div className="account">
                                                            {displayAddress(
                                                                account,
                                                                5,
                                                                4
                                                            )}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </span>
                                    <Link
                                        to="/marketplace/profile/dashboard"
                                        className={`nav-item`}
                                    >
                                        <div className="wrapper">
                                            <AccountCircleIcon fontSize="large" />
                                            <span className="label">
                                                <Loading loading={!ready}>
                                                    {t("my_account", {
                                                        defaultValue:
                                                            "My Account",
                                                    })}
                                                </Loading>
                                            </span>
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/marketplace/login"
                                    className="nav-item"
                                >
                                    <ExitToAppOutlinedIcon fontSize="large" />
                                    <span className="label ms-1">
                                        <Loading loading={!ready}>
                                            {t("login", {
                                                defaultValue: "Login",
                                            })}
                                        </Loading>
                                    </span>
                                </Link>
                            )
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setShowSidebar(true);
                                }}
                            >
                                <MenuIcon fontSize="large" />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            </nav>
            <RightDrawerSidebar
                id="CommunityNavSidebar"
                className={`${showSidebar ? "show" : "clear"}`}
            >
                <ul className="nav-item-list">
                    <li
                        className={`nav-item disabled ${
                            section === COMMUNITY_NAV_COMPONENTS.VAULT
                                ? "active"
                                : ""
                        }`}
                    >
                        <InternalLink to="community/vault">
                            <StorageIcon
                                fontSize="large"
                                className="nav-item-icon"
                            />
                            <span className="nav-item-label">
                                <Loading loading={!ready_sidebar}>
                                    {t_sidebar("vault", {
                                        defaultValue: "Vault",
                                    })}
                                </Loading>
                            </span>
                        </InternalLink>
                    </li>
                    <li
                        className={`nav-item disabled ${
                            section === COMMUNITY_NAV_COMPONENTS.DAO
                                ? "active"
                                : ""
                        }`}
                    >
                        <InternalLink to="community/dao">
                            <PeopleIcon
                                fontSize="large"
                                className="nav-item-icon"
                            />
                            <span className="nav-item-label">
                                <Loading loading={!ready_sidebar}>
                                    {t_sidebar("dao", {
                                        defaultValue: "DAO",
                                    })}
                                </Loading>
                            </span>
                        </InternalLink>
                    </li>
                    <li className={"nav-item"}>
                        <ExternalLink href="https://forums.littleghosts.com/">
                            <PeopleIcon
                                fontSize="large"
                                className="nav-item-icon"
                            />
                            <span className="nav-item-label">
                                <Loading loading={!ready_sidebar}>
                                    {t_sidebar("forums", {
                                        defaultValue: "Forums",
                                    })}
                                </Loading>
                            </span>
                        </ExternalLink>
                    </li>
                    {account && (
                        <>
                            <li>
                                <div className="separator">
                                    <Loading loading={!ready_sidebar}>
                                        {t_sidebar("my_account", {
                                            defaultValue: "MY ACCOUNT",
                                        })}
                                    </Loading>
                                </div>
                                <div className="profile-box">
                                    <div className="address">
                                        <div>
                                            <Loading loading={!ready_sidebar}>
                                                {t_sidebar("connected", {
                                                    defaultValue: "Connected",
                                                })}
                                            </Loading>
                                        </div>
                                        <div>
                                            {displayAddress(
                                                account || "",
                                                5,
                                                4
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="status">
                                            <Loading loading={!ready_sidebar}>
                                                {t_sidebar("not_signed_in", {
                                                    defaultValue:
                                                        "Not signed In",
                                                })}
                                            </Loading>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className={`nav-item`}>
                                <InternalLink to="/marketplace/profile/dashboard">
                                    <AccountBoxIcon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("account", {
                                                defaultValue: "Account",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                            <li className={`nav-item`}>
                                <InternalLink to="/marketplace/profile/vault/ghosts">
                                    <Inventory2Icon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("inventory", {
                                                defaultValue: "Inventory",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                            <li className={`nav-item`}>
                                <InternalLink to="/marketplace/profile/offers/ghosts">
                                    <LocalOfferIcon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("offers", {
                                                defaultValue: "Offers",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                            <li className={`nav-item`}>
                                <InternalLink to="/marketplace/profile/rewards">
                                    <EmojiEventsIcon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("claim_rewards", {
                                                defaultValue: "Claim Rewards",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                            <li className={`nav-item`}>
                                <InternalLink to="/marketplace/profile/settings">
                                    <SettingsIcon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("account_settings", {
                                                defaultValue:
                                                    "Account Settings",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                        </>
                    )}
                    {account ? (
                        <li className="disconnect">
                            <DisconnectButton />
                        </li>
                    ) : (
                        <li className="login">
                            <InternalLink to="marketplace/login">
                                <ExitToAppOutlinedIcon
                                    fontSize="large"
                                    className="nav-item-icon"
                                />
                                <span className="nav-item-label">
                                    <Loading loading={!ready_sidebar}>
                                        {t_sidebar("login", {
                                            defaultValue: "Login",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </li>
                    )}
                </ul>
            </RightDrawerSidebar>
            {showSidebar && (
                <SidebarOverlay
                    onClick={() => {
                        setShowSidebar(false);
                    }}
                />
            )}
        </>
    );
};

export default CommunityNavbar;
