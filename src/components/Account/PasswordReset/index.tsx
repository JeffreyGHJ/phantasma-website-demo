import "./index.scss";

import { Alert, Grid } from "@mui/material";
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY_ALT } from "../../../constants/recaptchaSiteKeys";
import { FormEvent, useEffect, useState } from "react";
import {
    fetchUserEmailByPasswordResetToken,
    resetPassowrd,
} from "../../../apis/web/web.api";
import { useNavigate, useSearchParams } from "react-router-dom";

import BackButton from "../../widgets/Button/BackButton";
import ExternalLink from "../../widgets/ExternalLink/ExternalLink";
import InfoIcon from "@mui/icons-material/Info";
import Input from "../../widgets/Input";
import InternalLink from "../../widgets/InternalLink";
import Loader from "../../widgets/Loader";
import Loading from "../../widgets/Loading";
import PasswordStrengthMeter from "../../widgets/PasswordStrengthMeter";
import ReCAPTCHA from "react-google-recaptcha";
import usePageTitle from "../../../hooks/usePageTitle";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useUpdateOverlay } from "../../../state/application/hooks";
import { validateEmail } from "../../../utils/emailUtil";

const passingPasswordScore = 50;
const PasswordReset = () => {
    usePageTitle("Password Reset | Phantasma");

    const { t, ready } = useTranslation("translation", {
        keyPrefix: "PasswordReset",
    });
    const { enqueueSnackbar } = useSnackbar();

    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchingEmail, setFetchingEmail] = useState(true);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const _token = searchParams.get("token");
        if (!_token) {
            navigate("/marketplace/login");
        } else {
            setToken(_token);
            fetchUserEmailByPasswordResetToken({
                token: _token,
            })
                .then((response) => {
                    const res = response.data as {
                        data: {
                            email: string;
                        };
                    };
                    setEmail(res.data.email);
                    setFetchingEmail(false);
                })
                .catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        const err = error.response.data;
                        enqueueSnackbar(err.errMsg || "Unknown error", {
                            variant: "error",
                        });
                    } else {
                        console.log(error);
                        enqueueSnackbar("Unknown error", {
                            variant: "error",
                        });
                    }
                    setFetchingEmail(false);
                });
        }
    }, [searchParams, navigate]);

    return (
        <div id="PasswordReset">
            <div className="content scrollbar">
                <Loader show={fetchingEmail} />
                {!fetchingEmail && (
                    <BackButton to="/marketplace/login" label="Login" />
                )}
                {!fetchingEmail && email && (
                    <Grid container direction="column">
                        <Grid item>
                            <div className="login-option mt-5">
                                <PasswordResetForm
                                    email={email}
                                    token={token}
                                />
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
                )}
                {!fetchingEmail && !email && (
                    <Alert severity="error">
                        The link is either invalid or expired!
                    </Alert>
                )}
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
        </div>
    );
};

