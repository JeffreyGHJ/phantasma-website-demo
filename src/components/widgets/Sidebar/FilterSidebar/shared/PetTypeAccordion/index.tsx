import AttributeAccordion from "../../../../Accordion/AttributeAccordion";
import AttributeAccordionDetails from "../../../../Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../Accordion/AttributeAccordion/AttributeAccordionSummary";
import Checkbox from "../../../../Checkbox/Checkbox";
import { ImageTag } from "../../../../../../utils/ImageUtil";
import Loading from "../../../../Loading";
import { petTypes } from "../../../../../Marketplace/constants/petTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PetTypeAccordion = ({
    petType,
    handlePetTypeChange,
}: {
    petType: string;
    handlePetTypeChange: (_petType: string) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "FilterSidebar",
    });

    const [petExpanded, setPetExpanded] = useState(true);

    return (
        <AttributeAccordion
            expanded={petExpanded}
            onChange={() => {
                setPetExpanded(!petExpanded);
            }}
        >
            <AttributeAccordionSummary>
                <div className="label">
                    <Loading loading={!ready}>
                        {t("petsDropdown.label", {
                            defaultValue: "Pets",
                        })}
                    </Loading>
                </div>
            </AttributeAccordionSummary>
            <AttributeAccordionDetails>
                <div className="ms-3 me-3">
                    <div className="pet-collection">
                        <Checkbox
                            checked={petType === petTypes.ECTOSKELETONS}
                            onChange={() => {
                                handlePetTypeChange(petTypes.ECTOSKELETONS);
                            }}
                            label={
                                <div className="label d-flex align-items-center">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "petsDropdown.selections.EctoSkeletons",
                                                {
                                                    defaultValue:
                                                        "EctoSkeletons",
                                                }
                                            )}
                                        </Loading>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </AttributeAccordionDetails>
        </AttributeAccordion>
    );
};

export default PetTypeAccordion;
