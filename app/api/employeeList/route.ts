
import { NextRequest, NextResponse } from 'next/server';
import { query, insert, update, remove } from '@/lib/mysql';

// 定义枚举列表项的接口
export interface EnumItem {
    id: number;
    name: string;
    value: string | number;
    description?: string;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}

// 定义响应数据的接口
export interface EmployeelistResponse {
    success: boolean;
    data: EnumItem[];
    message?: string;
    total?: number;
}

// 定义单个枚举项的响应接口
export interface EnumItemResponse {
    success: boolean;
    data?: EnumItem;
    message?: string;
}

// 查询接口 - 获取所有枚举列表
// 查询接口 - 获取所有枚举列表
export async function GET(req: NextRequest) {
    try {
        // 获取查询参数
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const keyword = searchParams.get('keyword');
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        // 构建查询条件
        let whereConditions = [];
        let params = [];

        if (status) {
            whereConditions.push('status = ?');
            params.push(status);
        }

        if (keyword) {
            whereConditions.push('(name LIKE ? OR status LIKE ? OR description LIKE ?)');
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        console.log("dataSql:------", whereClause);

        // 获取总数
        const countSql = `SELECT COUNT(*) as total FROM employeelist ${whereClause}`;
        const countResult = await query<{ total: number }[]>(countSql, params);
        const total = countResult[0]?.total || 0;

        // 获取分页数据 - 修复参数不匹配问题
        const offset = (page - 1) * pageSize;
        const dataSql = `SELECT * FROM employeelist ${whereClause} ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
        // 使用字符串插值而不是参数传递，避免参数不匹配
        const rows = await query<EnumItem[]>(dataSql, params);

        // 转换 ID 为字符串，避免 JavaScript 精度丢失
        const formattedRows = rows.map(row => ({
            ...row,
            id: row.id.toString()
        }));

        // 返回成功响应
        return NextResponse.json<EmployeelistResponse>({
            success: true,
            data: formattedRows,
            total,
            message: '枚举列表获取成功',
        }, { status: 200 });
    } catch (error) {
        console.error('获取枚举列表失败:', error);
        return NextResponse.json<EmployeelistResponse>({
            success: false,
            data: [],
            message: '获取枚举列表失败',
        }, { status: 500 });
    }
}

// 创建接口 - 添加新的枚举项
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('POST request body:', body);

        // 验证必填字段
        if (!body || !body.name || !body.sex || !body.description) {
            return NextResponse.json<EnumItemResponse>({
                success: false,
                message: '名称和值是必填字段',
            }, { status: 400 });
        }

        // 添加时间戳
        const { id, ...enumData } = {
            ...body,
            status: 1,
            created_at: new Date(),
            updated_at: new Date(),
        };

        // 插入数据库
        const result = await insert('employeelist', enumData);

        // 获取插入后的数据
        const insertedItem = await query<EnumItem[]>(
            'SELECT * FROM employeelist WHERE id = ?',
            [result.insertId]
        );

        // 转换 ID 为字符串，避免 JavaScript 精度丢失
        const formattedItem = insertedItem[0] ? {
            ...insertedItem[0],
            id: insertedItem[0].id.toString()
        } : undefined;

        // 返回成功响应
        return NextResponse.json<EnumItemResponse>({
            success: true,
            data: formattedItem,
            message: '枚举项创建成功',
        }, { status: 201 });
    } catch (error) {
        console.error('创建枚举项失败:', error);
        return NextResponse.json<EnumItemResponse>({
            success: false,
            message: '创建枚举项失败',
        }, { status: 500 });
    }
}

// 更新接口 - 修改现有的枚举项
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        // 验证必填字段
        if (!body || !body.id) {
            return NextResponse.json<EnumItemResponse>({
                success: false,
                message: 'ID是必填字段',
            }, { status: 400 });
        }

        // 添加更新时间
        const updateData = {
            ...body,
            updated_at: new Date(),
        };

        // 更新数据库
        await update('employeelist', updateData, { id: body.id });

        // 获取更新后的数据
        const updatedItem = await query<EnumItem[]>(
            'SELECT * FROM employeelist WHERE id = ?',
            [body.id]
        );

        // 转换 ID 为字符串，避免 JavaScript 精度丢失
        const formattedItem = updatedItem[0] ? {
            ...updatedItem[0],
            id: updatedItem[0].id.toString()
        } : undefined;

        // 返回成功响应
        return NextResponse.json<EnumItemResponse>({
            success: true,
            data: formattedItem,
            message: '枚举项更新成功',
        }, { status: 200 });
    } catch (error) {
        console.error('更新枚举项失败:', error);
        return NextResponse.json<EnumItemResponse>({
            success: false,
            message: '更新枚举项失败',
        }, { status: 500 });
    }
}

// 删除接口 - 删除指定的枚举项
export async function DELETE(req: NextRequest) {
    try {
        // 获取查询参数中的ID
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json<EnumItemResponse>({
                success: false,
                message: 'ID是必填字段',
            }, { status: 400 });
        }

        // 获取要删除的项
        const itemToDelete = await query<EnumItem[]>(
            'SELECT * FROM employeelist WHERE id = ?',
            [id]
        );

        if (itemToDelete.length === 0) {
            return NextResponse.json<EnumItemResponse>({
                success: false,
                message: '未找到指定的枚举项',
            }, { status: 404 });
        }

        // 删除数据库记录
        await remove('employeelist', { id });

        // 转换 ID 为字符串，避免 JavaScript 精度丢失
        const formattedItem = itemToDelete[0] ? {
            ...itemToDelete[0],
            id: itemToDelete[0].id.toString()
        } : undefined;

        // 返回成功响应
        return NextResponse.json<EnumItemResponse>({
            success: true,
            data: formattedItem,
            message: '枚举项删除成功',
        }, { status: 200 });
    } catch (error) {
        console.error('删除枚举项失败:', error);
        return NextResponse.json<EnumItemResponse>({
            success: false,
            message: '删除枚举项失败',
        }, { status: 500 });
    }
}