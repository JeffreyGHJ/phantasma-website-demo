import "./index.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarketplaceArmories from "./Armory";
import MarketplaceGhosts from "./Ghosts";
import MarketplacePets from "./Pets";
import MarketplaceSupplies from "./Supplies";
import QuickSetting from "../../widgets/SpeedDial/QuickSetting";
import RouteUtilModel from "../../../models/util_models/RouteUtilModel";
import MarketTabs from "./MarketTabs";
import MarketplaceDashboard from "./MarketplaceDashboard";
import SoulEaters from "./SoulEaters";

const CATEGORY_ROUTES_TAB_MAP = {
    dashboard: 0,
    ghosts: 1,
    pets: 2,
    armory: 3,
    supplies: 4,
    souleaters: 5,
    // multipliers: 5,
};

const CATEGORY_ROUTES_TAB_REVERSE_MAP = {
    0: "dashboard",
    1: "ghosts",
    2: "pets",
    3: "armory",
    4: "supplies",
    5: "souleaters",
    // 5: "multipliers",
};

const CategoryContent = ({ tab }: { tab: number }) => {
    switch (tab) {
        case CATEGORY_ROUTES_TAB_MAP.dashboard: {
            return <MarketplaceDashboard />;
        }
        case CATEGORY_ROUTES_TAB_MAP.ghosts: {
            return <MarketplaceGhosts />;
        }
        case CATEGORY_ROUTES_TAB_MAP.pets: {
            return <MarketplacePets />;
        }
        case CATEGORY_ROUTES_TAB_MAP.armory: {
            return <MarketplaceArmories />;
        }
        case CATEGORY_ROUTES_TAB_MAP.supplies: {
            return <MarketplaceSupplies />;
        }
        case CATEGORY_ROUTES_TAB_MAP.souleaters: {
            return <SoulEaters />;
        }
        default:
            return <MarketplaceGhosts />;
    }
};

const Marketplace = () => {
    const { asset } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(
        CATEGORY_ROUTES_TAB_MAP[asset || ""] || CATEGORY_ROUTES_TAB_MAP.ghosts
    );

    const handleTabChange = (event, newValue) => {
        console.log(newValue);
        navigate(`/marketplace/${CATEGORY_ROUTES_TAB_REVERSE_MAP[newValue]}`);
    };

    useEffect(() => {
        if (asset && navigate && !(asset in CATEGORY_ROUTES_TAB_MAP)) {
            navigate("/marketplace/ghosts");
        } else if (asset) {
            setTab(CATEGORY_ROUTES_TAB_MAP[asset]);
        }
    }, [asset, navigate]);

    return (
        <div id="Marketplace">
            <MarketTabs tab={tab} handleTabChange={handleTabChange} />
            <CategoryContent tab={tab} />
            <QuickSetting />
        </div>
    );
};

export default Marketplace;
