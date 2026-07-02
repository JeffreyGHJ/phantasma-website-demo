import './index.scss';

import SettingsDialog from '../../../shared/SettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

const QuickSetting = () => {
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

	const handleSettingsDialogClose = () => {
		setSettingsDialogOpen(false);
	};
	return (
		<>
			<div className='widget QuickSetting'>
				<button
					onClick={() => {
						setSettingsDialogOpen(true);
					}}
				>
					<SettingsIcon />
				</button>
			</div>
			<SettingsDialog
				open={settingsDialogOpen}
				onClose={handleSettingsDialogClose}
			/>
		</>
	);
};

export default QuickSetting;
