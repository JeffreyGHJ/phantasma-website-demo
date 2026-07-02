import "./index.scss";

import {
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate, useParams } from "react-router";

import CategoryTabs from "../../widgets/Tab/CategoryTabs";
import CommunityGhosts from "./CommunityGhosts";
import { ImageTag } from "../../../utils/ImageUtil";
import Loading from "../../widgets/Loading";
import Overview from "./Overview";
import { Tab } from "@mui/material";
import VaultPets from "./VaultPets";
import { isUndefined } from "lodash";
import { useTranslation } from "react-i18next";

const routesTabMap = {
    overview: 0,
    ghosts: 1,
    pets: 2,
    armory: 3,
    supplies: 4,
    multipliers: 5,
};

const routesTabReverseMap = {
    0: "overview",
    1: "ghosts",
    2: "pets",
    3: "armory",
    4: "supplies",
    5: "multipliers",
};

const Content = ({ asset }: { asset: string }) => {
    if (asset === routesTabReverseMap[routesTabMap.overview]) {
        return <Overview />;
    } else if (asset === routesTabReverseMap[routesTabMap.ghosts]) {
        return <CommunityGhosts />;
    } else if (asset === routesTabReverseMap[routesTabMap.pets]) {
        return <VaultPets />;
    }

    return <Overview />;
};

const Vault = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "AssetCategories",
    });

    const { asset } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(
        routesTabMap[asset || ""] || routesTabMap.overview
    );

    const handleTabChange = useCallback(
        (event: SyntheticEvent<Element, Event>, newValue: number) => {
            navigate(`/community/treasury/${routesTabReverseMap[newValue]}`);
        },
        [navigate]
    );

    const Prepends = useMemo(() => {
        return (
            <Tab
                onClick={() => {
                    handleTabChange(null as any, 0);
                }}
                label={
                    <div className="tab">
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/safe.png`}
                            height="auto"
                            width="22px"
                            alt="safe"
                        />
                        <span className="label">
                            <Loading loading={!ready}>
                                {t("overview", { defaultValue: "Overview" })}
                            </Loading>
                        </span>
                    </div>
                }
            />
        );
    }, [handleTabChange, ready, t]);

    useEffect(() => {
        if (!isUndefined(asset)) {
            setTab(routesTabMap[asset]);
        }
    }, [asset]);

    return (
        <div id="Vault">
            <CategoryTabs
                tab={tab}
                handleTabChange={handleTabChange}
                Prepends={Prepends}
            />
            <Content asset={asset || ""} />
        </div>
    );
};

export default Vault;
