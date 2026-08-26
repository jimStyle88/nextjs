'use client';

import { Form } from 'antd';
import { ReactNode } from 'react';
import { FormInstance } from 'antd/es/form';

interface FormLayoutProps<T = any> {
  children: ReactNode;
  onFinish?: (values: T) => void;
  onFinishFailed?: (errorInfo: Parameters<FormInstance['validateFields']>[1]) => void;
  initialValues?: Partial<T>;
}

const FormLayout = <T extends object>({
  children,
  onFinish,
  onFinishFailed,
  initialValues,
}: FormLayoutProps<T>) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
    >
      <Form.Item
        wrapperCol={{ span: 24 }}
        className="mb-6"
      >
        {children}
      </Form.Item>
    </Form>
  );
};

export default FormLayout;