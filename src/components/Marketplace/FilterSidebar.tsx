// This filter sidebar is only used for littleghost nfts

import {
	Autocomplete,
	Box,
	Divider,
	Drawer,
	Grid,
	IconButton,
	TextField,
	Typography,
	makeStyles,
	useMediaQuery,
} from '@mui/material';
import {
	bg_colors,
	bodies,
	eyes,
	hats,
	items,
	mouths,
	props,
} from './attributes';
import { useEffect, useRef, useState } from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Theme } from '@mui/material/styles';

const MailSidebarDesktop = makeStyles({
	'& .MuiDrawer-paper': {
		position: 'relative',
		width: 280,
	},
});

const MailSidebarMobile = makeStyles({
	'& .MuiBackdrop-root': {
		position: 'absolute',
	},
	'& .MuiDrawer-paper': {
		position: 'relative',
		width: 280,
	},
});

const FilterSidebar = ({
	defaultFilters,
	isSidebarOpen,
	onIsSidebarOpenChange,
	onFiltersChange,
	clearFunction,
}) => {
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
	const handleIsSidebarOpenChange = onIsSidebarOpenChange;
	const [filterCount, setFilterCount] = useState(
		Object.keys(defaultFilters).filter((x) => !!defaultFilters[x].length)
			.length
	);
	const [selectedHatTypes, setSelectedHatTypes] = useState(
		defaultFilters.hats.length
			? defaultFilters.hats
			: ([hats[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedEyeTypes, setSelectedEyeTypes] = useState(
		defaultFilters.eyes.length
			? defaultFilters.eyes
			: ([eyes[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedMouthTypes, setSelectedMouthTypes] = useState(
		defaultFilters.mouths.length
			? defaultFilters.mouths
			: ([mouths[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedBodyTypes, setSelectedBodyTypes] = useState(
		defaultFilters.bodies.length
			? defaultFilters.bodies
			: ([bodies[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedItemTypes, setSelectedItemTypes] = useState(
		defaultFilters.items.length
			? defaultFilters.items
			: ([items[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedPropTypes, setSelectedPropTypes] = useState(
		defaultFilters.props.length
			? defaultFilters.props
			: ([props[0]] as Array<{
					id: number;
					name: string;
					value: string;
					flag?: string;
			  }>)
	);
	const [selectedBgColorTypes, setSelectedBgColorTypes] = useState(
		defaultFilters.bg_colors.length
			? defaultFilters.bg_colors
			: ([bg_colors[0]] as Array<{
					id: number;
					name: string;
					value: string;
					hex?: string;
					rgb?: { r: number; g: number; b: number };
			  }>)
	);
	const handleFiltersChange = onFiltersChange;

	const onSelectedAttributeTypesChange = (
		event,
		values,
		options,
		state,
		setStateFunc
	) => {
		const prevShowAll = state.find((v) => v.id === 0);
		const nowShowAll = values.find((v) => v.id === 0);

		if (prevShowAll && nowShowAll && values.length > 1) {
			// added new attribute
			setStateFunc(values.filter((v) => v.id !== 0));
		} else if (!nowShowAll) {
			if (values.length > 0) {
				setStateFunc(values);
			} else {
				setStateFunc([options[0]]);
			}
		} else {
			setStateFunc([options[0]]);
		}
	};

	const clearFilters = () => {
		setSelectedHatTypes([hats[0]]);
		setSelectedEyeTypes([eyes[0]]);
		setSelectedMouthTypes([mouths[0]]);
		setSelectedBodyTypes([bodies[0]]);
		setSelectedItemTypes([items[0]]);
		setSelectedPropTypes([props[0]]);
		setSelectedBgColorTypes([bg_colors[0]]);
	};

	const handleCloseSidebar = () => {
		handleIsSidebarOpenChange(false);
	};

	const init = useRef(false);
	useEffect(() => {
		if (!init.current) {
			init.current = true;
			clearFunction.ref.current = clearFilters;
			return;
		}

		let count = 0;
		count = selectedHatTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedEyeTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedMouthTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedBodyTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedItemTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedPropTypes.find((v) => v.id === 0) ? count : count + 1;
		count = selectedBgColorTypes.find((v) => v.id === 0)
			? count
			: count + 1;

		setFilterCount(count);
		handleFiltersChange({
			hats: selectedHatTypes,
			eyes: selectedEyeTypes,
			mouths: selectedMouthTypes,
			items: selectedItemTypes,
			props: selectedPropTypes,
			bodies: selectedBodyTypes,
			bg_colors: selectedBgColorTypes,
		});
	}, [
		selectedHatTypes,
		selectedEyeTypes,
		selectedMouthTypes,
		selectedBodyTypes,
		selectedItemTypes,
		selectedPropTypes,
		selectedBgColorTypes,
	]);

	const content = (
		<div id='marketplaceSidebarContent'>
			<Divider />
			<Box
				component='div'
				sx={{
					py: 2,
				}}
			>
				<Grid
					container
					direction='row'
					justifyContent='space-between'
					id='filterHeader'
				>
					<Grid item>
						<Typography color='textPrimary'>
							Filters ({filterCount})
						</Typography>
					</Grid>
					<Grid item>
						<IconButton onClick={clearFilters}>
							<DeleteForeverIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Divider />
				<div id='filterContent'>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedHatTypes}
							options={hats}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									hats,
									selectedHatTypes,
									setSelectedHatTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Hat'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedEyeTypes}
							options={eyes}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									eyes,
									selectedEyeTypes,
									setSelectedEyeTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Eyes'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedMouthTypes}
							options={mouths}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									mouths,
									selectedMouthTypes,
									setSelectedMouthTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Mouth'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedBodyTypes}
							options={bodies}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									bodies,
									selectedBodyTypes,
									setSelectedBodyTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Body'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedItemTypes}
							options={items}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									items,
									selectedItemTypes,
									setSelectedItemTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Item'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedPropTypes}
							options={props}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									props,
									selectedPropTypes,
									setSelectedPropTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='Prop'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
					<div className='filter'>
						<Autocomplete
							multiple
							value={selectedBgColorTypes}
							options={bg_colors}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							onChange={(event, values) => {
								onSelectedAttributeTypesChange(
									event,
									values,
									bg_colors,
									selectedBgColorTypes,
									setSelectedBgColorTypes
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									label='BG color'
									placeholder=''
								/>
							)}
							limitTags={1}
						/>
					</div>
				</div>
			</Box>
		</div>
	);

	if (mdUp) {
		return <Drawer variant='permanent'>{content}</Drawer>;
	}

	return (
		<Drawer
			onClose={handleCloseSidebar}
			open={isSidebarOpen}
			variant='temporary'
		>
			{content}
		</Drawer>
	);
};

export default FilterSidebar;
