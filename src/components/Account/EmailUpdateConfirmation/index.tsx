import "./index.scss";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Alert } from "@mui/material";
import BackButton from "../../widgets/Button/BackButton";
import Loader from "../../widgets/Loader";
import { confirmEmailUpdateRequest } from "../../../apis/web/web.api";

const EmailUpdateConfirmation = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [confirming, setConfirming] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            navigate("/marketplace/login");
        } else {
            confirmEmailUpdateRequest({
                token,
            })
                .then((data) => {
                    setSuccess(true);
                    setConfirming(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    setSuccess(false);
                    setConfirming(false);
                });
        }
    }, [searchParams, navigate]);

    return (
        <div id="EmailUpdateConfirmation">
            <div className="container">
                <Loader show={confirming} />
                {!confirming && (
                    <BackButton to="/marketplace/login" label="Login" />
                )}
                {!confirming && success && (
                    <Alert severity="success">
                        Your have successfully approved the email update
                        request! Please check your new email address for an
                        activation link.
                    </Alert>
                )}
                {!confirming && !success && (
                    <Alert severity="error">
                        Email update request failed. The link is either invalid
                        or expired!
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default EmailUpdateConfirmation;
