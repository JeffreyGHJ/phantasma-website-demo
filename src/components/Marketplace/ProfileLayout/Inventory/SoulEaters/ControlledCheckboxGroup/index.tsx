import "./index.scss";

import { useCallback, useEffect, useState } from "react";

import { CheckboxItem } from "./types/CheckboxItem";

import { cloneDeep } from "lodash";
import Input from "../../../../../widgets/Input";
import Checkbox from "./Checkbox";

const ControlledCheckboxGroup = ({
    className,
    placeholder,
    onChange,
    checkboxItems,
    checkedValues,
    ...attributes
}: {
    className?: string;
    placeholder?: string;
    onChange: (x: Array<any>) => void;
    checkedValues: Array<any>;
    checkboxItems: Array<any>;
}) => {
    const [displayItems, setDisplayItems] = useState<Array<CheckboxItem>>([]);
    const [search, setSearch] = useState("");

    const handleCheckboxItemChange = useCallback(
        (value) => {
            onChange(value);
        },
        [onChange]
    );

    useEffect(() => {
        if (search === "") {
            setDisplayItems(checkboxItems);
        } else {
            setDisplayItems(
                checkboxItems.filter((_item) => {
                    return _item.label
                        .toLowerCase()
                        .includes(search.toLowerCase());
                })
            );
        }
    }, [search, checkboxItems]);

    return (
        <div
            className={`widget ControlledCheckboxGroup ${className || ""}`}
            {...attributes}
        >
            <div className="searchbar mb-4">
                <Input
                    placeholder={placeholder || ""}
                    onChange={(evt) => {
                        setSearch(evt.currentTarget.value);
                    }}
                />
            </div>
            {displayItems.map((checkBoxItem: any) => {
                return (
                    <div className="CheckboxItem" key={checkBoxItem.value}>
                        <Checkbox
                            checked={checkedValues.includes(checkBoxItem.value)}
                            onChange={() => {
                                handleCheckboxItemChange(checkBoxItem.value);
                            }}
                            label={checkBoxItem.label}
                            count={checkBoxItem.count}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ControlledCheckboxGroup;
