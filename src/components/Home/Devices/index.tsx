import './index.scss';

import AssetUtilModel from '../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import { useTranslation } from 'react-i18next';

const Devices = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Home.Devices',
	});

	return (
		<section id='Devices'>
			<div className='container'>
				<div className='row'>
					<div className='col-lg-6 left-col'>
						<div className='devices'>
							<ImageTag
								src={`${AssetUtilModel.IMAGE_PATH}/devices/switch_mac_phone.svg`}
								height='auto'
							/>
						</div>
					</div>
					<div className='col-lg-6 right-col'>
						<div className='right'>
							<div className='title'>
								<Loading loading={!ready} width='280px'>
									<div>
										{t('title', {
											defaultValue:
												'Enjoy cross-play with your friends',
										})}
									</div>
								</Loading>
							</div>
							<div className='subtitle'>
								<Loading
									loading={!ready}
									width='280px'
									multiple={4}
								>
									<div>
										{t('subtitle', {
											defaultValue:
												'Releasing first on the computer, LittleGhosts MMO plans on releasing on nintendo switch and mobile next. Since we are building the MMO using Unity, they offer us instant access to export the MMO to several different devices in the future.',
										})}
									</div>
								</Loading>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Devices;
