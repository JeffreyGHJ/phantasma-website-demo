import "./index.scss";
import { useEffect, useState } from "react";
import {
    fetchNounceByWalletAddress,
    loginWithWalletAddress,
    registerWithWalletAddress,
} from "../../../apis/web/web.api";
import {
    useUpdateOverlay,
    useUpdateUser,
    useUser,
} from "../../../state/application/hooks";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountModel from "../../../models/AccountModel";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ExternalLink from "../../widgets/ExternalLink/ExternalLink";
import { Divider, Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InternalLink from "../../widgets/InternalLink";
import Loading from "../../widgets/Loading";
import LoginPageState from "./types/LoginPageState";
import QuickSetting from "../../widgets/SpeedDial/QuickSetting";
import RecaptchaDialog from "../../shared/RecaptchaDialog";
import WalletModal from "../../shared/WalletModal/WalletModal";
import { useActiveWeb3React } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useWalletModal } from "../../../hooks/useWalletModal";
import EmailPasswordLoginForm from "./EmailPasswordLoginForm";
import EmailPasswordSignupForm from "./EmailPasswordSignupForm";
import ForgetPasswordForm from "./ForgetPasswordForm";
import {
    loginWithWallet as login,
    signinAfterRegister as signin,
} from "./functions";

const passingPasswordScore = 50;
const Login = () => {
    usePageTitle("Login | Phantasma");

    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Login",
    });
    const { enqueueSnackbar } = useSnackbar();
    const [emailLogin, setEmailLogin] = useState(true);
    const { account, library } = useActiveWeb3React();
    const [pageState, setPageState] = useState<LoginPageState>("login");
    const navigate = useNavigate();
    const updateUser = useUpdateUser();
    const updateOverlay = useUpdateOverlay();
    const [recaptcha1, setRecaptcha1] = useState("");
    const [recaptcha2, setRecaptcha2] = useState("");
    const [recaptcha1Open, setRecaptcha1Open] = useState(false);
    const [recaptcha2Open, setRecaptcha2Open] = useState(false);
    const [nounce, setNounce] = useState("");
    const user = useUser();
    const overrideLocalSettings = AccountModel.useOverrideLocalSettings();

    const {
        isWalletModalOpen,
        handleModalOpen,
        handleModalClose,
        handleWalletClick,
    } = useWalletModal();

    const loginWithWallet = () => {
        login(
            recaptcha1,
            setRecaptcha1Open,
            enqueueSnackbar,
            library,
            updateOverlay,
            fetchNounceByWalletAddress,
            loginWithWalletAddress,
            updateUser,
            overrideLocalSettings,
            navigate,
            registerWithWalletAddress,
            setNounce,
            setRecaptcha2Open
        );
    };

    const signinAfterRegister = () => {
        signin(
            nounce,
            recaptcha2,
            enqueueSnackbar,
            library,
            loginWithWalletAddress,
            updateUser,
            overrideLocalSettings,
            updateOverlay,
            navigate
        );
    };

    useEffect(() => {
        if (account && user) {
            navigate("/marketplace/profile");
        }
    }, [account, user]);

    useEffect(() => {
        if (recaptcha1) {
            setRecaptcha1Open(false);
            loginWithWallet();
        }
    }, [recaptcha1]);

    useEffect(() => {
        if (nounce && recaptcha2) {
            //Login
            signinAfterRegister();
        }
    }, [nounce, recaptcha2]);

    return (
        <div id="Login" className="scrollbar">
            <div className="content">
                <Grid container direction="column">
                    <Grid item>
                        <Grid item>
                            <div className="login-option login-form pt-lg-2">
                                {!emailLogin && (
                                    <button
                                        className="email"
                                        onClick={() => {
                                            setEmailLogin(true);
                                        }}
                                    >
                                        <EmailOutlinedIcon />
                                        <span className="btn-text">
                                            <Loading
                                                loading={!ready}
                                                width="120px"
                                            >
                                                {t(
                                                    "login_with_email_password",
                                                    {
                                                        defaultValue:
                                                            "Login with Email",
                                                    }
                                                )}
                                            </Loading>
                                        </span>
                                    </button>
                                )}
                                {emailLogin && pageState === "login" && (
                                    <EmailPasswordLoginForm
                                        onPageStateChange={setPageState}
                                    />
                                )}
                                {emailLogin && pageState === "register" && (
                                    <EmailPasswordSignupForm
                                        onPageStateChange={setPageState}
                                    />
                                )}
                                {emailLogin &&
                                    pageState === "forgot-password" && (
                                        <ForgetPasswordForm
                                            onPageStateChange={setPageState}
                                        />
                                    )}
                            </div>
                        </Grid>
                        <Divider light={true} className={"mt-5 mb-5 divider"}>
                            OR
                        </Divider>
                        <div className="login-option">
                            <button
                                className="metamask"
                                type="submit"
                                onClick={() => {
                                    loginWithWallet();
                                }}
                            >
                                <AccountBalanceWalletOutlinedIcon />
                                <span className="btn-text">
                                    <Loading loading={!ready} width="120px">
                                        {t("login_with_wallet", {
                                            defaultValue: "Login with Wallet",
                                        })}
                                    </Loading>
                                </span>
                            </button>
                        </div>
                    </Grid>
                    <Grid item>
                        <div className="info mt-5">
                            <InfoIcon fontSize="large" />
                            <span className="info-text">
                                <Loading loading={!ready} width="120px">
                                    {t("by_continue_you_agree_to_our", {
                                        defaultValue:
                                            "By continuing, you agree to our",
                                    })}
                                </Loading>{" "}
                                <InternalLink to="">
                                    <Loading loading={!ready}>
                                        {t("terms_of_use", {
                                            defaultValue: "Terms of Use",
                                        })}
                                    </Loading>
                                </InternalLink>
                            </span>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <footer>
                <div>© Ghost Labs</div>

                <div className="discord">
                    <ExternalLink href="https://discord.gg/NrqgFxJF6k">
                        Discord
                    </ExternalLink>
                </div>

                <div className="terms">
                    <InternalLink to="">
                        <Loading loading={!ready}>
                            {t("terms_of_use", {
                                defaultValue: "Terms of Use",
                            })}
                        </Loading>
                    </InternalLink>
                </div>
            </footer>

            <WalletModal
                open={isWalletModalOpen}
                handleClose={handleModalClose}
                handleWalletClick={handleWalletClick}
            />
            <RecaptchaDialog
                open={recaptcha1Open}
                setRecaptcha={setRecaptcha1}
                onClose={() => {
                    setRecaptcha1Open(false);
                }}
            />
            <RecaptchaDialog
                open={recaptcha2Open}
                setRecaptcha={setRecaptcha2}
                onClose={() => {
                    setRecaptcha2Open(false);
                }}
            />
            <QuickSetting />
        </div>
    );
};

export default Login;
