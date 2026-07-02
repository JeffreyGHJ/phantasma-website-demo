import RegistrationComplete from "./RegistrationComplete";
import RegistrationForm from "./RegistrationForm";
import "./index.scss";

const Register = ({
    lastStage,
    nextStage,
    setPass,
    registerFinalized,
    setRegisterFinalized,
}) => {
    return (
        <>
            <div id="Register">
                {!registerFinalized ? (
                    <RegistrationForm
                        lastStage={lastStage}
                        setPass={setPass}
                        setRegisterFinalized={setRegisterFinalized}
                    />
                ) : (
                    <RegistrationComplete nextStage={nextStage} />
                )}
            </div>
        </>
    );
};

export default Register;
