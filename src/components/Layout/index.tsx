import { useEffect, useState } from "react";

import MarketplaceNavbar from "../Navbar/MarketplaceNavbar";
import Navbar from "../Navbar";
import OverlayLoader from "../widgets/OverlayLoader";
import { useLocation } from "react-router-dom";
import { useOverlay } from "../../state/application/hooks";
import useSouleatersManager from "../../hooks/useSouleatersManager";

const RenderedNavbar = ({
    renderNoNavbar,
    renderMarketplaceNavbar,
}: {
    renderNoNavbar: boolean;
    renderMarketplaceNavbar: boolean;
}) => {
    if (renderNoNavbar) {
        return <></>;
    }

    if (renderMarketplaceNavbar) {
        return <MarketplaceNavbar />;
    }

    return <Navbar />;
};

const Layout = (props) => {
    const location = useLocation();
    const [renderMarketplaceNavbar, setRenderMarketplaceNavbar] =
        useState(false);
    const [renderNoNavbar, setRenderNoNavbar] = useState(false);
    const overlay = useOverlay();
    const { children } = props;

    // do not need any returned values, just mount the hook
    useSouleatersManager();

    useEffect(() => {
        if (!location) {
            return () => {};
        }

        setRenderNoNavbar(location.pathname === "/");
        setRenderMarketplaceNavbar(location.pathname !== "/");
        // setRenderMarketplaceNavbar(
        // 	location.pathname.startsWith('/marketplace') ||
        // 		location.pathname.startsWith('/wallet')
        // );

        // setRenderNoNavbar(
        // 	location.pathname.startsWith('/account/activation') ||
        // 		location.pathname.startsWith('/account/emailUpdateRequest') ||
        // 		location.pathname === '/'
        // );

        return () => {};
    }, [location]);

    return (
        <>
            <OverlayLoader show={overlay} />
            <MarketplaceNavbar />
            {children}
        </>
    );
};

export default Layout;
