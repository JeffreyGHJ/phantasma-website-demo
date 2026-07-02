import "./index.scss";
import Footer from "../Footer/Index";
import Hero from "./Hero";
import RewardComponent from "../RewardComponent";
import Slider from "../MagicText";
import InfoComponent from "../InfoComponent";
import IntegrationComponent from "../IntegrationComponent";

const Home = () => {
    return (
        <div id="Home" className="scrollbar">
            <div className="landing">
                <video playsInline autoPlay muted loop id="bgVideo">
                    <source src="images/website.mp4" type="video/mp4" />
                </video>
                <Hero />
            </div>
            <InfoComponent
                headerText="Get ready for an adventure!"
                paragraphText="Step into Phantasma, a captivating MMORPG set in the magical Etherworld, now plagued by the dark SoulEaters & their army. As a LittleGhost, ally with others to defeat this evil and restore peace to the realm. Your epic quest begins!"
                imageUrl="/images/battle.png"
            />
            <RewardComponent
                headerText="Free Starter Kit"
                paragraphText="By simply joining the enchanting world of Phantasma and setting up your Vault, you're entitled to claim your free Starter Kit which includes the Lumina pet!"
                imageUrl="/images/starterkit.png"
            />
            <IntegrationComponent/>
            <Slider />

            <Footer />
        </div>
    );
};

export default Home;
