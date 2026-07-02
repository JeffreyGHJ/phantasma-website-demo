import "./index.scss";
import Loading from "../../widgets/Loading";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ImageTag } from "../../../utils/ImageUtil";

const Hero = () => {
  const { t, ready } = useTranslation("translation", {
    keyPrefix: "Home.Hero",
  });
  return (
    <div id="Hero" className="container">
      <div className="content">
        <div className="title">
          <Loading loading={!ready} width="230px">
            <ImageTag className="phantasmaLogo" src={process.env.PUBLIC_URL + "/images/phantasma-logo.png"} />
          </Loading>

          <Loading loading={!ready} width="280px">
            <div className="early-access">Early Access</div>
          </Loading>
        </div>

        <Loading loading={!ready} width="230px">
          <Link to="/onboarding">
            <div className="play-now-btn">PLAY FREE NOW</div>
          </Link>
        </Loading>
      </div>
    </div>
  );
};

export default Hero;
