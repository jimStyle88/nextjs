/**
 * QPsumValues - 计算传入值的累加
 *
 * @param {number[]} values - 一个包含数字的数组。
 * @returns {number} - 返回所有数字的累加和。
 *
 * @example
 * const numbers = [1, 2, 3, 4];
 * const result = QPsumValues(numbers);
 * console.log(result); // 输出: 10
 */
export function QPsumValues(values: number[]): number {
    if (!Array.isArray(values)) {
        throw new Error('输入必须是一个数字数组');
    }

    return values.reduce((sum, value) => {
        if (typeof value !== 'number') {
            throw new Error('数组中的每个元素都必须是数字');
        }
        return sum + value;
    }, 0);
}