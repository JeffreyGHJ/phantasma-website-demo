import "./index.scss";
import Loading from "../widgets/Loading";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Footer",
    });

    const socialIcons = ["x.png", "discord.png", "telegram.png"]; // Add or modify the filenames as per your actual images
    const socialLinks = [
        "https://x.com/PhantasmaOnline",
        "https://discord.gg/GhostLabs",
        "https://t.me/LittleGhostsNFT",
    ]; // Add or modify the links corresponding to each icon

    return (
        <footer id="Footer">
            <div className="container">
                <div className="wrapper">
                    <div>
                        <div className="items">
                            <div>
                                <Loading loading={!ready}>
                                    <div>
                                        {t("privacy_policy", {
                                            defaultValue: "Privacy Policy",
                                        })}
                                    </div>
                                </Loading>
                            </div>
                            <div className="terms-icons-container">
                                <Loading loading={!ready}>
                                    <div>
                                        {t("terms_and_conditions", {
                                            defaultValue: "Terms & Conditions",
                                        })}
                                    </div>
                                </Loading>
                                <div className="social-icons">
                                    {socialIcons.map((icon, index) => (
                                        <a
                                            key={index}
                                            href={socialLinks[index]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={`/images/social/${icon}`}
                                                alt={icon.split(".")[0]}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="copyright">
                        Copyright ©{" "}
                        <span className="trademark">Ghost Labs</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
