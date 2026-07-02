import "./index.scss";

import {
    useAccountBusdBalance,
    useAccountEctoBalance,
    useAccountWbnbBalance,
    useMemoryMode,
    useUser,
} from "../../../../state/application/hooks";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InventoryArmory from "./Armory";
import InventoryGhosts from "./Ghosts";
import InventoryPets from "./Pets";
import InventorySupply from "./Supply";
import { getHumanReadableLargeNumber } from "../../../../utils/NumberUtil";
import { useActiveWeb3React } from "../../../../hooks";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import InventorySoulEaters from "./SoulEaters";
import CreateVault from "./CreateVault";
import InventoryNav from "./InventoryNav";
import Balance from "./Balance";
import { Supplies } from "./Supplies";
import React from "react";

const CATEGORY_ROUTES_TAB_MAP = {
    ghosts: 0,
    souleaters: 1,
    pets: 2,
    armory: 3,
    supplies: 4,
};

const CATEGORY_ROUTES_TAB_REVERSE_MAP = {
    0: "ghosts",
    1: "souleaters",
    2: "pets",
    3: "armory",
    4: "supplies",
};

const CategoryContent = React.memo(({ tab }: { tab: number }) => {
    const memoryMode = useMemoryMode();

    return useMemo(() => {
        switch (tab) {
            case CATEGORY_ROUTES_TAB_MAP.ghosts: {
                return <InventoryGhosts />;
            }
            case CATEGORY_ROUTES_TAB_MAP.pets: {
                return <InventoryPets />;
            }
            case CATEGORY_ROUTES_TAB_MAP.armory: {
                return <InventoryArmory />;
            }
            case CATEGORY_ROUTES_TAB_MAP.supplies: {
                return memoryMode ? <Supplies /> : <InventorySupply />;
            }
            case CATEGORY_ROUTES_TAB_MAP.souleaters: {
                return <InventorySoulEaters />;
            }
            default:
                return <InventoryGhosts />;
        }
    }, [tab, memoryMode]);
});

const Inventory = () => {
    usePageTitle("Vault | Phantasma");
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "AssetCategories",
    });

    const { account } = useActiveWeb3React();
    const { asset } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(
        CATEGORY_ROUTES_TAB_MAP[asset || ""] || CATEGORY_ROUTES_TAB_MAP.ghosts
    );

    // Global states
    const accountEctoBalance = useAccountEctoBalance();
    const accountBusdBalance = useAccountBusdBalance();
    const accountWbnbBalance = useAccountWbnbBalance();
    const user = useUser();

    // Local states
    const accountReadableEctoBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountEctoBalance,
            precision: 2,
        });
    }, [accountEctoBalance]);

    const accountReadableBusdBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountBusdBalance,
            precision: 2,
        });
    }, [accountBusdBalance]);

    const accountReadableWbnbBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountWbnbBalance,
            precision: 2,
        });
    }, [accountWbnbBalance]);

    const handleTabChange = (event, newValue) => {
        navigate(
            `/marketplace/profile/vault/${CATEGORY_ROUTES_TAB_REVERSE_MAP[newValue]}`
        );
    };

    useEffect(() => {
        if (asset && navigate && !(asset in CATEGORY_ROUTES_TAB_MAP)) {
            navigate("/marketplace/profile/vault/ghosts");
        }
    }, []); //asset and navigate are already defined in the beginning

    useEffect(() => {
        if (asset) {
            setTab(CATEGORY_ROUTES_TAB_MAP[asset]);
        }
    }, [asset]);

    return (
        <div id="Inventory">
            <Balance accountReadableEctoBalance={accountReadableEctoBalance} />
            <CreateVault user={user} />
            <section className="category-section">
                <InventoryNav
                    t={t}
                    ready={ready}
                    tab={tab}
                    handleTabChange={handleTabChange}
                />
                <CategoryContent tab={tab} />
            </section>
        </div>
    );
};

export default Inventory;
