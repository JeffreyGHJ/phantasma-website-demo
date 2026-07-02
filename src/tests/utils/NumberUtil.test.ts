import { getHumanReadableLargeNumber } from '../../utils/NumberUtil';

describe('NumberUtil', () => {
	describe('getHumanReadableLargeNumber', () => {
		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 13503018713.291603802,
				precision: 2,
			});
			expect(result.number).toEqual(13.5);
			expect(result.unit).toEqual('B');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 2058390360,
				precision: 2,
			});
			expect(result.number).toEqual(2.06);
			expect(result.unit).toEqual('B');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 942980080,
				precision: 2,
			});
			expect(result.number).toEqual(942.98);
			expect(result.unit).toEqual('M');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 92980080,
				precision: 2,
			});
			expect(result.number).toEqual(92.98);
			expect(result.unit).toEqual('M');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 5285080,
				precision: 2,
			});
			expect(result.number).toEqual(5.29);
			expect(result.unit).toEqual('M');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 385080,
				precision: 2,
			});
			expect(result.number).toEqual(385.08);
			expect(result.unit).toEqual('K');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 85189,
				precision: 2,
			});
			expect(result.number).toEqual(85.19);
			expect(result.unit).toEqual('K');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 2582,
				precision: 2,
			});
			expect(result.number).toEqual(2.58);
			expect(result.unit).toEqual('K');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 582,
				precision: 2,
			});
			expect(result.number).toEqual(582);
			expect(result.unit).toEqual('');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 99.456456,
				precision: 2,
			});
			expect(result.number).toEqual(99.46);
			expect(result.unit).toEqual('');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 5.456456,
				precision: 2,
			});
			expect(result.number).toEqual(5.46);
			expect(result.unit).toEqual('');
		});

		it('returns right result', () => {
			const result = getHumanReadableLargeNumber({
				number: 0.868,
				precision: 2,
			});
			expect(result.number).toEqual(0.87);
			expect(result.unit).toEqual('');
		});
	});
});
