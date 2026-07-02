import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import {
    useUpdateOverlay,
    useUpdateUser,
} from "../../../../state/application/hooks";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import AccountModel from "../../../../models/AccountModel";
import { useNavigate } from "react-router";
import { register } from "../../../../apis/web/web.api";
import recaptchaTypes from "../../../../constants/recaptchaTypes";
import User from "../../../../constants/types/User";
import { Grid } from "@mui/material";
import Loading from "../../../widgets/Loading";
import PasswordStrengthMeter from "../../../widgets/PasswordStrengthMeter";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../../constants/recaptchaSiteKeys";
import { validateEmail } from "../../../../utils/emailUtil";
import { validateUsername } from "../../../../utils/usernameUtil";

const passingPasswordScore = 50;

const RegistrationForm = ({ lastStage, setPass, setRegisterFinalized }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Login",
    });
    const { enqueueSnackbar } = useSnackbar();
    const updateOverlay = useUpdateOverlay();

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [recaptcha, setRecaptcha] = useState("");
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [disableSignUp, setDisableSignUp] = useState(true);
    const [passwordScore, setPasswordScore] = useState(0);
    const [username, setUsername] = useState("");
    const recaptchaRef = useRef<any>();
    const updateUser = useUpdateUser();
    const overrideLocalSettings = AccountModel.useOverrideLocalSettings();

    const navigate = useNavigate();

    const clearStates = useCallback(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setRecaptcha("");
        setShowRecaptcha(false);
        setPasswordConfirmation("");
    }, [
        setUsername,
        setEmail,
        setPassword,
        setRecaptcha,
        setShowRecaptcha,
        setPasswordConfirmation,
    ]);

    const onSignupFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (!showRecaptcha) {
            setShowRecaptcha(true);
            return;
        }

        if (
            !username ||
            !isValidUsername ||
            !email ||
            !isValidEmail ||
            !password ||
            !passwordConfirmation ||
            !recaptcha
        ) {
            return;
        }

        updateOverlay(true);
        register({
            username,
            email,
            password,
            password_confirmation: passwordConfirmation,
            recaptcha,
            recaptchaType: recaptchaTypes.V2_CHECKBOX,
        })
            .then((res) => {
                enqueueSnackbar(
                    "Successfully registered! Please check your email for an activation email.",
                    { variant: "success" }
                );
                // Define interfaces to describe the expected shape of res.data
                interface AccessToken {
                    expires: string;
                    token: string;
                }

                interface ResponseData {
                    data: User;
                    accessToken: AccessToken;
                    refreshToken: AccessToken; // Assuming refreshToken has a similar structure to accessToken
                }
                // Assert the type of res.data
                const responseData = res.data as ResponseData;
                // Now TypeScript knows the shape of res.data, so you can access the nested token properties without ts-ignore
                localStorage.setItem(
                    "accessToken",
                    responseData.accessToken.token
                );
                localStorage.setItem(
                    "refreshToken",
                    responseData.refreshToken.token
                );
                setPass(password);
                clearStates();
                updateUser(responseData.data);
                overrideLocalSettings(responseData.data);
                updateOverlay(false);
                setRegisterFinalized(true);
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
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            });
    };

    useEffect(() => {
        if (showRecaptcha) {
            if (
                username &&
                email &&
                password &&
                passwordConfirmation &&
                recaptcha &&
                isValidEmail &&
                isValidUsername &&
                passwordScore >= passingPasswordScore &&
                password === passwordConfirmation
            ) {
                setDisableSignUp(false);
                return () => {};
            }
        } else if (
            username &&
            email &&
            password &&
            passwordConfirmation &&
            isValidEmail &&
            isValidUsername &&
            passwordScore >= passingPasswordScore &&
            password === passwordConfirmation
        ) {
            setDisableSignUp(false);
            return () => {};
        }
        setDisableSignUp(true);
        return () => {};
    }, [
        username,
        email,
        isValidEmail,
        isValidUsername,
        password,
        passwordConfirmation,
        recaptcha,
        showRecaptcha,
        passwordScore,
    ]);

    useEffect(() => {
        setIsValidEmail(validateEmail(email));
    }, [email]);

    useEffect(() => {
        setIsValidUsername(validateUsername(username));
    }, [username]);

    return (
        <form
            className="email-register-form"
            onSubmit={(evt) => {
                onSignupFormSubmit(evt);
            }}
        >
            <div className="form-heading">
                Your username and password will also be used for logging in to
                the Phantasma MMO
            </div>
            <Grid container direction="column">
                <Grid item>
                    <div className="username-input">
                        {username && !isValidUsername && (
                            <div className="username-error">
                                <Loading loading={!ready}>
                                    {
                                        t("invalid_username", {
                                            defaultValue:
                                                "Invalid username. Lowercase letters and numbers only. Must have 2-14 characters.",
                                        })!
                                    }
                                </Loading>
                            </div>
                        )}

                        <Loading loading={!ready}>
                            <input
                                className="username"
                                placeholder={t("username", {
                                    defaultValue: "Username",
                                })}
                                value={username}
                                onChange={(evt) => {
                                    setUsername(
                                        evt.currentTarget.value.toLowerCase()
                                    );
                                }}
                            />
                        </Loading>
                    </div>
                </Grid>
                <Grid item className="mt-4">
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
                            <input
                                className="email"
                                type="email"
                                placeholder={t("email", {
                                    defaultValue: "Email",
                                })}
                                value={email}
                                onChange={(evt) => {
                                    setEmail(evt.currentTarget.value);
                                }}
                            />
                        </Loading>
                    </div>
                </Grid>
                <Grid item className="mt-4">
                    <Loading loading={!ready}>
                        <input
                            className="password"
                            type="password"
                            placeholder={t("password", {
                                defaultValue: "Password",
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
                <Grid item className={`mt-4 ${!showRecaptcha ? "hide" : ""}`}>
                    <ReCAPTCHA
                        className="recaptcha"
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => {
                            if (token) {
                                setRecaptcha(token);
                            }
                        }}
                        onExpired={() => {
                            setRecaptcha("");
                        }}
                        theme="dark"
                    />
                </Grid>
                <Grid item className="mt-5">
                    <button className="register" disabled={disableSignUp}>
                        <span className="btn-text">
                            <Loading loading={!ready} width="120px">
                                Continue
                            </Loading>
                        </span>
                    </button>
                </Grid>
            </Grid>
            <div className="signin-redirect">
                Already created an account?
                <div className="signin-link" onClick={lastStage}>
                    Download here
                </div>
            </div>
        </form>
    );
};

export default RegistrationForm;
