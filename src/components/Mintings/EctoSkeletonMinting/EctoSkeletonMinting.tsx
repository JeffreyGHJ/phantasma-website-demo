import './EctoSkeletonMinting.scss';

import { FormControl, MenuItem, Select } from '@mui/material';
import {
	handleWeb3Error,
	handleWeb3Reponse,
} from '../../../utils/Web3ResponseUtil';

import { BigNumber } from '@ethersproject/bignumber';
import { ImageTag } from '../../../utils/ImageUtil';
import React from 'react';
import Web3 from 'web3';
import { activeNode } from '../../../constants/Nodes';
import ectoSkeletonNFTABI from '../../../constants/abis/EctoSkeletonNFTABI';
import { ectoSkeletonNFTAddress } from '../../../constants/ContractAddresses';
import { useContract } from '../../../hooks/useContract';

const web3 = new Web3(activeNode);

const mintPrice = web3.utils.toWei('0.12');

const EctoSkeletonMinting = () => {
	const [quantity, setQuantity] = React.useState('1');
	const [open, setOpen] = React.useState(false);
	const skeletonContract = useContract(
		ectoSkeletonNFTAddress,
		ectoSkeletonNFTABI,
		true
	);

	const mintSkeleton = () => {
		skeletonContract
			?.adoptEctoSkeleton(quantity, {
				value: BigNumber.from(mintPrice).mul(quantity),
			})
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: `Please wait for confirmations to mint ${quantity} skeletons`,
					successMessage: `You have successfully minted ${quantity} skeletons`,
					res,
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const handleChange = (event) => {
		setQuantity(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<>
			<div
				id='EctoSkeletonMinting'
				className='container text-center mt-4'
			>
				<h2>Minting has started!</h2>
				<div className='twitter-img my-5'>
					<ImageTag
						src={`${process.env.PUBLIC_URL}/images/skeletons/mint_cover.png`}
						className='img-fluid'
						alt='skeleton'
					/>
				</div>
				<div className='main-title'>
					<h1 className='col-md-10 mx-auto'>
						2,500 Haunting EctoSkeletons NFT living on the Binance
						network!
					</h1>
				</div>
				<div className='row mt-4'>
					<h3>Price to mint (.12)</h3>
					<div className='text-center mt-5 mb-5'>
						<FormControl className='mx-2'>
							<Select
								open={open}
								onClose={handleClose}
								onOpen={handleOpen}
								value={quantity}
								onChange={handleChange}
							>
								<MenuItem value={1}>
									<em>One</em>
								</MenuItem>
								<MenuItem value={2}>Two</MenuItem>
								<MenuItem value={5}>Five</MenuItem>
								<MenuItem value={10}>Ten</MenuItem>
								<MenuItem value={20}>Twenty</MenuItem>
							</Select>
						</FormControl>
						<div className='button-wrapper pill primary mx-2'>
							<button onClick={() => mintSkeleton()}>
								Mint Skeletons
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EctoSkeletonMinting;
