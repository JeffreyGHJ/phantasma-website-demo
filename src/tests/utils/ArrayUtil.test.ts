import { findLastIndex } from '../../utils/ArrayUtil';

describe('ArrayUtil', () => {
	describe('findLastIndex', () => {
		it('returns right result', () => {
			const result = findLastIndex(
				[1, 2, 1, 3, 5, 7, 9, 24, 98, 4, 3, 2, 1],
				(item) => {
					return item === 3;
				}
			);
			expect(result).toEqual(10);
		});

		it('returns right result', () => {
			const result = findLastIndex(
				[1, 2, 1, 3, 5, 7, 9, 24, 98, 4, 3, 2, 1],
				(item) => {
					return item === 1;
				}
			);
			expect(result).toEqual(12);
		});
	});
});
