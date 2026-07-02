import Weakness from '../types/Weakness';

const getWeakness = ({
	totalScore,
	deduction,
}: {
	totalScore: number;
	deduction: number;
}): Weakness => {
	const score = totalScore - deduction;

	if (score < 50) {
		return 'poor';
	} else if (score < 80) {
		return 'average';
	}
	return 'strong';
};

export default getWeakness;
