import InternalLink from "../../../widgets/InternalLink";
import Loading from "../../../widgets/Loading";
import RightDrawerSidebar from "../../../widgets/Sidebar/RightDrawerSidebar";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import OutlinedButton from "../../../widgets/Button/OutlinedButton";
import { displayAddress } from "../../../../utils/StringUtil";
import RouteUtilModel from "../../../../models/util_models/RouteUtilModel";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { LogoutButton } from "../../../widgets/Button/LogoutButton";
import { DisconnectButton } from "../../../widgets/Button/DisconnectButton";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import SettingsEthernetOutlinedIcon from "@mui/icons-material/SettingsEthernetOutlined";
import { useEffect } from "react";

const MarketplaceNavSidebar = ({
    account,
    user,
    showSidebar,
    setShowSidebar,
    ready_sidebar,
    t_sidebar,
    navComponent,
    MARKETPLACE_NAV_COMPONENTS,
    handleModalOpen,
    profileSection,
}) => {
    return (
        <RightDrawerSidebar
            id="MarketplaceNavSidebar"
            className={`${showSidebar ? "show" : "clear"}`}
        >
            <ul className="nav-item-list">
                <li
                    className={`nav-item ${
                        navComponent === MARKETPLACE_NAV_COMPONENTS.MARKETPLACE
                            ? "active"
                            : ""
                    }`}
                    onClick={() => setShowSidebar(false)}
                >
                    <InternalLink to="marketplace/ghosts">
                        <StorefrontRoundedIcon
                            fontSize="large"
                            className="nav-item-icon"
                        />
                        <span className="nav-item-label">
                            <Loading loading={!ready_sidebar}>
                                {t_sidebar("marketplace", {
                                    defaultValue: "Marketplace",
                                })}
                            </Loading>
                        </span>
                    </InternalLink>
                </li>
                <li
                    className={`nav-item ${
                        navComponent === MARKETPLACE_NAV_COMPONENTS.VAULT
                            ? "active"
                            : ""
                    }`}
                    onClick={() => setShowSidebar(false)}
                >
                    <InternalLink to="/community">
                        <GroupsIcon
                            className="nav-item-icon"
                            fontSize="large"
                        />

                        <span className="nav-item-label">
                            <Loading loading={!ready_sidebar}>
                                {t_sidebar("community", {
                                    defaultValue: "Community",
                                })}
                            </Loading>
                        </span>
                    </InternalLink>
                </li>
                <li
                    className={`nav-item ${
                        navComponent === MARKETPLACE_NAV_COMPONENTS.SHOP
                            ? "active"
                            : ""
                    }`}
                    onClick={() => setShowSidebar(false)}
                >
                    <InternalLink to="shop">
                        <ShoppingBagIcon
                            fontSize="large"
                            className="nav-item-icon"
                        />

                        <span className="nav-item-label">
                            <Loading loading={!ready_sidebar}>
                                {t_sidebar("shop", {
                                    defaultValue: "Shop",
                                })}
                            </Loading>
                        </span>
                    </InternalLink>
                </li>
                <li
                    className={`nav-item ${
                        navComponent === MARKETPLACE_NAV_COMPONENTS.KNOWLEDGE
                            ? "active"
                            : ""
                    }`}
                    onClick={() => setShowSidebar(false)}
                >
                    <InternalLink to="knowledge">
                        <TipsAndUpdatesIcon
                            fontSize="large"
                            className="nav-item-icon"
                        />
                        <span className="nav-item-label">
                            <Loading loading={!ready_sidebar}>
                                {t_sidebar("knowledge", {
                                    defaultValue: "Knowledge",
                                })}
                            </Loading>
                        </span>
                    </InternalLink>
                </li>
                {(account || user) && (
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
                                            {account ? (
                                                `${t_sidebar("connected", {
                                                    defaultValue: "Connected",
                                                })}:`
                                            ) : (
                                                <OutlinedButton
                                                    onClick={() => {
                                                        handleModalOpen();
                                                    }}
                                                >
                                                    Connect Wallet
                                                </OutlinedButton>
                                            )}
                                        </Loading>
                                    </div>
                                    <div>
                                        {displayAddress(account || "", 5, 4)}
                                    </div>
                                </div>
                                {!user ? (
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
                                ) : (
                                    <div className="mt-3">
                                        <div className="status">
                                            Welcome {user.username}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                        <li
                            className={`nav-item ${
                                profileSection ===
                                RouteUtilModel.PROFILE_SECTIONS.DASHBOARD
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setShowSidebar(false)}
                        >
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
                        <li
                            className={`nav-item ${
                                profileSection ===
                                RouteUtilModel.PROFILE_SECTIONS.INVENTORY
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setShowSidebar(false)}
                        >
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
                        <li
                            className={`nav-item ${
                                profileSection ===
                                RouteUtilModel.PROFILE_SECTIONS.OFFERS
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setShowSidebar(false)}
                        >
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
                        {user && (
                            <li
                                className={`nav-item ${
                                    profileSection ===
                                    RouteUtilModel.PROFILE_SECTIONS.FAVORITES
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setShowSidebar(false)}
                            >
                                <InternalLink to="/marketplace/profile/favorites/ghosts">
                                    <FavoriteIcon
                                        fontSize="large"
                                        className="nav-item-icon"
                                    />
                                    <span className="nav-item-label">
                                        <Loading loading={!ready_sidebar}>
                                            {t_sidebar("favorites", {
                                                defaultValue: "Favorites",
                                            })}
                                        </Loading>
                                    </span>
                                </InternalLink>
                            </li>
                        )}
                        <li
                            className={`nav-item ${
                                profileSection ===
                                RouteUtilModel.PROFILE_SECTIONS.CLAIM_REWARDS
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setShowSidebar(false)}
                        >
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
                        <li
                            className={`nav-item ${
                                profileSection ===
                                RouteUtilModel.PROFILE_SECTIONS.ACCOUNT_SETTINGS
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setShowSidebar(false)}
                        >
                            <InternalLink to="/marketplace/profile/settings">
                                <SettingsIcon
                                    fontSize="large"
                                    className="nav-item-icon"
                                />
                                <span className="nav-item-label">
                                    <Loading loading={!ready_sidebar}>
                                        {t_sidebar("account_settings", {
                                            defaultValue: "Account Settings",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </li>
                        <li>
                            <div className="divider">
                                <Loading loading={!ready_sidebar}>
                                    {t_sidebar("tools", {
                                        defaultValue: "Tools",
                                    })}
                                </Loading>
                            </div>
                        </li>
                        <li
                            className={`nav-item`}
                            onClick={() => setShowSidebar(false)}
                        >
                            <InternalLink
                                to={RouteUtilModel.ROUTES.NFT_BRIDGE.get()}
                            >
                                <SettingsEthernetOutlinedIcon
                                    fontSize="large"
                                    className="nav-item-icon"
                                />
                                <span className="nav-item-label">
                                    <Loading loading={!ready_sidebar}>
                                        {t_sidebar("nft_bridge", {
                                            defaultValue: "NFT Bridge",
                                        })}
                                    </Loading>
                                </span>
                            </InternalLink>
                        </li>
                    </>
                )}
                {user && (
                    <li className="logout">
                        <LogoutButton />
                    </li>
                )}
                {account && (
                    <li className="disconnect">
                        <DisconnectButton />
                    </li>
                )}
                {!user && (
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
    );
};

export default MarketplaceNavSidebar;
