import "./index.scss";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useEffect, useState } from "react";
import FeaturedItems from "./FeaturedItems";

const PrimaryShowcase = ({
    setTab,
    shopItems,
    currencies,
    currencyToDisplay,
}) => {
    const [index, setIndex] = useState(0);
    const [timer, setTimer] = useState(null);
    const [main, setMain] = useState(shopItems.featured_content[0]);

    useEffect(() => {
        return () => clearInterval(timer as any);
    }, []);

    useEffect(() => {
        if (timer) clearInterval(timer);
        const newTimer = setInterval(() => {
            shopItems.featured_content[index + 1]
                ? setIndex(index + 1)
                : setIndex(0);
        }, 11000) as any;
        setTimer(newTimer);
    }, [shopItems, index]);

    useEffect(() => {
        setMain(shopItems.featured_content[index]);
    }, [index, shopItems]);

    return (
        <div id="primary-showcase">
            <div className="showcase-header">
                {/* buttons like the nav arrows may need to appear here */}
            </div>
            <div className="showcase-body">
                <div className="main">
                    <div className="img-container">
                        {Object.values(shopItems.featured_content).map(
                            (item: any, index) => {
                                // console.log(item);
                                return (
                                    <img
                                        key={index}
                                        src={
                                            `${process.env.PUBLIC_URL}` +
                                            item.image_source
                                        }
                                        className={
                                            "img" +
                                            (item === main
                                                ? " fade-in "
                                                : " hidden ")
                                        }
                                    />
                                );
                            }
                        )}
                    </div>

                    <div className="nav-buttons">
                        {Object.values(shopItems.featured_content).map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className={
                                        "nav-button " +
                                        (item === main ? "active" : "")
                                    }
                                    onClick={() => setIndex(index)}
                                >
                                    {index + 1}
                                </div>
                            )
                        )}
                    </div>

                    <div className="details">
                        {typeof main.title === "object" ? (
                            Object.values(main.title).map((entry, index) => (
                                <div
                                    key={index}
                                    className="details-text text-shadow"
                                >
                                    {entry as any}
                                </div>
                            ))
                        ) : (
                            <div className="details-text text-shadow">
                                {main.title}
                            </div>
                        )}
                        <div className="details-subtext text-shadow">
                            {main.subtitle}
                        </div>
                    </div>
                    <div
                        className="details-button text-shadow"
                        onClick={() => setTab(1)}
                    >
                        VIEW MORE ITEMS
                    </div>
                </div>
                <div className="sub">
                    <FeaturedItems
                        featuredItems={Object.values(shopItems.items).filter(
                            (item) => (item as any).featured === true
                        )}
                        currencyToDisplay={currencyToDisplay}
                    />
                    <div className="all-items-link" onClick={() => setTab(1)}>
                        <KeyboardDoubleArrowRightIcon />
                        <div className="view-all">
                            VIEW <br /> ALL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrimaryShowcase;
