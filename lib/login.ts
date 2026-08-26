import { query, insert } from './mysql';
import { hashPassword, verifyPassword } from './auth';

// 定义用户接口
export interface User {
    id: number;
    username: string;
    password: string;
    name?: string;
    created_at?: Date;
    updated_at?: Date;
}

// 根据用户名查找用户
export async function findUserByUsername(username: string): Promise<User | null> {
    try {
        const users = await query<User[]>(
            'SELECT id, username, password, name, created_at, updated_at FROM users WHERE username = ?',
            [username]
        );
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('查找用户失败:', error);
        throw error;
    }
}

// 根据ID查找用户
export async function findUserById(id: number): Promise<User | null> {
    try {
        const users = await query<User[]>(
            'SELECT id, username, password, name, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('查找用户失败:', error);
        throw error;
    }
}

// 创建新用户
export async function createUser(username: string, password: string, name?: string): Promise<User> {
    try {
        // 哈希密码
        const hashedPassword = await hashPassword(password);

        // 插入用户
        const result = await insert('users', {
            username,
            password: hashedPassword,
            name
        });

        // 返回创建的用户
        const newUser = await findUserById(result.insertId);
        if (!newUser) {
            throw new Error('用户创建失败');
        }
        return newUser;
    } catch (error) {
        console.error('创建用户失败:', error);
        throw error;
    }
}

// 验证用户密码
export async function verifyUserPassword(username: string, password: string): Promise<User | null> {
    try {
        // 查找用户
        const user = await findUserByUsername(username);
        if (!user) {
            return null;
        }

        // 验证密码
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('验证用户密码失败:', error);
        throw error;
    }
}

// 初始化用户表
export async function initUserTable(): Promise<void> {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('用户表初始化成功');
    } catch (error) {
        console.error('用户表初始化失败:', error);
        throw error;
    }
}

// 初始化测试数据
export async function initTestData(): Promise<void> {
    try {
        // 检查是否已有测试数据
        const countResult = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM users');
        if (countResult[0]?.count > 0) {
            console.log('用户表已有数据，跳过测试数据插入');
            return;
        }

        // 创建测试用户
        await createUser('admin', 'password', '管理员');
        await createUser('user', 'password', '普通用户');

        console.log('测试数据初始化成功');
        console.log('测试账号:');
        console.log('- 账号: admin, 密码: password');
        console.log('- 账号: user, 密码: password');
    } catch (error) {
        console.error('测试数据初始化失败:', error);
        throw error;
    }
}