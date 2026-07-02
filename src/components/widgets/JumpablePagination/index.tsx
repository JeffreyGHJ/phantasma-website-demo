import "./index.scss";

import { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";

const JumpablePagination = ({
    currentPage,
    pages,
    onChange,
}: {
    currentPage: number;
    pages: number;
    onChange: (x: number) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.JumpablePagination",
    });

    const [tempPage, setTempPage] = useState(currentPage);

    const handleOnSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        onChange(tempPage);
    };

    useEffect(() => {
        setTempPage(currentPage);
    }, [currentPage]);

    return (
        <div className="pagination">
            <div className="widget JumpablePagination">
                <div className="left">
                    <button
                        className="navigation"
                        onClick={() => {
                            onChange(currentPage - 1);
                        }}
                    >
                        <ArrowBackIcon fontSize="large" />
                    </button>
                </div>
                <div className="middle">
                    <div className="page-label">
                        <Loading loading={!ready}>
                            {t("page", { defaultValue: "Page" })}
                        </Loading>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                        <div className="page-input">
                            <input
                                className="page"
                                type="search"
                                pattern="\d*"
                                value={tempPage}
                                onChange={(evt) => {
                                    setTempPage(+evt.currentTarget.value);
                                }}
                            />
                        </div>
                    </form>
                    <div className="page-total">
                        <Loading loading={!ready}>
                            {t("of", { defaultValue: "of" })} {pages}
                        </Loading>
                    </div>
                </div>
                <div className="right">
                    <button
                        className="navigation"
                        onClick={() => {
                            onChange(currentPage + 1);
                        }}
                    >
                        <ArrowForwardIcon fontSize="large" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JumpablePagination;