const PasswordResetForm = ({
    token,
    email,
}: {
    token: string;
    email: string;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "PasswordReset",
    });
    const navigate = useNavigate();
    const updateOverlay = useUpdateOverlay();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [recaptcha, setRecaptcha] = useState("");
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [disableSignUp, setDisableSignUp] = useState(true);
    const [passwordScore, setPasswordScore] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const onPasswordReset = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (!showRecaptcha) {
            setShowRecaptcha(true);
            return;
        }

        if (
            !email ||
            !isValidEmail ||
            !token ||
            !recaptcha ||
            !password ||
            !passwordConfirmation
        ) {
            return;
        }

        updateOverlay(true);
        resetPassowrd({
            email,
            recaptcha,
            password,
            password_confirmation: passwordConfirmation,
            token,
        })
            .then((response) => {
                updateOverlay(false);
                enqueueSnackbar("Password is successfully updated", {
                    variant: "success",
                });
                navigate("/marketplace/login");
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const err = error.response.data;
                    enqueueSnackbar(err.errMsg || "Unknown error", {
                        variant: "error",
                    });
                } else {
                    console.log(error);
                    enqueueSnackbar("Unknown error", {
                        variant: "error",
                    });
                }
                updateOverlay(false);
            });
    };

    useEffect(() => {
        if (showRecaptcha) {
            if (
                email &&
                password &&
                passwordConfirmation &&
                recaptcha &&
                isValidEmail &&
                passwordScore >= passingPasswordScore &&
                password === passwordConfirmation
            ) {
                setDisableSignUp(false);
                return () => {};
            }
        } else if (
            email &&
            password &&
            passwordConfirmation &&
            isValidEmail &&
            passwordScore >= passingPasswordScore &&
            password === passwordConfirmation
        ) {
            setDisableSignUp(false);
            return () => {};
        }
        setDisableSignUp(true);
        return () => {};
    }, [
        email,
        isValidEmail,
        password,
        passwordConfirmation,
        recaptcha,
        showRecaptcha,
        passwordScore,
    ]);

    useEffect(() => {
        setIsValidEmail(validateEmail(email));
    }, [email]);

    return (
        <form
            className="password-reset-form"
            onSubmit={(evt) => {
                onPasswordReset(evt);
            }}
        >
            <Grid container direction="column">
                <Grid item>
                    <div className="title">
                        <Loading loading={!ready}>
                            {t("password_reset", {
                                defaultValue: "Password Reset",
                            })}
                        </Loading>
                    </div>
                </Grid>
                <Grid item>
                    <div className="email-input">
                        {email && !isValidEmail && (
                            <div className="email-error">
                                <Loading loading={!ready}>
                                    {
                                        t("invalid_email", {
                                            defaultValue: "Invalid email",
                                        })!
                                    }
                                </Loading>
                            </div>
                        )}

                        <Loading loading={!ready}>
                            <Input
                                disabled
                                className="email"
                                type="email"
                                placeholder={t("email", {
                                    defaultValue: "Email",
                                })}
                                value={email}
                            />
                        </Loading>
                    </div>
                </Grid>
                <Grid item className="mt-4">
                    <Loading loading={!ready}>
                        <input
                            className="password"
                            type="password"
                            placeholder={t("new_password", {
                                defaultValue: "New Password",
                            })}
                            value={password}
                            onChange={(evt) => {
                                setPassword(evt.currentTarget.value);
                            }}
                        />
                    </Loading>
                </Grid>
                <Grid item className="mt-4">
                    <div className="password-confirmation-input">
                        {password &&
                            passwordConfirmation &&
                            password !== passwordConfirmation && (
                                <div className="password-confirmation-error">
                                    <Loading loading={!ready}>
                                        {
                                            t("passwords_not_match", {
                                                defaultValue:
                                                    "Passwords do not match",
                                            })!
                                        }
                                    </Loading>
                                </div>
                            )}

                        <Loading loading={!ready}>
                            <input
                                className="password-confirmation"
                                type="password"
                                placeholder={t("password_confirmation", {
                                    defaultValue: "Password confirmation",
                                })}
                                value={passwordConfirmation}
                                onChange={(evt) => {
                                    setPasswordConfirmation(
                                        evt.currentTarget.value
                                    );
                                }}
                            />
                        </Loading>
                    </div>

                    {password && (
                        <PasswordStrengthMeter
                            password={password}
                            onChange={(_score) => {
                                setPasswordScore(_score);
                            }}
                        />
                    )}
                </Grid>
                {RECAPTCHA_ENABLED && (
                    <Grid item className={`mt-4 ${!showRecaptcha ? "hide" : ""}`}>
                        <ReCAPTCHA
                            className="recaptcha"
                            sitekey={RECAPTCHA_SITE_KEY_ALT}
                            onChange={(token) => {
                                if (token) {
                                    setRecaptcha(token);
                                }
                            }}
                            onExpired={() => {
                                setRecaptcha("");
                            }}
                        />
                    </Grid>
                )}
                <Grid item className="mt-5">
                    <button className="register" disabled={disableSignUp}>
                        <span className="btn-text">
                            <Loading loading={!ready} width="120px">
                                {t("confirm_reset", {
                                    defaultValue: "Confirm Reset",
                                })}
                            </Loading>
                        </span>
                    </button>
                </Grid>
                <Grid item className="mt-5">
                    <Grid container justifyContent="center">
                        <Grid item>
                            <button
                                className="back-to-login"
                                onClick={() => {
                                    navigate("/marketplace/login");
                                }}
                            >
                                <Loading loading={!ready}>
                                    {
                                        t("back_to_login", {
                                            defaultValue: "Back to login",
                                        })!
                                    }
                                </Loading>
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default PasswordReset;
