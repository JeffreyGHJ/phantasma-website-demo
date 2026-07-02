import "./index.scss";

import PropTypes from "prop-types";

const LeftDrawerSidebar = (props) => {
    const { className, children, ...attributes } = props;
    return (
        <nav
            className={`widget LeftDrawerSidebar scrollbar ${className || ""}`}
            {...attributes}
        >
            {children}
        </nav>
    );
};

LeftDrawerSidebar.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
};

export default LeftDrawerSidebar;
