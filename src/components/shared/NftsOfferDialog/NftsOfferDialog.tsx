import './index.scss';

import {
	Checkbox,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormGroup,
} from '@mui/material';
import {
	ectoSkeletonNFTAddress,
	foundersItemsContractAddress,
	littleGhostNFTAddress,
	littleGhostsOfferContractAddress,
	lootboxContractAddress,
} from '../../../constants/ContractAddresses';
import {
	useAccountFoundersItems,
	useAccountFoundersLootboxes,
	useAccountGhosts,
	useAccountSkeletons,
	useView3d,
} from '../../../state/application/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	useHandleWeb3Error,
	useHandleWeb3Response,
} from '../../../utils/Web3ResponseUtil';

import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import NftCollectionSelect from '../../widgets/Select/NftCollectionSelect';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import { collectionItemImageUrl } from '../../../utils/collectionitemUtils';
import { useActiveWeb3React } from '../../../hooks';
import { useTokenContract } from '../../../hooks/useContract';
import { useTranslation } from 'react-i18next';

//TODO: Make another filter when founders items are selected
const NftsOfferDialog = ({ open, handleClose, handleOnOffer }) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.NftOfferDialog',
	});

	const { account } = useActiveWeb3React();
	const [approved, setApproved] = useState(false);
	const handleWeb3Reponse = useHandleWeb3Response();
	const handleWeb3Error = useHandleWeb3Error();
	const accountSkeletons = useAccountSkeletons();
	const accountGhosts = useAccountGhosts();
	const accountFoundersLootboxes = useAccountFoundersLootboxes();
	const accountFoundersItems = useAccountFoundersItems();

	const [tokenIdsMap, setTokenIdsMap] = useState(
		{} as Record<number, boolean>
	);
	const [selectedTokenIds, setSelectedTokenIds] = useState(
		[] as Array<number>
	);

	const [collectionAddress, setCollectionAddress] = useState(
		littleGhostNFTAddress
	);
	const tokens = useMemo(() => {
		if (collectionAddress === littleGhostNFTAddress) {
			return accountGhosts.ownedItems;
		} else if (collectionAddress === ectoSkeletonNFTAddress) {
			return accountSkeletons.ownedItems;
		} else if (collectionAddress === lootboxContractAddress) {
			return accountFoundersLootboxes.ownedItems;
		} else if (collectionAddress === foundersItemsContractAddress) {
			return accountFoundersItems.ownedItems;
		}
		return [];
	}, [
		collectionAddress,
		accountSkeletons,
		accountGhosts,
		accountFoundersLootboxes,
		accountFoundersItems,
	]);

	const CollectionContract = useTokenContract(collectionAddress, true);

	const view3d = useView3d();

	const approveOfferContract = async () => {
		//@ts-ignore
		await CollectionContract.setApprovalForAll(
			littleGhostsOfferContractAddress,
			true
		)
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage:
						'Waiting for confirmations to approve the contract',
					successMessage: 'Contract has been successfully approved',
					res,
					callback: () => {
						setApproved(true);
					},
				});
			})
			.catch((err) => {
				console.log(err);
				handleWeb3Error({ err });
			});
	};

	const checkIfOfferContractIsApproved = useCallback(async () => {
		if (!account || !collectionAddress || !CollectionContract) {
			setApproved(false);
			return;
		}
		//@ts-ignore
		return CollectionContract.isApprovedForAll(
			account,
			littleGhostsOfferContractAddress
		)
			.then((res: boolean) => {
				setApproved(res);
			})
			.catch((err) => {
				handleWeb3Error({ err });
			});
	}, [
		account,
		collectionAddress,
		setApproved,
		CollectionContract,
		handleWeb3Error,
	]);

	const handleChange = (id) => {
		const _tokenIdsMap = {
			...tokenIdsMap,
		};
		_tokenIdsMap[id] = !_tokenIdsMap[id];
		setTokenIdsMap(_tokenIdsMap);
	};

	useEffect(() => {
		if (account && collectionAddress) {
			checkIfOfferContractIsApproved();
		}
	}, [account, collectionAddress, checkIfOfferContractIsApproved]);

	useEffect(() => {
		const _tokenIdsMap = {};
		tokens.forEach((token) => {
			_tokenIdsMap[token.id] = false;
		});
		setTokenIdsMap(_tokenIdsMap);
	}, [tokens]);

	useEffect(() => {
		const _selectedTokenIds = [] as Array<number>;
		Object.keys(tokenIdsMap).forEach((key) => {
			if (tokenIdsMap[key]) {
				_selectedTokenIds.push(+key);
			}
		});
		setSelectedTokenIds(_selectedTokenIds);
	}, [tokenIdsMap]);

	return (
		<Modal open={open} onClose={handleClose} className='NftsOfferDialog'>
			<DialogContent className='NftsOfferDialog-Content scrollbar'>
				<NftCollectionSelect
					collectionAddress={collectionAddress}
					setCollectionAddress={setCollectionAddress}
				/>
				<div
					style={{ maxHeight: '480px', overflowY: 'auto' }}
					className='scrollbar mt-5'
				>
					<FormControl component='fieldset'>
						<FormGroup aria-label='position' row>
							{tokens.map((token) => {
								return (
									<FormControlLabel
										key={`${collectionAddress}-${token.id}`}
										value={token.id}
										checked={!!tokenIdsMap[token.id]}
										control={<Checkbox color='primary' />}
										onChange={() => {
											handleChange(token.id);
										}}
										label={
											<>
												<img
													src={collectionItemImageUrl(
														{
															item: token,
															view3d,
														}
													)}
													alt=''
													width='100'
													height='100'
													style={{
														objectFit: 'cover',
														borderRadius: '100%',
													}}
												/>
												<div className='color-white'>
													ID: {token.id}
												</div>
												<Loading
													loading={!ready}
													width='40px'
													height='15px'
												>
													{token.rank != null && (
														<div className='color-white'>
															{t('rank', {
																defaultValue:
																	'Rank',
															})}
															:{` ${token.rank}`}
														</div>
													)}
												</Loading>
											</>
										}
										labelPlacement='top'
									/>
								);
							})}
						</FormGroup>
					</FormControl>
				</div>

				<h2 className='mt-3' style={{ color: '#fff' }}>
					<Loading loading={!ready}>
						{t('selected_nfts', {
							defaultValue: 'Selected NFTs',
						})}{' '}
					</Loading>
				</h2>

				<p>{selectedTokenIds.join(', ')}</p>

				<div className='d-flex justify-content-center'>
					{approved ? (
						<OutlinedButton
							onClick={() =>
								handleOnOffer(
									collectionAddress,
									selectedTokenIds
								)
							}
						>
							<Loading loading={!ready}>
								{t('offer_now', {
									defaultValue: 'Offer Now',
								})}
							</Loading>
						</OutlinedButton>
					) : (
						<OutlinedButton
							onClick={() => {
								approveOfferContract();
							}}
						>
							<Loading loading={!ready}>
								{t('approve', {
									defaultValue: 'Approve',
								})}
							</Loading>
						</OutlinedButton>
					)}
				</div>
			</DialogContent>
		</Modal>
	);
};

export default NftsOfferDialog;
