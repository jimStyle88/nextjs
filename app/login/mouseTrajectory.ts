/**
 * 计算鼠标的行动轨迹
 * 
 * @param {Array<{ x: number, y: number }>} points - 鼠标移动的点集合，每个点包含 x 和 y 坐标。
 * @returns {number} - 返回鼠标移动的总距离。
 * 
 * @example
 * const points = [
 *   { x: 0, y: 0 },
 *   { x: 3, y: 4 },
 *   { x: 6, y: 8 }
 * ];
 * const distance = calculateMouseTrajectory(points);
 * console.log(distance); // 输出: 10
 */
export function calculateMouseTrajectory(points: Array<{ x: number; y: number }>): number {
    if (!Array.isArray(points) || points.length < 2) {
        throw new Error('必须提供至少两个点来计算轨迹');
    }

    let totalDistance = 0;

    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    return totalDistance;
}