import { NextRequest, NextResponse } from 'next/server';
import { findUserByUsername, createUser, initUserTable } from '@/lib/login';

export async function POST(request: NextRequest) {
    try {

        const { username, password, name } = await request.json();

        // 验证输入
        if (!username || !password) {
            return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 });
        }

        // 检查用户是否已存在
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return NextResponse.json({ error: '用户已存在' }, { status: 400 });
        }

        // 创建用户
        const newUser = await createUser(username, password, name);

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error('注册错误:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}