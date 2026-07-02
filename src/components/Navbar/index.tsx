import "./index.scss";

import { useEffect, useRef, useState } from "react";

import AssetUtilModel from "../../models/util_models/AssetUtilModel";
import ConnectButton from "../shared/ConnectButton";
import { ImageTag } from "../../utils/ImageUtil";
import { Link } from "react-router-dom";
import Loading from "../widgets/Loading";
import WalletModal from "../shared/WalletModal/WalletModal";
import { navItems } from "./constants";
import { useTranslation } from "react-i18next";
import { useWalletModal } from "../../hooks/useWalletModal";

const Navbar = () => {
    const { t, ready } = useTranslation("translation");

    // Claim rewards Menu anchorEl
    const [showLinks, setShowLinks] = useState(false);

    const linksContainerRef = useRef(null);
    const linksRef = useRef<HTMLUListElement | null>(null);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    useEffect(() => {
        const linksHeight = linksRef.current?.getBoundingClientRect().height;
        if (showLinks) {
            //@ts-ignore
            linksContainerRef.current.style.height = `${linksHeight + 30}px`;
        } else {
            //@ts-ignore
            linksContainerRef.current.style.height = "0px";
        }
    }, [showLinks]);

    return (
        <div id="NavWrapper" className={showLinks ? "links-open" : ""}>
            <nav id="Navbar" className="container">
                <div className="content">
                    <div>
                        <Link to="/" className="nav-item logo">
                            <ImageTag
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/phantasma-logo.png"
                                }
                                width="134px"
                                height="auto"
                            />
                        </Link>
                    </div>
                    <div className={`links-container`} ref={linksContainerRef}>
                        <ul className="links" ref={linksRef}>
                            {navItems.map((link) => {
                                const { id, url } = link;
                                console.log(link.text);
                                return (
                                    <li key={id}>
                                        <Loading loading={!ready}>
                                            <Link to={url}>{t(link.text)}</Link>
                                        </Loading>
                                    </li>
                                );
                            })}
                            <li className="connect-button-wrapper">
                                <ConnectButton />
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="right">
                            <div className="connect-button-wrapper">
                                <ConnectButton />
                            </div>
                            <div
                                className={`nav-toggle ${
                                    showLinks ? "open" : "close"
                                }`}
                                onClick={toggleLinks}
                            >
                                <ImageTag
                                    src={`${AssetUtilModel.IMAGE_PATH}/icons/menu.svg`}
                                    height="auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
