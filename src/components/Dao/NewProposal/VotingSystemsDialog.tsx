import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '../../widgets/Modal';
import { votingSystems } from '../../../state/dao/constants';

const VotingSystemsDialog = ({
	open,
	handleClose,
	selectedVotingSystem,
	setSelectedVotingSystem,
}) => {
	return (
		<Modal
			className='voting-type-dialog'
			open={open}
			onClose={handleClose}
			style={{ textAlign: 'center' }}
		>
			<div
				style={{
					color: 'white',
					paddingBottom: '2rem',
					borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
				}}
			>
				<span
					style={{
						float: 'right',
						color: 'white',
						fontSize: '15px',
						cursor: 'pointer',
					}}
					onClick={() => {
						handleClose();
					}}
				>
					x
				</span>
				<span
					style={{
						fontSize: '25px',
						fontWeight: 'bold',
						fontFamily: 'Butter Haunted',
					}}
				>
					Select voting system
				</span>
			</div>
			<div style={{ paddingTop: '2rem' }}>
				<div className='row choices'>
					{votingSystems.map((sys, index) => {
						return (
							<div
								className='row-item col-12'
								key={index}
								style={{
									border: `${
										index === selectedVotingSystem
											? '1px solid white'
											: '1px solid rgba(255, 255, 255, 0.5)'
									}`,
									padding: '1.5rem',
									borderRadius: '15px',
									marginBottom: '2rem',
								}}
							>
								<div
									className='card'
									style={{
										backgroundColor: 'transparent',
										cursor: 'pointer',
										borderColor: 'transparent',
									}}
									onClick={() => {
										setSelectedVotingSystem(index);
										handleClose();
									}}
								>
									<div className='card-body text-start'>
										{index === selectedVotingSystem && (
											<CheckCircleIcon
												style={{
													float: 'right',
													color: 'white',
													fontSize: '20px',
												}}
											/>
										)}
										<h1
											className='voting-system-title'
											style={{
												fontSize: '20px',
												color: 'white',
											}}
										>
											{sys.title}
										</h1>
										<p
											className='voting-system-description'
											style={{
												fontSize: '15px',
												marginTop: '1.5rem',
												marginBottom: '0px',
											}}
										>
											{sys.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Modal>
	);
};

export default VotingSystemsDialog;
