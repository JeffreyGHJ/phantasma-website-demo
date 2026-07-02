import { Grid } from "@mui/material";
import "./index.scss";

import SettingsEthernetOutlinedIcon from "@mui/icons-material/SettingsEthernetOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RouteUtilModel from "../../../../models/util_models/RouteUtilModel";
import InternalLink from "../../../widgets/InternalLink";
import Loading from "../../../widgets/Loading";
import { LogoutButton } from "../../../widgets/Button/LogoutButton";
import { LoginButton } from "../../../widgets/Button/LoginButton";
import { DisconnectButton } from "../../../widgets/Button/DisconnectButton";
import { useTranslation } from "react-i18next";

const ProfileNav = ({ section, user, account }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileLayoutSidebar",
    });

    return (
        <div id="ProfileNav">
            <div className="wrapper-item">
                <Grid item>
                    <Grid container direction="column" className="nav-items">
                        <Grid
                            item
                            className={`nav-item ${
                                section ===
                                RouteUtilModel.PROFILE_SECTIONS.DASHBOARD
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <InternalLink to="/marketplace/profile/dashboard">
                                <AccountBoxOutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("account", {
                                            defaultValue: "Account",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                        <Grid
                            item
                            className={`nav-item ${
                                section ===
                                RouteUtilModel.PROFILE_SECTIONS.INVENTORY
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <InternalLink to="/marketplace/profile/vault/ghosts">
                                <Inventory2OutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("inventory", {
                                            defaultValue: "Vault",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                        <Grid
                            item
                            className={`nav-item ${
                                section ===
                                RouteUtilModel.PROFILE_SECTIONS.OFFERS
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <InternalLink to="/marketplace/profile/offers/ghosts">
                                <LocalOfferOutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("offers", {
                                            defaultValue: "Offers",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                        {user && (
                            <Grid
                                item
                                className={`nav-item ${
                                    section ===
                                    RouteUtilModel.PROFILE_SECTIONS.FAVORITES
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <InternalLink to="/marketplace/profile/favorites/ghosts">
                                    <FavoriteBorderIcon />
                                    <span className="label">
                                        <Loading loading={!ready}>
                                            {t("favorites", {
                                                defaultValue: "Favorites",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </Grid>
                        )}
                        <Grid
                            item
                            className={`nav-item ${
                                section ===
                                RouteUtilModel.PROFILE_SECTIONS.CLAIM_REWARDS
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <InternalLink to="/marketplace/profile/rewards">
                                <EmojiEventsOutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("claim_rewards", {
                                            defaultValue: "Claim Rewards",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                        <Grid
                            item
                            className={`nav-item ${
                                section ===
                                RouteUtilModel.PROFILE_SECTIONS.ACCOUNT_SETTINGS
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <InternalLink
                                to={RouteUtilModel.ROUTES.MARKETPLACE.PROFILE.SETTINGS.get()}
                            >
                                <SettingsOutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("account_settings", {
                                            defaultValue: "Account Settings",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                        <Grid item className={`nav-item`}>
                            <div className="nav-label">
                                <Loading loading={!ready}>
                                    {t("tools", {
                                        defaultValue: "Tools",
                                    })}
                                </Loading>
                            </div>
                        </Grid>
                        <Grid item className={`nav-item`}>
                            <InternalLink
                                to={RouteUtilModel.ROUTES.NFT_BRIDGE.get()}
                            >
                                <SettingsEthernetOutlinedIcon />
                                <span className="label">
                                    <Loading loading={!ready}>
                                        {t("nft_bridge", {
                                            defaultValue: "NFT Bridge",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            {user && <LogoutButton />}
            {!user && <LoginButton />}
            {account && <DisconnectButton />}
        </div>
    );
};

export default ProfileNav;
