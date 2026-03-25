'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const calculateHeadPosition = (minionX: number, minionY: number) => {
        const distanceX = mousePosition.x - minionX;
        const distanceY = mousePosition.y - minionY;
        const maxHeadMove = 10;
        const headX = Math.max(-maxHeadMove, Math.min(maxHeadMove, distanceX * 0.05));
        const headY = Math.max(-maxHeadMove, Math.min(maxHeadMove, distanceY * 0.05));
        return { headX, headY };
    };

    const calculateEyePosition = (minionX: number, minionY: number) => {
        if (isTyping) {
            return { eyeX: -6, eyeY: 0 };
        }

        const distanceX = mousePosition.x - minionX;
        const distanceY = mousePosition.y - minionY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 20;
        const scale = Math.min(distance / maxDistance, 1);
        const angle = Math.atan2(distanceY, distanceX);
        const eyeX = Math.cos(angle) * scale * 6;
        const eyeY = Math.sin(angle) * scale * 6;
        return { eyeX, eyeY };
    };

    const handleSubmit = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('登录信息:', values);
            message.success('登录成功');
            router.push('/');
        } catch (error) {
            message.error('登录失败，请检查账号密码');
            console.error('登录错误:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex">
            {/* 左边小黄人区域 */}
            <div className="w-1/2 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center p-8">
                <div className="flex space-x-8">
                    {/* 第一个小黄人 */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-40 h-40 bg-yellow-400 rounded-full relative"
                            style={{
                                transform: `translate(${calculateHeadPosition(120, 100).headX}px, ${calculateHeadPosition(120, 100).headY}px)`,
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {/* 眼睛 */}
                            <div className="absolute top-10 left-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(120, 100).eyeX}px, ${calculateEyePosition(120, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            <div className="absolute top-10 right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(160, 100).eyeX}px, ${calculateEyePosition(160, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            {/* 嘴巴 */}
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-black rounded-full"></div>
                            {/* 眼镜 */}
                            <div className="absolute top-8 left-6 w-28 h-12 border-2 border-black rounded-full"></div>
                        </div>
                        <div className="w-20 h-32 bg-blue-500 mt-2 rounded-t-full flex justify-center">
                            <div className="w-16 h-20 bg-blue-500 rounded-t-full border-t-4 border-blue-600"></div>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* 第二个小黄人 */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-40 h-40 bg-yellow-400 rounded-full relative"
                            style={{
                                transform: `translate(${calculateHeadPosition(240, 100).headX}px, ${calculateHeadPosition(240, 100).headY}px)`,
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {/* 眼睛 */}
                            <div className="absolute top-10 left-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(240, 100).eyeX}px, ${calculateEyePosition(240, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            <div className="absolute top-10 right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(280, 100).eyeX}px, ${calculateEyePosition(280, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            {/* 嘴巴 */}
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-black rounded-full"></div>
                            {/* 头发 */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                <div className="w-16 h-8 bg-black rounded-b-full"></div>
                            </div>
                        </div>
                        <div className="w-20 h-32 bg-blue-500 mt-2 rounded-t-full flex justify-center">
                            <div className="w-16 h-20 bg-blue-500 rounded-t-full border-t-4 border-blue-600"></div>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* 第三个小黄人 */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-40 h-40 bg-yellow-400 rounded-full relative"
                            style={{
                                transform: `translate(${calculateHeadPosition(360, 100).headX}px, ${calculateHeadPosition(360, 100).headY}px)`,
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {/* 眼睛 */}
                            <div className="absolute top-10 left-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(360, 100).eyeX}px, ${calculateEyePosition(360, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            <div className="absolute top-10 right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div
                                    className="w-4 h-4 bg-black rounded-full"
                                    style={{
                                        transform: `translate(${calculateEyePosition(400, 100).eyeX}px, ${calculateEyePosition(400, 100).eyeY}px)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>
                            {/* 嘴巴 */}
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-black rounded-full"></div>
                            {/* 帽子 */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-red-500 rounded-b-full"></div>
                        </div>
                        <div className="w-20 h-32 bg-blue-500 mt-2 rounded-t-full flex justify-center">
                            <div className="w-16 h-20 bg-blue-500 rounded-t-full border-t-4 border-blue-600"></div>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                            <div className="w-10 h-20 bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右边登录窗口 */}
            <div className="w-1/2 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-8">
                <Card
                    title="用户登录"
                    className="w-full max-w-md shadow-lg"
                    style={{
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={handleSubmit}
                        layout="vertical"
                        onFieldsChange={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                    >
                        <Form.Item
                            name="username"
                            label="账号"
                            rules={[
                                { required: true, message: '请输入账号' },
                                { min: 3, message: '账号长度至少为3个字符' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="请输入账号"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度至少为6个字符' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="请输入密码"
                                size="large"
                                visibilityToggle
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                                style={{
                                    height: '48px',
                                    borderRadius: '4px',
                                    backgroundColor: '#1890ff',
                                    borderColor: '#1890ff',
                                }}
                            >
                                登录
                            </Button>
                        </Form.Item>

                        <div className="flex justify-between text-sm text-gray-500">
                            <a href="#" className="hover:text-blue-500">忘记密码？</a>
                            <a href="#" className="hover:text-blue-500">注册账号</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;