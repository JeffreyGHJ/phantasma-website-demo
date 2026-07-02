import "./index.scss";
import CommunityTabs from "./CommunityTabs";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Vault from "../Marketplace/Vault";
import LootboxMinting from "../Mintings/LootboxMinting";
import NFtBridge from "../NftBridge";
import Dao from "../Dao/Dao";

const TAB_MAP = {
    dao: 0,
    mint: 1,
    bridge: 2,
    treasury: 3,
};

const TAB_REVERSE_MAP = {
    0: "dao",
    1: "mint",
    2: "bridge",
    3: "treasury",
};

const CommunityContent = ({ tab }: { tab: number }) => {
    if (tab === TAB_MAP.mint) return <LootboxMinting />;
    else if (tab === TAB_MAP.bridge) return <NFtBridge />;
    else if (tab === TAB_MAP.dao) return <Dao />;
    else return <Vault />;
};

const Community = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState(TAB_MAP.dao);

    const handleTabChange = (event, newValue) => {
        navigate(`/community/${TAB_REVERSE_MAP[newValue]}`);
    };

    useEffect(() => {
        const paths = location.pathname.split("/").filter((x) => x !== "");
        paths.length > 1 ? setTab(TAB_MAP[paths[1]]) : setTab(TAB_MAP.dao);
    }, [location]);

    return (
        <div id="Community" className="community-content-wrapper scrollbar">
            <CommunityTabs tab={tab} handleTabChange={handleTabChange} />
            <CommunityContent tab={tab} />
        </div>
    );
};

export default Community;
