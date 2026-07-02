// This filter sidebar is only used for multiple collections

import "./FilterSidebar.scss";

import {
    Autocomplete,
    Box,
    Divider,
    Drawer,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {
    ectoSkeletonNFTAddress,
    littleGhostNFTAddress,
} from "../../../constants/ContractAddresses";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DropdownSelect from "../../widgets/DropdownSelect";
import DropdownSelectItem from "../../widgets/DropdownSelect/DropdownSelectItem";
import { Theme } from "@mui/material/styles";
import Translation from "../../widgets/Translation";
import { marketplaces } from "../../../state/marketplace/useMarketplace";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({
    filters,
    selectedFilters,
    isSidebarOpen,
    onIsSidebarOpenChange,
    onSelectedFiltersChange,
    onClearFilter,
    collectionAddress,
    marketplace,
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Marketplace.FilterSidebar",
    });
    const { t: t2, ready: ready2 } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
    const handleIsSidebarOpenChange = onIsSidebarOpenChange;
    const navigate = useNavigate();

    const handleCloseSidebar = () => {
        handleIsSidebarOpenChange(false);
    };

    const getFilterCount = () => {
        let count = 0;
        Object.keys(selectedFilters).forEach((f) => {
            if (
                !selectedFilters[f].length ||
                (selectedFilters[f].length === 1 &&
                    selectedFilters[f][0] === "All")
            ) {
                return;
            }
            count += 1;
        });
        return count;
    };

    const handleOnSelectedFilterChange = (key, values) => {
        const prevShowAll = selectedFilters[key].find((v) => v === "All");
        const nowShowAll = values.find((v) => v === "All");

        const temp = { ...selectedFilters };
        if (prevShowAll && nowShowAll && values.length > 1) {
            // added new attribute
            temp[key] = values.filter((v) => v !== "All");
        } else if (!nowShowAll) {
            if (values.length > 0) {
                temp[key] = values;
            } else {
                temp[key] = ["All"];
            }
        } else {
            temp[key] = ["All"];
        }
        onSelectedFiltersChange(temp);
    };

    const content = (
        <div>
            <Box
                component="div"
                sx={{
                    py: 2,
                }}
            >
                <Grid container direction="column" id="MarketplaceHeader">
                    <Grid item style={{ alignSelf: "self-start" }}>
                        <Translation ready={ready}>
                            <Typography color="textPrimary">
                                {t("marketplaceDropdown.label")}
                            </Typography>
                        </Translation>
                    </Grid>
                    <FormControl
                        variant="outlined"
                        style={{
                            minWidth: "180px",
                        }}
                    >
                        <DropdownSelect
                            value={marketplace}
                            onChange={(evt) => {
                                navigate(
                                    `/marketplace/${evt.target.value}/${collectionAddress}`,
                                    {
                                        replace: true,
                                    }
                                );
                            }}
                        >
                            <DropdownSelectItem value={marketplaces.ALL}>
                                <Translation ready={ready}>
                                    {t("marketplaceDropdown.selections.all")}
                                </Translation>
                            </DropdownSelectItem>
                            <DropdownSelectItem value={marketplaces.LG}>
                                <Translation ready={ready}>
                                    {t("marketplaceDropdown.selections.lg")}
                                </Translation>
                            </DropdownSelectItem>
                            <DropdownSelectItem value={marketplaces.PCS}>
                                <Translation ready={ready}>
                                    {t(
                                        "marketplaceDropdown.selections.pancakeSwap"
                                    )}
                                </Translation>
                            </DropdownSelectItem>
                        </DropdownSelect>
                    </FormControl>
                </Grid>
                <Divider />
                <Grid container direction="column" id="collectionHeader">
                    <Grid item style={{ alignSelf: "self-start" }}>
                        <Translation ready={ready}>
                            <Typography color="textPrimary">
                                {t("collectionDropdown.label")}
                            </Typography>
                        </Translation>
                    </Grid>
                    <FormControl
                        variant="outlined"
                        style={{
                            minWidth: "180px",
                        }}
                    >
                        <Select
                            value={collectionAddress}
                            onChange={(evt) => {
                                navigate(
                                    `/marketplace/${marketplace}/${evt.target.value}`,
                                    {
                                        replace: true,
                                    }
                                );
                            }}
                        >
                            <MenuItem value={littleGhostNFTAddress}>
                                <Translation ready={ready}>
                                    {t(
                                        "collectionDropdown.selections.littleGhosts"
                                    )}
                                </Translation>
                            </MenuItem>
                            <MenuItem value={ectoSkeletonNFTAddress}>
                                <Translation ready={ready}>
                                    {t(
                                        "collectionDropdown.selections.ectoSkeletons"
                                    )}
                                </Translation>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Divider />
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    id="filterHeader"
                >
                    <Grid item>
                        <Translation ready={ready}>
                            <Typography color="textPrimary">
                                {t("filters.label")} ({getFilterCount()})
                            </Typography>
                        </Translation>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={() => {
                                onClearFilter();
                            }}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                {!!Object.keys(selectedFilters).length && (
                    <div id="filterContent">
                        {Object.keys(filters).map((key, index) => {
                            return (
                                <div
                                    className="filter"
                                    key={collectionAddress + key}
                                >
                                    <Autocomplete
                                        multiple
                                        value={selectedFilters[key] || ["All"]}
                                        options={filters[key]}
                                        getOptionLabel={(option) =>
                                            t2(option, { defaultValue: option })
                                        }
                                        filterSelectedOptions={true}
                                        onChange={(event, values) => {
                                            handleOnSelectedFilterChange(
                                                key,
                                                values
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label={t2(key, {
                                                    defaultValue: key,
                                                })}
                                                placeholder=""
                                            />
                                        )}
                                        limitTags={1}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </Box>
        </div>
    );

    if (mdUp) {
        return (
            <Drawer
                variant="permanent"
                id="FilterSidebar"
                sx={{
                    width: 280,
                    "& .MuiDrawer-paper": {
                        position: "relative",
                    },
                }}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            sx={{
                "& .MuiBackdrop-root": {
                    position: "absolute",
                },
                "& .MuiDrawer-paper": {
                    position: "relative",
                    width: 280,
                },
            }}
            id="FilterSidebar"
            onClose={handleCloseSidebar}
            open={isSidebarOpen}
            variant="temporary"
            className="scrollbar"
        >
            {content}
        </Drawer>
    );
};

export default FilterSidebar;
