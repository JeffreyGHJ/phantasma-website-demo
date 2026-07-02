import "./index.scss";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Alert } from "@mui/material";
import BackButton from "../../widgets/Button/BackButton";
import Loader from "../../widgets/Loader";
import { activate } from "../../../apis/web/web.api";

const EmailVerification = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            navigate("/marketplace/login");
        } else {
            activate({
                token,
            })
                .then((data) => {
                    setSuccess(true);
                    setVerifying(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    setSuccess(false);
                    setVerifying(false);
                });
        }
    }, [searchParams, navigate]);

    return (
        <div id="EmailVerification">
            <div className="container">
                <Loader show={verifying} />
                {!verifying && (
                    <BackButton to="/marketplace/login" label="Login" />
                )}
                {!verifying && success && (
                    <Alert severity="success">
                        Your email has been successfully verified!
                    </Alert>
                )}
                {!verifying && !success && (
                    <Alert severity="error">
                        Email verification failed. The link is either invalid or
                        expired!
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
