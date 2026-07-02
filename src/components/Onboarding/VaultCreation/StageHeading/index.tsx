import "./index.scss";

const StageHeading = ({ stage }) => {
    return (
        <div id="StageHeading">
            {stage === 1 && "Register New Phantasma Account"}
            {stage === 2 && "Create Vault (Optional)"}
            {stage === 3 && "Download Phantasma"}
        </div>
    );
};

export default StageHeading;
