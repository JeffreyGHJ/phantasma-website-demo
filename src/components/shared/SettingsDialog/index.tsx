import "./index.scss";

import { Grid, Switch } from "@mui/material";
import {
    useQuickSpin,
    useToggleQuickSpin,
} from "../../../state/application/hooks/quickSpin";
import {
    useMemoryMode,
    useToggleMemoryMode,
    useToggleView3d,
    useView3d,
} from "../../../state/application/hooks";

import AlertDisplayPositionSelect from "../../widgets/Select/AlertDisplayPositionSelect";
import LanguageSelect from "../../Navbar/LanguageSelect";
import Loading from "../../widgets/Loading";
import Modal from "../../widgets/Modal";
import { NftImageSizeSlider } from "../../widgets/Slider/NftImageSizeSlider";
import NftsPerPageSelect from "../../widgets/Select/NftsPerPageSelect";
import SizeSlider from "../../styled/SizeSlider";
import { useTranslation } from "react-i18next";

const SettingsDialog = (props) => {
    const { open, onClose, className, children, ...attributes } = props;

    const view3d = useView3d();
    const toggleView3d = useToggleView3d();

    const quickSpin = useQuickSpin();
    const toggleQuickSpin = useToggleQuickSpin();

    const memoryMode = useMemoryMode();
    const toggleMemoryMode = useToggleMemoryMode();

    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Navbar.SettingDialog",
    });

    return (
        <Modal
            className={`widget SettingsDialog ${className || ""}`}
            open={open}
            onClose={onClose}
            {...attributes}
        >
            <div>
                <Grid container>
                    <Grid
                        item
                        xs={6}
                        className="etc-item etc-first-row-item text-start"
                    >
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("languages", { defaultValue: "Languages" })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        className="etc-item etc-first-row-item text-end"
                    >
                        <LanguageSelect />
                    </Grid>
                    <Grid item xs={6} className="etc-item text-start mt-3">
                        <div className="label">3D NFT</div>
                    </Grid>
                    <Grid item xs={6} className="etc-item text-end mt-3">
                        <Switch
                            checked={view3d}
                            onChange={toggleView3d}
                            color="primary"
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-start mt-3"
                    >
                        <div className="label">
                            <Loading loading={!ready}>
                                NFT{" "}
                                {t("image_size", {
                                    defaultValue: "Image Size",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-end mt-3"
                    >
                        <SizeSlider>
                            <NftImageSizeSlider />
                        </SizeSlider>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-start mt-3 align-self-center"
                    >
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("nfts_per_page", {
                                    defaultValue: "NFTs Per Page",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-end mt-3"
                    >
                        <NftsPerPageSelect />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-start mt-3 align-self-center"
                    >
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("alert_display_position", {
                                    defaultValue: "Alert Display Position",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className="etc-item text-end mt-3"
                    >
                        <AlertDisplayPositionSelect />
                    </Grid>
                    <Grid item xs={6} className="etc-item text-start mt-3">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("quick_spin", {
                                    defaultValue: "Quick Spin",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid item xs={6} className="etc-item text-end mt-3">
                        <Switch
                            checked={quickSpin}
                            onChange={() => {
                                toggleQuickSpin();
                            }}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={6} className="etc-item text-start mt-3">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("memory_mode", {
                                    defaultValue: "Memory Mode",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                    <Grid item xs={6} className="etc-item text-end mt-3">
                        <Switch
                            checked={memoryMode}
                            onChange={() => {
                                toggleMemoryMode();
                            }}
                            color="primary"
                        />
                    </Grid>
                </Grid>
            </div>
        </Modal>
    );
};

export default SettingsDialog;
