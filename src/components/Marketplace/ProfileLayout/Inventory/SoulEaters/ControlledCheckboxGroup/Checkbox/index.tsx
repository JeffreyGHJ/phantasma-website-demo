import "./index.scss";

import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";

const Checkbox = (props) => {
    const { checked, onChange, className, label, count, ...attributes } = props;
    return (
        <div
            className="widget Checkbox"
            onClick={() => {
                onChange(!checked);
            }}
        >
            <div
                className={`checkbox ${checked ? "checked" : ""}`}
                {...attributes}
            >
                <div className="inner">
                    <CheckIcon />
                </div>
            </div>
            {label && <div className="checkbox-label">{label}</div>}
            <div className="checkbox-count">{count}</div>
        </div>
    );
};

Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.any,
    count: PropTypes.number,
};

export default Checkbox;
