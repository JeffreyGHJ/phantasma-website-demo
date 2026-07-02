import NotifstackPositionSelection from './types/NotifstackPositionSelection';

class AlertDisplayPositionUtilModel {
	static notifstackPositionSelections: Record<
		NotifstackPositionSelection,
		{ name: string; vertical: string; horizontal: string }
	> = {
		TOP_LEFT: {
			name: 'Top left',
			vertical: 'top',
			horizontal: 'left',
		},
		TOP_CENTER: {
			name: 'Top center',
			vertical: 'top',
			horizontal: 'center',
		},
		TOP_RIGHT: {
			name: 'Top right',
			vertical: 'top',
			horizontal: 'right',
		},
		BOTTOM_LEFT: {
			name: 'Bottom left',
			vertical: 'bottom',
			horizontal: 'left',
		},
		BOTTOM_CENTER: {
			name: 'Bottom center',
			vertical: 'bottom',
			horizontal: 'center',
		},
		BOTTOM_RIGHT: {
			name: 'Bottom right',
			vertical: 'bottom',
			horizontal: 'right',
		},
	};

	static notifstackPositionSelectionKeys: Record<
		NotifstackPositionSelection,
		NotifstackPositionSelection
	> = {
		TOP_LEFT: 'TOP_LEFT',
		TOP_CENTER: 'TOP_CENTER',
		TOP_RIGHT: 'TOP_RIGHT',
		BOTTOM_LEFT: 'BOTTOM_LEFT',
		BOTTOM_CENTER: 'BOTTOM_CENTER',
		BOTTOM_RIGHT: 'BOTTOM_RIGHT',
	};
}

export default AlertDisplayPositionUtilModel;
