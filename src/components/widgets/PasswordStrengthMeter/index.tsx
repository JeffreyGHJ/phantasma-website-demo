import './index.scss';

import { createRef, useEffect, useState } from 'react';

import Loading from '../Loading';
import Weakness from './types/Weakness';
import { calculatePasswordStrength } from '../../../utils/PasswordUtil';
import getWeakness from './utils/getWeakness';
import { useTranslation } from 'react-i18next';

const totalScore = 100;
const minimumScore = 10;
const PasswordStrengthMeter = ({
	password,
	onChange,
}: {
	password: string;
	onChange: (score: number) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.PasswordStrengthMeter',
	});

	const { t: t_strength, ready: ready_strength } = useTranslation(
		'translation',
		{
			keyPrefix: 'widgets.PasswordStrengthMeter.strength',
		}
	);

	const { t: t_suggestions, ready: ready_suggestions } = useTranslation(
		'translation',
		{
			keyPrefix: 'widgets.PasswordStrengthMeter.suggestions',
		}
	);

	const progressRef = createRef<HTMLDivElement>();
	const [score, setScore] = useState(0);
	const [weakness, setWeakness] = useState<Weakness>('');
	const [suggestion, setSuggestion] = useState('');

	useEffect(() => {
		const results = calculatePasswordStrength(password);
		if (results.length) {
			const totalDeduction = results.reduce((prev, curr) => {
				return prev + curr.deduction;
			}, 0);
			const score = totalScore - totalDeduction;
			setScore(score > minimumScore ? score : minimumScore);
			setWeakness(
				getWeakness({
					totalScore,
					deduction: totalDeduction,
				})
			);
			setSuggestion(results[0].message);
		} else {
			setScore(100);
			setWeakness('strong');
			setSuggestion('Looks good!');
		}
	}, [password]);

	useEffect(() => {
		if (progressRef.current) {
			progressRef.current.style.setProperty(
				'--strength',
				score.toString()
			);
		}
	}, [score, progressRef]);

	useEffect(() => {
		onChange(score);
	}, [onChange, score]);

	return (
		<div className='widget PasswordStrengthMeter'>
			<div className='label'>
				<div>
					<Loading loading={!ready}>
						{t('password_strength', {
							defaultValue: 'Password Strength',
						})}
					</Loading>
				</div>
				<div className={`indicator ${weakness}`}>
					<Loading loading={!ready_strength}>
						{t_strength(weakness, {
							defaultValue: weakness,
						})}
					</Loading>
				</div>
			</div>
			<div className='progress-wrapper'>
				<div className={`progress ${weakness}`} ref={progressRef}></div>
			</div>
			<div className={`suggestion ${weakness}`}>
				<Loading loading={!ready_suggestions}>
					{t_suggestions(suggestion, {
						defaultValue: suggestion,
					})}
				</Loading>
			</div>
		</div>
	);
};

export default PasswordStrengthMeter;
