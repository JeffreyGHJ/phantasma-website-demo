import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import {
	useNftsPerPage,
	useUpdateNftsPerPage,
} from '../../../../state/application/hooks';

import NftPerPageUtilModel from '../../../../models/util_models/NftPerPageUtilModel';

const NftsPerPageSelect = ({ className }: { className?: string }) => {
	const nftsPerPage = useNftsPerPage();
	const updateNftsPerPage = useUpdateNftsPerPage();

	const handlePerPageOnChange = (evt: SelectChangeEvent<string>) => {
		updateNftsPerPage(+evt.target.value);
	};
	return (
		<FormControl
			className={`widget NftsPerPageSelect ${className || ''}`}
			variant='outlined'
			style={{
				minWidth: '150px',
			}}
		>
			<Select
				value={nftsPerPage.toString()}
				onChange={handlePerPageOnChange}
			>
				{NftPerPageUtilModel.nftsPerPageSelections.map((t) => {
					return (
						<MenuItem key={t} value={t}>
							{t}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

export default NftsPerPageSelect;
