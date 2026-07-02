import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import {
	ectoSkeletonNFTAddress,
	foundersItemsContractAddress,
	littleGhostNFTAddress,
	lootboxContractAddress,
} from '../../../../constants/ContractAddresses';

import Loading from '../../Loading';
import { useTranslation } from 'react-i18next';

const NftCollectionSelect = ({
	collectionAddress,
	setCollectionAddress,
	disabled = false,
}: {
	collectionAddress: string;
	setCollectionAddress?: React.Dispatch<React.SetStateAction<string>>;
	disabled?: boolean;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'CollectionNames',
	});

	const handleCollectionAddressOnChange = (
		evt: SelectChangeEvent<string>
	) => {
		if (setCollectionAddress) {
			setCollectionAddress(evt.target.value);
		}
	};
	return (
		<FormControl
			variant='outlined'
			style={{
				minWidth: '150px',
			}}
		>
			<Select
				value={collectionAddress}
				onChange={handleCollectionAddressOnChange}
				disabled={disabled}
			>
				<MenuItem value={littleGhostNFTAddress}>
					<Loading loading={!ready}>
						{t('LittleGhosts', { defaultValue: 'LittleGhosts' })}
					</Loading>
				</MenuItem>
				<MenuItem value={ectoSkeletonNFTAddress}>
					<Loading loading={!ready}>
						{t('EctoSkeletons', { defaultValue: 'EctoSkeletons' })}
					</Loading>
				</MenuItem>
				<MenuItem value={lootboxContractAddress}>
					<Loading loading={!ready}>
						{t("Founder's Lootboxes", {
							defaultValue: "Founder's Lootboxes",
						})}
					</Loading>
				</MenuItem>
				<MenuItem value={foundersItemsContractAddress}>
					<Loading loading={!ready}>
						{t("Founder's Items", {
							defaultValue: "Founder's Items",
						})}
					</Loading>
				</MenuItem>
			</Select>
		</FormControl>
	);
};

export default NftCollectionSelect;
