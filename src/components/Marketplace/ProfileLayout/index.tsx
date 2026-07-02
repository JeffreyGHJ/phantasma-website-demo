import "./index.scss";

import AccountSettings from "./AccountSettings";
import ClaimRewards from "./ClaimRewards";
import Dashboard from "./Dashboard";
import EarningCalculator from "./EarningCalculator";
import Favorites from "./Favorites";
import Inventory from "./Inventory";
import Offers from "./Offers";
import QuickSetting from "../../widgets/SpeedDial/QuickSetting";
import RouteUtilModel from "../../../models/util_models/RouteUtilModel";
import WalletModal from "../../shared/WalletModal/WalletModal";
import { useActiveWeb3React } from "../../../hooks";
import useMobileLayout from "../../../hooks/useMobileLayout";
import { useParams } from "react-router";
import {
    useAccountEctoBalance,
    useUser,
} from "../../../state/application/hooks";
import { useWalletModal } from "../../../hooks/useWalletModal";
import { useMemo } from "react";
import { getHumanReadableLargeNumber } from "../../../utils/NumberUtil";
import ProfileBox from "./ProfileBox";
import ProfileNav from "./ProfileNav";

const Content = ({ section }: { section: string }) => {
    if (section === RouteUtilModel.PROFILE_SECTIONS.DASHBOARD) {
        return <Dashboard />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.INVENTORY) {
        return <Inventory />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.OFFERS) {
        return <Offers />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.FAVORITES) {
        return <Favorites />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.CLAIM_REWARDS) {
        return <ClaimRewards />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.ACCOUNT_SETTINGS) {
        return <AccountSettings />;
    } else if (section === RouteUtilModel.PROFILE_SECTIONS.EARNING_CALCULATOR) {
        return <EarningCalculator />;
    }

    return <Dashboard />;
};

const ProfileLayout = () => {
    const { section } = useParams();
    const { account } = useActiveWeb3React();
    const user = useUser();
    const mobileLayout = useMobileLayout();
    const accountEctoBalance = useAccountEctoBalance();

    // Local states
    const accountReadableEctoBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountEctoBalance,
            precision: 2,
        });
    }, [accountEctoBalance]);

    const {
        isWalletModalOpen,
        handleModalOpen,
        handleModalClose,
        handleWalletClick,
    } = useWalletModal();

    return (
        <div id="ProfileLayout">
            {!mobileLayout && (
                <div id="Sidebar" className="scrollbar">
                    <ProfileBox
                        user={user}
                        account={account}
                        handleModalOpen={handleModalOpen}
                    />
                    <ProfileNav
                        section={section}
                        user={user}
                        account={account}
                    />
                </div>
            )}
            <div
                id="Content"
                className={`scrollbar ${mobileLayout ? "full" : ""}`}
            >
                <Content section={section || ""} />
            </div>
            <WalletModal
                open={isWalletModalOpen}
                handleClose={handleModalClose}
                handleWalletClick={handleWalletClick}
            />
            <QuickSetting />
        </div>
    );
};

export default ProfileLayout;
