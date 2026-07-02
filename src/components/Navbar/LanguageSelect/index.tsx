import { Menu, MenuItem } from '@mui/material';

import IconButton from '../../widgets/Button/IconButton/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import i18next from 'i18next';
import { useState } from 'react';

const LanguageSelect = () => {
	const [languageSelectAnchorEl, setLanguageSelectAnchorEl] =
		useState<null | HTMLElement>(null);
	const languageSelectOpen = Boolean(languageSelectAnchorEl);
	const handleLanguageSelectClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setLanguageSelectAnchorEl(event.currentTarget);
	};
	const handleLanguageSelectClose = () => {
		setLanguageSelectAnchorEl(null);
	};

	const languageMap = {
		en: { label: 'English', dir: 'ltr', active: true },
		'zh-CN': { label: '简体中文', dir: 'ltr', active: false },
		'zh-TW': { label: '繁體中文', dir: 'ltr', active: false },
	};

	return (
		<>
			<IconButton
				id='LanguageButton'
				className='icon-button'
				onClick={handleLanguageSelectClick}
				aria-controls={
					languageSelectOpen ? 'language-select-menu' : undefined
				}
				aria-haspopup='true'
				aria-expanded={languageSelectOpen ? 'true' : undefined}
			>
				<LanguageIcon fontSize='large' />
			</IconButton>
			<Menu
				id='language-select-menu'
				anchorEl={languageSelectAnchorEl}
				open={languageSelectOpen}
				onClose={handleLanguageSelectClose}
				MenuListProps={{
					'aria-labelledby': 'language-select-list-button',
				}}
			>
				{Object.keys(languageMap)?.map((item) => (
					<MenuItem
						key={item}
						onClick={() => {
							i18next.changeLanguage(item);
							setLanguageSelectAnchorEl(null);
						}}
					>
						{languageMap[item].label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default LanguageSelect;
