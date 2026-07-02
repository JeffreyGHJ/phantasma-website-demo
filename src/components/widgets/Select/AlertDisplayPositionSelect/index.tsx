import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import {
	useAlertDisplayPosition,
	useUpdateAlertDisplayPosition,
} from '../../../../state/application/hooks';

import AlertDisplayPositionUtilModel from '../../../../models/util_models/AlertDisplayPositionUtilModel';
import Loading from '../../Loading';
import { useTranslation } from 'react-i18next';

const AlertDisplayPositionSelect = ({ className }: { className?: string }) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.AlertDisplayPositionSelect',
	});

	const alertDisplayPosition = useAlertDisplayPosition();
	const updateAlertDisplayPosition = useUpdateAlertDisplayPosition();

	const handleAlertDisplayPositionOnChange = (
		evt: SelectChangeEvent<string>
	) => {
		updateAlertDisplayPosition(evt.target.value);
	};
	return (
		<FormControl
			className={`widget AlertDisplayPositionSelect ${className || ''}`}
			variant='outlined'
			style={{
				minWidth: '150px',
			}}
		>
			<Select
				value={alertDisplayPosition}
				onChange={handleAlertDisplayPositionOnChange}
				className='text-start'
			>
				{Object.keys(
					AlertDisplayPositionUtilModel.notifstackPositionSelections
				).map((key) => {
					return (
						<MenuItem key={key} value={key}>
							<Loading loading={!ready}>
								{t(
									AlertDisplayPositionUtilModel
										.notifstackPositionSelections[key].name,
									{
										defaultValue:
											AlertDisplayPositionUtilModel
												.notifstackPositionSelections[
												key
											].name,
									}
								)}
							</Loading>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

export default AlertDisplayPositionSelect;
