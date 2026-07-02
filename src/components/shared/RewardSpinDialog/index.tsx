import './index.scss';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
	findLastIndex,
	findRandomIndexAfter,
	shuffleArray,
} from '../../../utils/ArrayUtil';
import { isNull, isUndefined } from 'lodash';

import HoverTooltip from '../../widgets/Tooltip/HoverTooltip';
import { ImageTag } from '../../../utils/ImageUtil';
import LootboxUtilModel from '../../../models/util_models/LootboxUtilModel';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PurpleFilledButton from '../../widgets/Button/FilledButton/PurpleFilledButton';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { getLootbox } from '../../../constants/abis/bsc/LootboxABI/hooks/useGetLootbox';
import { useMediaQuery } from '@mui/material';
import { useQuickSpin } from '../../../state/application/hooks/quickSpin';
import { useUpdateOverlay } from '../../../state/application/hooks';

const ITEM_WIDTH = 60;
const minimumElementsToGenerate = 150;
let rewardDistance = 0;
let fetchingRewardsInterval: NodeJS.Timer;
const totalSpinCount = 7;
const boxOpeningAnimationDuration = 5000;

const RewardSpinDialog = ({
	open,
	itemID,
	onClose,
	className,
	onClaim,
	isApproved,
	onApprove,
	...attributes
}: {
	open: boolean;
	itemID: number;
	onClose: () => void;
	onClaim: () => void;
	isApproved: boolean;
	onApprove: () => void;
	className?: string;
}) => {
	const updateOverlay = useUpdateOverlay();
	const quickSpin = useQuickSpin();
	const [spinCount, setSpinCount] = useState(totalSpinCount);
	const [spinState, setSpinState] = useState<
		'started' | 'pending' | 'finished' | 'resetting'
	>('pending');
	const [playAnimation, setPlayAnimation] = useState(false);
	const [spinDuration, setSpinDuration] = useState(8000);
	const [rewardsToShow, setRewardsToShow] = useState<
		Array<{ url: string; name: string }>
	>(
		new Array(15).fill({
			url: `${process.env.PUBLIC_URL}/assets/images/icons/placeholders/200x200/empty_background.png`,
			name: LootboxUtilModel.NONE_KEY,
		})
	);
	const [rewards, setRewards] = useState<Array<string>>();
	const [lootbox, setLootbox] = useState<{
		id: number;
		requestID: string;
		randomWords: Array<string>;
		claimed: boolean;
	}>();

	const [rewardsToSpin, setRewardsToSpin] = useState<
		Array<{ url: string; name: string }>
	>([]);
	const [rewardsToSpins, setRewardsToSpins] = useState<
		Array<Array<{ url: string; name: string }>>
	>([]);
	const [possibleRewards, setPossibleRewards] = useState<
		Array<{ url: string; name: string; dropRate: number }>
	>([]);

	const dialogRef = useRef<HTMLElement | null>(null);
	const rewardsToSpinContainerRef = useRef<HTMLDivElement>(null);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>();
	const [rewardAndClaimRef, setRewardAndClaimRef] =
		useState<HTMLDivElement | null>();

	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

	const lockPosition = () => {
		if (dialogRef && dialogRef.current) {
			const currentWidth = dialogRef.current.offsetWidth;
			dialogRef.current.style.minWidth = `${currentWidth}px`;
			dialogRef.current.style.maxWidth = `${currentWidth}px`;
		}
	};

	const handleOnSpin = async () => {
		lockPosition();
		if (
			!spinCount ||
			!rewards ||
			!rewards.length ||
			!rewardsToSpin.length ||
			!rewardsToSpinContainerRef ||
			!rewardsToSpinContainerRef.current
		) {
			return;
		}

		setSpinState('started');
		const initialWidth = rewardsToSpinContainerRef.current.offsetWidth / 2;
		const initialPointedLootIndex =
			Math.ceil(initialWidth / ITEM_WIDTH) - 1;

		const reward = rewards[totalSpinCount - spinCount];

		let rewardIndex = findRandomIndexAfter(
			rewardsToSpin,
			Math.floor(rewardsToSpin.length / 2),
			(_reward) => {
				return _reward.name === reward;
			}
		);
		if (rewardIndex === -1) {
			rewardIndex = findLastIndex(rewardsToSpin, (_reward) => {
				return _reward.name === reward;
			});
		}

		const rewardIndexInitalDiff = rewardIndex - initialPointedLootIndex;

		rewardDistance = rewardIndexInitalDiff * ITEM_WIDTH;

		const animation = rewardsToSpinContainerRef.current.animate(
			[
				{
					transfrom: 'translateX(0px)',
				},
				{
					transform: `translateX(-${rewardDistance}px)`,
				},
			],
			{
				duration: spinDuration,
				easing: 'ease',
			}
		);

		animation.onfinish = () => {
			if (
				rewardsToSpinContainerRef &&
				rewardsToSpinContainerRef.current
			) {
				rewardsToSpinContainerRef.current.style.transform = `translateX(-${rewardDistance}px)`;
			}

			if (
				rewardIndex !== -1 &&
				rewardsToSpin[rewardIndex].name !== LootboxUtilModel.NONE_KEY
			) {
				const firstEmptySpot = rewardsToShow.findIndex(
					(x) => x.name === LootboxUtilModel.NONE_KEY
				);
				const _rewardsToShow = [...rewardsToShow];
				_rewardsToShow[firstEmptySpot] = rewardsToSpin[rewardIndex];
				setRewardsToShow(_rewardsToShow);
			}
			setTimeout(() => {
				setSpinCount(spinCount - 1);
				setSpinState('finished');
			}, 2000);
		};
	};

	const handleOnReset = () => {
		if (
			!rewardsToSpin.length ||
			!rewardsToSpinContainerRef ||
			!rewardsToSpinContainerRef.current
		) {
			return;
		}
		setSpinState('resetting');

		const animation = rewardsToSpinContainerRef.current.animate(
			[
				{
					transfrom: `translateX(-${rewardDistance}px)`,
				},
				{
					transform: `translateX(0px)`,
				},
			],
			{
				duration: 1000,
				easing: 'ease',
			}
		);

		animation.onfinish = () => {
			if (
				rewardsToSpinContainerRef &&
				rewardsToSpinContainerRef.current
			) {
				rewardsToSpinContainerRef.current.style.transform = `translateX(-${0}px)`;
			}
		};
	};

	const handleOnPlayAgain = () => {
		handleOnReset();
		handleOnSpin();
	};

	const centerVideoElement = useCallback(() => {
		if (!dialogRef.current || !videoRef) {
			return;
		}
		const dialogWidth = dialogRef.current.offsetWidth;
		const videoWidth = videoRef.offsetWidth;

		videoRef.style.left = `${(dialogWidth - videoWidth) / 2}px`;
	}, [videoRef]);

	const handleShowRewardAnimation = useCallback(() => {
		if (!dialogRef.current || !videoRef || playAnimation) {
			return;
		}
		setPlayAnimation(true);
		centerVideoElement();
		const animation = dialogRef.current.animate(
			[
				{
					opacity: 0.2,
				},
				{
					opacity: 1,
				},
			],
			{
				duration: 1500,
				iterations: 2,
				easing: 'ease-in-out',
			}
		);

		animation.onfinish = () => {
			animation.pause();
			videoRef.classList.remove('invisible');
			setTimeout(() => {
				videoRef.play().then(() => {
					setTimeout(() => {
						if (rewardAndClaimRef) {
							rewardAndClaimRef.classList.remove('invisible');
						}
					}, boxOpeningAnimationDuration - 1500);
				});
			}, 500);
		};
	}, [videoRef, playAnimation, centerVideoElement, rewardAndClaimRef]);

	// Initial load
	useEffect(() => {
		updateOverlay(true);
		let mounted = true;
		LootboxUtilModel.getAvaliableLootboxRewards().then((_rewards) => {
			if (mounted) {
				setPossibleRewards(_rewards);
			}
		});

		return () => {
			mounted = false;
		};
	}, [updateOverlay]);

	useEffect(() => {
		if (fetchingRewardsInterval) {
			clearInterval(fetchingRewardsInterval);
		}
		if (!open || isUndefined(itemID) || isNull(itemID)) {
			return () => {};
		}
		let mounted = true;
		fetchingRewardsInterval = setInterval(() => {
			getLootbox(itemID).then((_lootbox) => {
				if (mounted) {
					setLootbox(_lootbox);
				}
			});
		}, 5000); // 5s
		return () => {
			mounted = false;
			clearInterval(fetchingRewardsInterval);
		};
	}, [open, itemID]);

	useEffect(() => {
		if (lootbox && lootbox.randomWords && lootbox.randomWords.length > 0) {
			setRewards(
				LootboxUtilModel.getRewardsFromRandomWords(lootbox.randomWords)
			);
			if (fetchingRewardsInterval) {
				clearInterval(fetchingRewardsInterval);
			}
		}
	}, [lootbox]);

	useEffect(() => {
		if (rewards && rewards.length) {
			updateOverlay(false);
		}
	}, [rewards, updateOverlay]);

	useEffect(() => {
		setSpinDuration(quickSpin ? 1000 : 8000);
	}, [quickSpin]);

	useEffect(() => {
		if (spinCount === 0) {
			return () => {};
		}
		if (rewardsToSpins.length) {
			setRewardsToSpin(rewardsToSpins[totalSpinCount - spinCount]);
		}
		return () => {};
	}, [spinCount, rewardsToSpins]);

	useEffect(() => {
		// Frist spin
		let firstSpinRewards = [] as Array<{ url: string; name: string }>;
		let loops = Math.ceil(
			minimumElementsToGenerate / LootboxUtilModel.rewardGemOptions.length
		);
		if (loops < 3) {
			loops = 3;
		}

		for (let i = 0; i < loops; i++) {
			LootboxUtilModel.rewardGemOptions.forEach((reward, index) => {
				firstSpinRewards.push({ ...reward });
			});
		}
		firstSpinRewards = shuffleArray(firstSpinRewards);

		// Second spin
		let secondSpinRewards = [] as Array<{ url: string; name: string }>;
		loops = Math.ceil(
			minimumElementsToGenerate /
				LootboxUtilModel.rewardArmoryOptions.length
		);
		if (loops < 3) {
			loops = 3;
		}
		for (let i = 0; i < loops; i++) {
			LootboxUtilModel.rewardArmoryOptions.forEach((reward, index) => {
				secondSpinRewards.push({ ...reward });
			});
		}
		secondSpinRewards = shuffleArray(secondSpinRewards);

		// Third spin
		let thirdSpinRewards = [] as Array<{ url: string; name: string }>;
		const options = LootboxUtilModel.rewardPotionOptions
			.concat([
				LootboxUtilModel.littleGhostRewardOption,
				LootboxUtilModel.skeletonRewardOption,
				LootboxUtilModel.switchRewardOption,
				LootboxUtilModel.macBookRewardOption,
			])
			.concat(new Array(5).fill(LootboxUtilModel.emptyRewardOption));
		loops = Math.ceil(minimumElementsToGenerate / options.length);
		if (loops < 3) {
			loops = 3;
		}
		for (let i = 0; i < loops; i++) {
			options.forEach((reward, index) => {
				thirdSpinRewards.push({ ...reward });
			});
		}
		thirdSpinRewards = shuffleArray(thirdSpinRewards);

		// Fourth spin
		const fourthSpinRewards = shuffleArray(thirdSpinRewards);
		const fifthSpinRewards = shuffleArray(thirdSpinRewards);
		const sixthSpinRewards = shuffleArray(thirdSpinRewards);
		const seventhSpinRewards = shuffleArray(thirdSpinRewards);

		setRewardsToSpins([
			firstSpinRewards,
			secondSpinRewards,
			thirdSpinRewards,
			fourthSpinRewards,
			fifthSpinRewards,
			sixthSpinRewards,
			seventhSpinRewards,
		]);

		return () => {};
	}, []);

	useEffect(() => {
		if (spinCount <= 0) {
			setTimeout(() => {
				handleShowRewardAnimation();
			}, 1000);
		}
	}, [spinCount, handleShowRewardAnimation]);

	return (
		<Modal
			className={`widget RewardSpinDialog ${className || ''} ${
				isMobile && 'mobile'
			} animate`}
			open={open}
			onClose={onClose}
			ref={dialogRef}
			{...attributes}
		>
			<div className='RewardSpinDialog--title'>Founder's Lootbox</div>
			{!isMobile ? (
				<>
					{!playAnimation && (
						<Spinner
							rewardsToSpinContainerRef={
								rewardsToSpinContainerRef
							}
							rewardsToSpin={rewardsToSpin}
						/>
					)}

					<div className='row mt-5'>
						<div className='col-sm'>
							<PossibleRewards
								possibleRewards={possibleRewards}
							/>
						</div>
						<div className='col-sm'>
							<div className='d-flex justify-content-center'>
								<AcquiredRewards
									acquiredRewards={rewardsToShow}
								/>
							</div>
						</div>
					</div>
					<Footer
						spinCount={spinCount}
						spinState={spinState}
						handleOnSpin={handleOnSpin}
						handleOnPlayAgain={handleOnPlayAgain}
						handleShowRewardAnimation={handleShowRewardAnimation}
						playAnimation={playAnimation}
					/>
				</>
			) : (
				<>
					{!playAnimation && (
						<Spinner
							rewardsToSpinContainerRef={
								rewardsToSpinContainerRef
							}
							rewardsToSpin={rewardsToSpin}
						/>
					)}
					<div className='mt-2'>
						<div className='d-flex justify-content-center'>
							<AcquiredRewards acquiredRewards={rewardsToShow} />
						</div>
					</div>
					<Footer
						spinCount={spinCount}
						spinState={spinState}
						handleOnSpin={handleOnSpin}
						handleOnPlayAgain={handleOnPlayAgain}
						handleShowRewardAnimation={handleShowRewardAnimation}
						playAnimation={playAnimation}
					/>
					<PossibleRewards possibleRewards={possibleRewards} />
				</>
			)}

			<video
				muted
				className='vid invisible'
				ref={(newRef) => setVideoRef(newRef)}
			>
				<source
					src={`${process.env.PUBLIC_URL}/assets/animations/box_opening.mp4`}
					type='video/mp4'
				/>
			</video>
			{rewards && (
				<div
					className='rewards-and-claim invisible'
					ref={(newRef) => setRewardAndClaimRef(newRef)}
				>
					<div className='title'>You acquired</div>
					{rewards
						.filter((x) => x !== LootboxUtilModel.NONE_KEY)
						.map((_reward) => {
							return (
								<div className='reward' key={_reward}>
									1x {_reward}
								</div>
							);
						})}
					<div className='claim-button-wrapper'>
						{isApproved ? (
							<PurpleFilledButton onClick={onClaim}>
								Claim
							</PurpleFilledButton>
						) : (
							<PurpleFilledButton onClick={onApprove}>
								Approve to Claim
							</PurpleFilledButton>
						)}
					</div>
				</div>
			)}
		</Modal>
	);
};

