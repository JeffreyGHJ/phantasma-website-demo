import './index.scss';

import { useCallback, useEffect, useState } from 'react';

import Checkbox from '../Checkbox';
import { CheckboxItem } from './types/CheckboxItem';
import Input from '../../Input';
import { cloneDeep } from 'lodash';

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
	checkboxItems: Array<CheckboxItem>;
}) => {
	const [displayItems, setDisplayItems] = useState<Array<CheckboxItem>>([]);
	const [search, setSearch] = useState('');

	const handleCheckboxItemChange = useCallback(
		(value) => {
			let newCheckedValues = cloneDeep(checkedValues);
			if (checkedValues.includes(value)) {
				newCheckedValues = newCheckedValues.filter((x) => {
					return x !== value;
				});
			} else {
				newCheckedValues.push(value);
			}
			onChange(newCheckedValues);
		},
		[checkedValues, onChange]
	);

	useEffect(() => {
		if (search === '') {
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
			className={`widget ControlledCheckboxGroup ${className || ''}`}
			{...attributes}
		>
			<div className='searchbar mb-4'>
				<Input
					placeholder={placeholder || ''}
					onChange={(evt) => {
						setSearch(evt.currentTarget.value);
					}}
				/>
			</div>
			{displayItems.map((checkBoxItem) => {
				return (
					<div className='CheckboxItem' key={checkBoxItem.value}>
						<Checkbox
							checked={checkedValues.includes(checkBoxItem.value)}
							onChange={() => {
								handleCheckboxItemChange(checkBoxItem.value);
							}}
							label={checkBoxItem.label}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default ControlledCheckboxGroup;
