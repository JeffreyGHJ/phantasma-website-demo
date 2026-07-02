import './index.scss';

import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import ConnectButton from '../../shared/ConnectButton';
import HoverTooltip from '../../widgets/Tooltip/HoverTooltip';
import { ImageTag } from '../../../utils/ImageUtil';
import InfoIcon from '@mui/icons-material/Info';
import Loading from '../../widgets/Loading';
import PurpleFilledButton from '../../widgets/Button/FilledButton/PurpleFilledButton';
import QuickSetting from '../../widgets/SpeedDial/QuickSetting';
import Web3 from 'web3';
import { activeNode } from '../../../constants/Nodes';
import { getMintCount } from '../../../constants/abis/bsc/LootboxABI/hooks/useMintCount';
import { getTotalMinted } from '../../../constants/abis/bsc/LootboxABI/hooks/useTotalMinted';
import { useActiveWeb3React } from '../../../hooks';
import { useHasSaleStarted } from '../../../constants/abis/bsc/LootboxABI/hooks/useHasSaleStarted';
import { useMintLootbox } from '../../../constants/abis/bsc/LootboxABI/hooks/useMintLootbox';
import { useMintPrice } from '../../../constants/abis/bsc/LootboxABI/hooks/useMintPrice';
import { useTotalSupply } from '../../../constants/abis/bsc/LootboxABI/hooks/useTotalSupply';
import { useTranslation } from 'react-i18next';

const web3 = new Web3(activeNode);

const LootboxMinting = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Mint',
	});

	/* Account */
	const { account } = useActiveWeb3React();
	const [mintCount, setMintCount] = useState(0);
	const [totalMinted, setTotalMinted] = useState(0);
	const totalSupply = useTotalSupply();

	/* Lootbox state*/
	const hasSaleStarted = useHasSaleStarted();
	const mintPrice = useMintPrice();

	/* Minting */
	const [quantity, setQuantity] = useState(1);
	const mintValue = useMemo(() => {
		return BigNumber.from(mintPrice).mul(quantity);
	}, [mintPrice, quantity]);
	const mintLootbox = useMintLootbox();

	const handleMintLootbox = useCallback(() => {
		mintLootbox({
			mintCount: quantity,
			value: mintValue.toString(),
			callback: () => {
				if (account) {
					getMintCount(account).then((_mintCount) => {
						setMintCount(_mintCount);
					});
				}
				getTotalMinted().then((_minted) => {
					setTotalMinted(_minted);
				});
			},
		});
	}, [mintLootbox, mintValue, quantity, account]);

	const [open, setOpen] = React.useState(false);

	const handleChange = useCallback((event) => {
		setQuantity(+event.target.value);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const handleOpen = useCallback(() => {
		setOpen(true);
	}, []);

	useEffect(() => {
		if (!account) {
			setMintCount(0);
			return () => {};
		}
		let mounted = true;
		getMintCount(account).then((_mintCount) => {
			if (mounted) {
				setMintCount(_mintCount);
			}
		});

		return () => {
			mounted = false;
		};
	}, [account]);

	useEffect(() => {
		let mounted = true;
		getTotalMinted().then((_minted) => {
			if (mounted) {
				setTotalMinted(_minted);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<>
			<div id='LootboxMinting' className='container text-center mt-4'>
				<h1>
					<Loading loading={!ready} width='200px'>
						{hasSaleStarted
							? t('mint_started', {
									defaultValue: 'Mint started!',
							  })
							: t('mint_starts_soon', {
									defaultValue: 'Mint starts soon!',
							  })}
					</Loading>
				</h1>
				<div className='twitter-img my-5'>
					<ImageTag
						src={`${process.env.PUBLIC_URL}/assets/images/lootbox.png`}
						className='img-fluid'
						alt='lootbox'
					/>
				</div>
				<div>
					<p className='total-minted'>
						{totalMinted} / {totalSupply}
					</p>
				</div>
				<div className='main-title'>
					<h2 className='col-md-10 mx-auto'>
						<Loading loading={!ready} width='100%' multiple={2}>
							{t('mint_incentive', {
								defaultValue:
									"Mint Founder's boxes to get exclusive rewards and for a chance to win a Macbook Pro and Nintendo Switches!",
							})}
						</Loading>
					</h2>
				</div>
				<div className='row mt-4'>
					<div>
						<div className='mint-price-info'>
							<div>
								<Loading loading={!ready} width='200px'>
									{t('price_to_mint', {
										defaultValue: 'Price to mint',
									})}{' '}
									({web3.utils.fromWei(mintValue.toString())}{' '}
									BNB){' '}
								</Loading>
							</div>
							<div>
								<HoverTooltip
									tooltip='All loots are determined randomly on the time of opening. With each box minted, you will get a random gem and a random armor guaranteed. You will also have chances to get a rare potion, Macbook Pro, and Nintendo Switch'
									anchorOriginHorizontal='center'
									transformOriginHorizontal='center'
								>
									<InfoIcon />
								</HoverTooltip>
							</div>
						</div>
					</div>
					<div className='dropdown-mint-wrapper my-5'>
						<div>
							<FormControl>
								<Select
									open={open}
									onClose={handleClose}
									onOpen={handleOpen}
									value={quantity}
									onChange={handleChange}
								>
									<MenuItem value={1}>1</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={5}>5</MenuItem>
									<MenuItem value={10}>10</MenuItem>
									<MenuItem value={20}>20</MenuItem>
									<MenuItem value={50}>50</MenuItem>
								</Select>
							</FormControl>
						</div>
						<div>
							{!account ? (
								<ConnectButton />
							) : (
								<PurpleFilledButton
									onClick={handleMintLootbox}
									disabled={!hasSaleStarted}
								>
									<Loading loading={!ready}>
										{t('mint_boxes', {
											defaultValue: 'Mint Lootboxes',
										})}
									</Loading>
								</PurpleFilledButton>
							)}
						</div>
					</div>
					<div className='mint-count mb-5'>
						<Loading loading={!ready}>
							{!account ? (
								t('wallet_not_connected', {
									defaultValue: 'Wallet not connected',
								})
							) : (
								<>
									{t('you_have_minted', {
										defaultValue: 'You have minted',
									})}{' '}
									<span>{mintCount}</span>{' '}
									{t('lootboxes', {
										defaultValue: 'lootboxes',
									})}
									!
								</>
							)}
						</Loading>
					</div>
				</div>
			</div>
			<QuickSetting />
		</>
	);
};

export default LootboxMinting;
