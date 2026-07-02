import './LookaheadPagination.scss';

import { Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Translation from '../../widgets/Translation';
import { useTranslation } from 'react-i18next';

const LookaheadPagination = ({
	currentPage,
	lastPage,
	onChange,
}: {
	currentPage: number;
	lastPage: number;
	onChange: (x: number) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'LookaheadPagination',
	});

	const [validPage, setValidPage] = useState(true);
	const [jumpTo, setJumpTo] = useState(currentPage);
	const handleOnInputChange = (event) => {
		const value = event.target.value;
		setJumpTo(value);
		if (value < 0 || value > lastPage) {
			setValidPage(false);
			return;
		}
		setValidPage(true);
	};

	const handleOnGo = () => {
		if (!validPage) {
			return;
		}
		onChange(jumpTo);
	};

	useEffect(() => {
		setJumpTo(currentPage);
	}, [currentPage]);
	return (
		<div className='lookahead-pagination'>
			<Grid container justifyContent='flex-end' alignItems='center'>
				{currentPage > 1 && (
					<>
						<Grid item className='align-self-center'>
							<IconButton
								className='icon-button'
								onClick={() => {
									onChange(1);
								}}
							>
								1
							</IconButton>
						</Grid>
						<Grid item className='align-self-center'>
							<IconButton
								className='icon-button'
								onClick={() => {
									onChange(currentPage - 1);
								}}
							>
								<ChevronLeftIcon />
							</IconButton>
						</Grid>
					</>
				)}
				<Grid item className='align-self-center'>
					<Grid container alignItems='center'>
						<input
							type='number'
							value={jumpTo}
							onChange={handleOnInputChange}
						/>
						<Translation ready={ready}>
							<IconButton
								className={`icon-button go ${
									validPage ? '' : 'disabled'
								}`}
								disabled={!validPage}
								onClick={handleOnGo}
							>
								{t('go', { defaultValue: 'Go' })}
							</IconButton>
						</Translation>
					</Grid>
				</Grid>
				{lastPage > currentPage && (
					<>
						<Grid item className='align-self-center'>
							<IconButton
								className='icon-button'
								onClick={() => {
									onChange(currentPage + 1);
								}}
							>
								<ChevronRightIcon />
							</IconButton>
						</Grid>
						<Grid item className='align-self-center'>
							<IconButton
								className='icon-button'
								onClick={() => {
									onChange(lastPage);
								}}
							>
								{lastPage}
							</IconButton>
						</Grid>
					</>
				)}
			</Grid>
		</div>
	);
};

export default LookaheadPagination;
