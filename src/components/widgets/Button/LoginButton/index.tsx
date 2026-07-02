import "./index.scss";

import InternalLink from "../../InternalLink";
import Loading from "../../Loading";
import LoginIcon from "@mui/icons-material/Login";
import { useTranslation } from "react-i18next";

export const LoginButton = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.LoginButton",
    });

    return (
        <InternalLink to="/marketplace/login" className="widget LoginButton">
            <LoginIcon fontSize="large" className="nav-item-icon" />
            <span className="label">
                <Loading loading={!ready}>
                    {t("signin", { defaultValue: "Sign in" })}
                </Loading>
            </span>
        </InternalLink>
    );
};
