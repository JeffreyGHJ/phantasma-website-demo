import './StrategiesDialog.scss';

import ExternalLink from '../../widgets/ExternalLink/ExternalLink';
import { Grid } from '@mui/material';
import Modal from '../../widgets/Modal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Strategy from '../../../state/dao/types/Strategy';

const StrategiesDialog = ({
	open,
	handleClose,
	strategies,
}: {
	open: boolean;
	handleClose: () => void;
	strategies: Array<Strategy>;
}) => {
	return (
		<Modal className='StrategiesDialog' open={open} onClose={handleClose}>
			<div>
				<h2 className='title' style={{ color: '#fff' }}>
					Strategies
				</h2>
				{strategies.map((strategy) => {
					return (
						<div className='strategy' key={strategy.params.address}>
							<div className='name'>{strategy.name}</div>
							<Grid
								container
								justifyContent='space-between'
								className='symbol'
							>
								<Grid item>Symbol</Grid>
								<Grid item>{strategy.params.symbol}</Grid>
							</Grid>
							<Grid
								container
								justifyContent='space-between'
								className='address'
							>
								<Grid item>Address</Grid>
								<Grid item>
									<ExternalLink
										href={`https://bscscan.com/address/${strategy.params.address}`}
									>
										{`${strategy.params.address.slice(
											0,
											6
										)}...${strategy.params.address.slice(
											-4
										)}`}{' '}
										<OpenInNewIcon />
									</ExternalLink>
								</Grid>
							</Grid>
						</div>
					);
				})}
			</div>
		</Modal>
	);
};

export default StrategiesDialog;
