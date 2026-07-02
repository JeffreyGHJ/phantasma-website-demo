import './index.scss';

import CommunityNavbar from '../../Navbar/CommunityNavbar';
import QuickSetting from '../../widgets/SpeedDial/QuickSetting';
import Vault from './Vault';
import { useParams } from 'react-router-dom';

const CategoryContent = ({ section }: { section: string }) => {
	switch (section) {
		case 'treasury': {
			return <Vault />;
		}
		default:
			return <></>;
	}
};

const Community = () => {
	const { section } = useParams();

	return (
		<div id='Community'>
			<CommunityNavbar />
			<CategoryContent section={section || 'vault'} />
			<QuickSetting />
		</div>
	);
};

export default Community;
