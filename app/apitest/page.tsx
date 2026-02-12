'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Table, message, Space, Input, Select, Tag, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// 定义枚举列表项的接口
interface EnumItem {
  id: number;
  name: string;
  value: string | number;
  description?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

// 定义响应数据的接口
interface EmployeeListResponse {
  success: boolean;
  data: EnumItem[];
  message?: string;
  total?: number;
}

const HomePage = () => {
  // 状态管理
  const [data, setData] = useState<EnumItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 获取枚举列表数据
  const fetchEmployeeList= async (page = 1, keyword = '', status = '') => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (keyword) {
        params.append('keyword', keyword);
      }
      
      if (status) {
        params.append('status', status);
      }

      // 调用GET接口
      const response = await fetch(`/api/employeeList?${params.toString()}`);
      const result: EmployeeListResponse = await response.json();

      if (result.success) {
        setData(result.data || []);
        setTotal(result.total || 0);
      } else {
        message.error(result.message || '获取数据失败');
      }
    } catch (error) {
      console.error('获取枚举列表失败:', error);
      message.error('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchEmployeeList(currentPage, searchKeyword, statusFilter);
  }, [currentPage, pageSize]);

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmployeeList(1, searchKeyword, statusFilter);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    setStatusFilter('');
    setCurrentPage(1);
    fetchEmployeeList(1, '', '');
  };

  // 分页处理
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  // 删除操作
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/employeeList?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        message.success('删除成功');
        // 重新加载数据
        fetchEmployeeList(currentPage, searchKeyword, statusFilter);
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '值',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      key: 'created_time',
      width: 180,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: EnumItem) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => message.info('编辑功能待实现')}
          >
            编辑
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => {
              if (window.confirm(`确定要删除"${record.name}"吗？`)) {
                handleDelete(record.id);
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title="枚举列表管理" className="mb-4">
        {/* 搜索和筛选区域 */}
        <div className="mb-4 flex gap-4 items-end">
          <Input
            placeholder="请输入关键词"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="选择状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value="active">启用</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => message.info('新增功能待实现')}
            >
              新增
            </Button>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />

        {/* 分页组件 */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={(_, size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default HomePage;