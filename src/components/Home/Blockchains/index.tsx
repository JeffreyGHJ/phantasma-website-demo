import './index.scss';

import AssetUtilModel from '../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import { useTranslation } from 'react-i18next';

const Blockchains = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Home.Blockchains',
	});

	return (
		<section id='Blockchains'>
			<div className='container'>
				<div className='row'>
					<div className='col-lg-6 right-col'>
						<div className='blockchains'>
							<div className='group'>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/solana.svg`}
										height='auto'
									/>
								</div>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/bsc.svg`}
										height='auto'
									/>
								</div>
							</div>
							<div className='group'>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/ethereum.svg`}
										height='auto'
									/>
								</div>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/fantom.svg`}
										height='auto'
									/>
								</div>
							</div>
							<div className='group'>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/harmony.svg`}
										height='auto'
									/>
								</div>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/avalanche.svg`}
										height='auto'
									/>
								</div>
							</div>
							<div className='group'>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/polygon.svg`}
										height='auto'
									/>
								</div>
								<div>
									<ImageTag
										src={`${AssetUtilModel.LOGO_PATH}/blockchains/filled/cronos.svg`}
										height='auto'
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='col-lg-6 left-col'>
						<div className='left'>
							<div className='title'>
								<Loading loading={!ready} width='280px'>
									<div>
										{t('title', {
											defaultValue:
												'Float through blockchains',
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
												'Unbounded by normal conventions of most crypto projects, LittleGhosts can exist on 8 blockchains. Although the main focus is Solana and BNBChain, you can move your ghosts wherever you wish.',
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

export default Blockchains;
