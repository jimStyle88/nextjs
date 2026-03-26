import { NextRequest, NextResponse } from 'next/server';
import { verifyUserPassword, initUserTable, initTestData } from '@/lib/login';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {

        const { username, password } = await request.json();

        // 验证输入
        if (!username || !password) {
            return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 });
        }

        // 验证用户密码
        const user = await verifyUserPassword(username, password);
        if (!user) {
            return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
        }

        // 生成JWT token
        const token = generateToken(user.id, user.username);

        // 设置cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
            },
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7天
        });

        return response;
    } catch (error) {
        console.error('登录错误:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}