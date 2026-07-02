import "./index.scss";
import { useState } from "react";
import KnowledgeTabs from "./KnowledgeTabs";
import Ecto from "./Ecto";
import SE from "./SE";
import LG from "./LG";
import TheStory from "./TheStory";

const RenderedTab = ({ tab }) => {
    const Render = (tab) => {
        switch (tab) {
            case 0:
                return <Ecto />;
            case 1:
                return <LG />;
            case 2:
                return <SE />;
            default:
                return <div>ERROR: DEFAULT TAB</div>;
        }
    };

    return (
        <div id="RenderedTab" className="scrollbar">
            {Render(tab)}
        </div>
    );
};

const Knowledge = () => {
    const [tab, setTab] = useState(0);

    return (
        <div id="Knowledge">
            <KnowledgeTabs tab={tab} setTab={setTab} />
            <RenderedTab tab={tab} />
        </div>
    );
};

export default Knowledge;