const ActionButton = ({
	spinCount,
	spinState,
	handleOnSpin,
	handleOnPlayAgain,
}: {
	spinCount: number;
	spinState: 'finished' | 'started' | 'pending' | 'resetting';
	handleOnSpin: () => void;
	handleOnPlayAgain: () => void;
}) => {
	if (spinCount === 0) {
		return (
			<OutlinedButton disabled>
				{spinCount < totalSpinCount ? 'Spin Again' : 'Spin'}
			</OutlinedButton>
		);
	}
	if (spinState === 'pending') {
		return (
			<OutlinedButton onClick={handleOnSpin}>
				{spinCount < totalSpinCount ? 'Spin Again' : 'Spin'}
			</OutlinedButton>
		);
	} else if (spinState === 'started') {
		return (
			<OutlinedButton disabled>
				{spinCount < totalSpinCount ? 'Spin Again' : 'Spin'}
			</OutlinedButton>
		);
	} else if (spinState === 'resetting') {
		return <OutlinedButton disabled>Spinning Again</OutlinedButton>;
	}
	return (
		<OutlinedButton onClick={handleOnPlayAgain}>Spin Again</OutlinedButton>
	);
};

const Spinner = ({
	rewardsToSpinContainerRef,
	rewardsToSpin,
}: {
	rewardsToSpinContainerRef: RefObject<HTMLDivElement>;
	rewardsToSpin: Array<{ url: string; name: string }>;
}) => {
	return (
		<div className='spin-section'>
			<div className='pointer-wrapper'>
				<ImageTag
					className='pointer'
					src={`${process.env.PUBLIC_URL}/assets/images/icons/pointer_1.png`}
				/>
			</div>
			<div className='spin-container' ref={rewardsToSpinContainerRef}>
				{rewardsToSpin.map((reward, index) => {
					return (
						<ImageTag
							src={reward.url}
							key={index}
							height={ITEM_WIDTH}
							width={ITEM_WIDTH}
							className='reward-to-spin'
						/>
					);
				})}
			</div>
		</div>
	);
};

