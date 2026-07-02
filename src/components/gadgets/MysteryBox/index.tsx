import './index.scss';

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

const transitionTime = '750ms';

const changeVar = (glow) => {
	document.documentElement.style.setProperty('--glow', glow);
};

const MysteryBox = forwardRef(({ rewardUrl }: { rewardUrl: string }, ref) => {
	const [open, setOpen] = useState(false);

	const cubeRef = useRef<HTMLDivElement>(null);
	const cubeBackRef = useRef<HTMLDivElement>(null);
	const cubeTopRef = useRef<HTMLDivElement>(null);
	const cubeLeftRef = useRef<HTMLDivElement>(null);
	const cubeRightRef = useRef<HTMLDivElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const powerupRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		open() {
			handleOpenCube();
		},
		close() {
			if (open) {
				if (
					!cubeRef ||
					!cubeRef.current ||
					!cubeTopRef ||
					!cubeTopRef.current ||
					!cubeLeftRef ||
					!cubeLeftRef.current ||
					!cubeRightRef ||
					!cubeRightRef.current ||
					!cubeBackRef ||
					!cubeBackRef.current ||
					!glowRef ||
					!glowRef.current ||
					!powerupRef ||
					!powerupRef.current
				) {
					return;
				}
				cubeRef.current.classList.remove('shaking');
				cubeTopRef.current.style.transform = 'translateY(0)';
				cubeLeftRef.current.style.transform = 'translateX(0)';
				cubeRightRef.current.style.transform = 'translateX(0)';
				cubeRef.current.style.opacity = '1';
				setOpen(false);
				cubeTopRef.current.style.opacity = '1';
				cubeLeftRef.current.style.opacity = '1';
				cubeRightRef.current.style.opacity = '1';
				cubeBackRef.current.style.opacity = '1';
				glowRef.current.style.opacity = '1';
				powerupRef.current.style.opacity = '0';
				powerupRef.current.style.zIndex = '0';
				cubeRef.current.style.animationPlayState = 'running';
				powerupRef.current.style.height = '48px';
				powerupRef.current.style.width = '48px';
				changeVar('rgba(255,195,26,0.4)');
			}
		},
	}));

	const award = () => {
		if (powerupRef && powerupRef.current) {
			powerupRef.current.style.backgroundImage = `url(${rewardUrl})`;
			changeVar('rgba(69,185,251,0.33)');
		}
	};

	const handleOpenCube = () => {
		if (
			!cubeRef ||
			!cubeRef.current ||
			!cubeTopRef ||
			!cubeTopRef.current ||
			!cubeLeftRef ||
			!cubeLeftRef.current ||
			!cubeRightRef ||
			!cubeRightRef.current ||
			!cubeBackRef ||
			!cubeBackRef.current ||
			!glowRef ||
			!glowRef.current ||
			!powerupRef ||
			!powerupRef.current
		) {
			return;
		}
		if (!open) {
			award();
			cubeTopRef.current.style.transform = 'translateY(-3rem)';
			cubeLeftRef.current.style.transform = 'translateX(-3rem)';
			cubeRightRef.current.style.transform = 'translateX(3rem)';
			cubeTopRef.current.style.opacity = '0.1';
			cubeLeftRef.current.style.opacity = '0.1';
			cubeRightRef.current.style.opacity = '0.1';
			cubeBackRef.current.style.opacity = '0.1';
			glowRef.current.style.opacity = '0.5';
			powerupRef.current.style.opacity = '1';
			setOpen(true);
			cubeRef.current.style.animationPlayState = 'paused';
			powerupRef.current.style.zIndex = '10';
			powerupRef.current.style.height = '80px';
			powerupRef.current.style.width = '80px';
		} else {
			cubeTopRef.current.style.transform = 'translateY(0)';
			cubeLeftRef.current.style.transform = 'translateX(0)';
			cubeRightRef.current.style.transform = 'translateX(0)';
			cubeRef.current.style.opacity = '1';
			setOpen(false);
			cubeTopRef.current.style.opacity = '1';
			cubeLeftRef.current.style.opacity = '1';
			cubeRightRef.current.style.opacity = '1';
			cubeBackRef.current.style.opacity = '1';
			glowRef.current.style.opacity = '1';
			powerupRef.current.style.opacity = '0';
			powerupRef.current.style.zIndex = '0';
			cubeRef.current.style.animationPlayState = 'running';
			powerupRef.current.style.height = '48px';
			powerupRef.current.style.width = '48px';
			changeVar('rgba(255,195,26,0.4)');
		}
	};

	useEffect(() => {
		if (cubeRef && cubeRef.current) {
			cubeRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [cubeRef]);

	useEffect(() => {
		if (cubeBackRef && cubeBackRef.current) {
			cubeBackRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [cubeBackRef]);

	useEffect(() => {
		if (cubeTopRef && cubeTopRef.current) {
			cubeTopRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [cubeTopRef]);

	useEffect(() => {
		if (cubeLeftRef && cubeLeftRef.current) {
			cubeLeftRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [cubeLeftRef]);

	useEffect(() => {
		if (cubeRightRef && cubeRightRef.current) {
			cubeRightRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [cubeRightRef]);

	useEffect(() => {
		if (glowRef && glowRef.current) {
			glowRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [glowRef]);

	useEffect(() => {
		if (powerupRef && powerupRef.current) {
			powerupRef.current.style.transition = `all ${transitionTime}`;
		}
	}, [powerupRef]);

	return (
		<div className='gadget MysteryBox'>
			<div id='cube' ref={cubeRef}>
				<div className='hexagon position-absolute' ref={glowRef}></div>
				<div className='cube back' ref={cubeBackRef}></div>
				<div className='cube top' ref={cubeTopRef}></div>
				<div className='cube left' ref={cubeLeftRef}></div>
				<div className='cube right' ref={cubeRightRef}></div>
				<div
					className='powerup position-absolute'
					ref={powerupRef}
				></div>
			</div>
		</div>
	);
});

export default MysteryBox;
