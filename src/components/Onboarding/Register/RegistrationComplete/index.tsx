import "./index.scss";

const RegistrationComplete = ({ nextStage }) => {
    return (
        <div id="RegistrationComplete" className="onboarding-card">
            <div className="heading-group">
                <div className="heading">Registration Complete!</div>
                <div className="sub-heading-dark">
                    Your new account has been created
                </div>
            </div>
            <img src="/assets/images/characters/warrior.png" width={200} />
            <div className="message">See you in the Etherworld!</div>
            <div className="btn btn-blue" onClick={() => nextStage()}>
                Continue
            </div>
        </div>
    );
};

export default RegistrationComplete;
