// lib/db.ts
import mysql from 'mysql2/promise';

// 数据库连接配置
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // 处理 bigint 类型，避免 JavaScript 精度丢失
    supportBigNumbers: true,
    bigNumberStrings: true,
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('数据库连接成功');
        connection.release();
    } catch (error) {
        console.error('数据库连接失败:', error);
    }
}

// 导出连接池和测试函数
export { pool, testConnection };