const PossibleRewards = ({
	possibleRewards,
	className,
}: {
	possibleRewards: Array<{
		url: string;
		name: string;
		dropRate: number;
	}>;
	className?: string;
}) => {
	return (
		<div className={`PossibleRewards ${className || ''}`}>
			<div className='text-center possible-rewards-text'>
				Possible Rewards
			</div>
			<div className='possible-rewards-container scrollbar text-center'>
				{possibleRewards.map((reward, index) => {
					return (
						<HoverTooltip
							key={index}
							tooltip={`${reward.name}: ${reward.dropRate}%`}
						>
							<ImageTag
								src={reward.url}
								key={index}
								height='50'
								width='50'
							/>
						</HoverTooltip>
					);
				})}
			</div>
		</div>
	);
};

const AcquiredRewards = ({
	acquiredRewards,
	className,
}: {
	acquiredRewards: Array<{
		url: string;
		name: string;
	}>;
	className?: string;
}) => {
	return (
		<div className={`AcquiredRewards ${className || ''}`}>
			<div className='text-center acquired-rewards-text'>Acquired</div>
			<div className='acquired-rewards-container scrollbar text-center'>
				{acquiredRewards.map((reward, index) => {
					return (
						<ImageTag
							src={reward.url}
							key={index}
							height='50'
							width='50'
						/>
					);
				})}
			</div>
		</div>
	);
};

const Footer = ({
	spinCount,
	spinState,
	handleOnSpin,
	handleOnPlayAgain,
	playAnimation,
	handleShowRewardAnimation,
}: {
	spinCount: number;
	spinState: 'started' | 'pending' | 'finished' | 'resetting';
	handleOnSpin: () => void;
	handleOnPlayAgain: () => void;
	playAnimation: boolean;
	handleShowRewardAnimation: () => void;
}) => {
	return (
		<div className='footer'>
			<div className='d-flex justify-content-center spin-btn-wrapper'>
				<ActionButton
					spinCount={spinCount}
					spinState={spinState}
					handleOnSpin={handleOnSpin}
					handleOnPlayAgain={handleOnPlayAgain}
				/>
			</div>
			<div className='d-flex justify-content-center remaining mt-2'>
				<p>Remaining x{spinCount}</p>
			</div>
			{!playAnimation && !!spinCount && (
				<div className='skip' onClick={handleShowRewardAnimation}>
					<SkipNextIcon fontSize='large' /> <div>Skip</div>
				</div>
			)}
		</div>
	);
};

export default RewardSpinDialog;
