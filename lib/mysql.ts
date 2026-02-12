
import { pool } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 执行查询
export async function query<T = RowDataPacket[]>(
    sql: string,
    params?: any[]
): Promise<T> {
    try {
        // 确保参数是数组
        const safeParams = Array.isArray(params) ? params : [];
        console.log('执行SQL:', sql);
        console.log('参数:', safeParams);

        const [rows] = await pool.execute(sql, safeParams);
        return rows as T;
    } catch (error) {
        console.error('查询执行失败:', error);
        console.error('SQL语句:', sql);
        console.error('参数:', params);
        throw error;
    }
}

// 执行插入操作
export async function insert(
    table: string,
    data: Record<string, any>
): Promise<ResultSetHeader> {
    const keys = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;

    try {
        const [result] = await pool.execute(sql, values);
        return result as ResultSetHeader;
    } catch (error) {
        console.error('插入操作失败:', error);
        throw error;
    }
}

// 执行更新操作
export async function update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
): Promise<ResultSetHeader> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = [...Object.values(data), ...Object.values(where)];

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

    try {
        const [result] = await pool.execute(sql, values);
        return result as ResultSetHeader;
    } catch (error) {
        console.error('更新操作失败:', error);
        throw error;
    }
}

// 执行删除操作
export async function remove(
    table: string,
    where: Record<string, any>
): Promise<ResultSetHeader> {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(where);

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

    try {
        const [result] = await pool.execute(sql, values);
        return result as ResultSetHeader;
    } catch (error) {
        console.error('删除操作失败:', error);
        throw error;
    }
}