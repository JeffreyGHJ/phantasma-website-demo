import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";
import styles from "./Download.module.scss";
import LINKS from "../../../constants/links";
import DownloadIcon from "@mui/icons-material/Download";

const Download = (props) => {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Mac OS Card */}
                    <Card className={styles.card}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/images/applebg.jpeg"
                            alt="logo"
                        />
                        <CardContent className={styles[`card-content`]}>
                            <Typography
                                gutterBottom
                                variant="h3"
                                component="div"
                            >
                                macOS
                            </Typography>
                            <Typography
                                variant="body1"
                                className={styles["body1"]}
                                color="text.secondary"
                            >
                                Apple computer that supports Metal 3. See the
                                full list{" "}
                                <a
                                    target="_blank"
                                    href={
                                        "https://support.apple.com/en-us/HT205073"
                                    }
                                >
                                    here
                                </a>
                                .
                            </Typography>
                        </CardContent>
                        <CardActions className={styles[`card-actions`]}>
                            <a target="_blank" href={LINKS.MAC}>
                                <Button
                                    size="large"
                                    color="info"
                                    className={styles[`download-btn`]}
                                    onClick={() =>
                                        props.setDownloaded
                                            ? props.setDownloaded(true)
                                            : {}
                                    }
                                >
                                    <DownloadIcon className={styles.icon} />
                                    Download
                                </Button>
                            </a>
                        </CardActions>
                    </Card>

                    {/* Windows Card */}
                    <Card className={styles.card}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/images/windowsbg.jpeg"
                            alt="windows logo"
                        />
                        <CardContent className={styles[`card-content`]}>
                            <Typography
                                gutterBottom
                                variant="h3"
                                component="div"
                            >
                                Windows
                            </Typography>
                            <Typography
                                variant="body1"
                                className={styles["body1"]}
                                color="text.secondary"
                            >
                                Requires Windows 10 or newer.
                            </Typography>
                        </CardContent>
                        <CardActions className={styles[`card-actions`]}>
                            <a target="_blank" href={LINKS.INSTALLER}>
                                <Button
                                    size="large"
                                    color="info"
                                    className={styles[`download-btn`]}
                                    onClick={() =>
                                        props.setDownloaded
                                            ? props.setDownloaded(true)
                                            : {}
                                    }
                                >
                                    <DownloadIcon /> Download
                                </Button>
                            </a>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Download;
