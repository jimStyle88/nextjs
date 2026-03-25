'use client';

import { Button, message, Row, Col } from 'antd';
import { FormInstance } from 'antd/es/form';
import FormLayout from './components/FormLayout';
import FormField from './components/FormField';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';

// 表单数据类型定义
interface FormData {
  name: string;
  gender: 'male' | 'female';
  birthDate: string | null;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  occupation: string;
  company?: string;
  salary?: number;
  idCard: string;
  maritalStatus?: string;
  interests?: string;
}

// 表单验证错误信息类型
type FormErrorInfo = Parameters<FormInstance['validateFields']>[1];

const FormPage = () => {
  const onFinish = (values: FormData) => {
    console.log('Form values:', values);
    message.success('表单提交成功！');
  };


  const onFinishFailed = (errorInfo: FormErrorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('表单验证失败，请检查输入！');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">个人资料表单</h1>

        <FormLayout<FormData>
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            gender: 'male',
            education: 'bachelor',
            nationality: 'china',
          }}
        >
          {/* 基本信息 */}
          <div className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">基本信息</h2>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormField
                  name="name"
                  label="姓名"
                  type="input"
                  placeholder="请输入姓名"
                  required
                  rules={[{ pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6个汉字' }]}
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="gender"
                  label="性别"
                  type="radio"
                  options={[
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                  ]}
                  required
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="birthDate"
                  label="出生日期"
                  type="date"
                  placeholder="请选择出生日期"
                  required
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="nationality"
                  label="国籍"
                  type="select"
                  placeholder="请选择国籍"
                  options={[
                    { value: 'china', label: '中国' },
                    { value: 'usa', label: '美国' },
                    { value: 'uk', label: '英国' },
                    { value: 'japan', label: '日本' },
                  ]}
                  required
                />
              </Col>
            </Row>
          </div>

          {/* 联系方式 */}
          <div className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">联系方式</h2>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormField
                  name="email"
                  label="电子邮箱"
                  type="input"
                  placeholder="请输入电子邮箱"
                  required
                  rules={[{ type: 'email', message: '请输入有效的电子邮箱地址' }]}
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="phone"
                  label="手机号码"
                  type="input"
                  placeholder="请输入手机号码"
                  required
                  rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]}
                />
              </Col>
              <Col span={24}>
                <FormField
                  name="address"
                  label="居住地址"
                  type="input"
                  placeholder="请输入居住地址"
                  required
                />
              </Col>
            </Row>
          </div>

          {/* 教育与职业 */}
          <div className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">教育与职业</h2>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormField
                  name="education"
                  label="最高学历"
                  type="select"
                  placeholder="请选择最高学历"
                  options={[
                    { value: 'highSchool', label: '高中' },
                    { value: 'associate', label: '专科' },
                    { value: 'bachelor', label: '本科' },
                    { value: 'master', label: '硕士' },
                    { value: 'doctor', label: '博士' },
                  ]}
                  required
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="occupation"
                  label="职业"
                  type="input"
                  placeholder="请输入职业"
                  required
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="company"
                  label="工作单位"
                  type="input"
                  placeholder="请输入工作单位"
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="salary"
                  label="月收入"
                  type="number"
                  placeholder="请输入月收入"
                  inputNumberProps={{ min: 0, max: 1000000, step: 100 }}
                />
              </Col>
            </Row>
          </div>

          {/* 其他信息 */}
          <div className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">其他信息</h2>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormField
                  name="idCard"
                  label="身份证号"
                  type="input"
                  placeholder="请输入身份证号"
                  required
                  rules={[{ pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入有效的身份证号码' }]}
                />
              </Col>
              <Col span={12}>
                <FormField
                  name="maritalStatus"
                  label="婚姻状况"
                  type="select"
                  placeholder="请选择婚姻状况"
                  options={[
                    { value: 'single', label: '未婚' },
                    { value: 'married', label: '已婚' },
                    { value: 'divorced', label: '离婚' },
                    { value: 'widowed', label: '丧偶' },
                  ]}
                />
              </Col>
              <Col span={24}>
                <FormField
                  name="interests"
                  label="兴趣爱好"
                  type="input"
                  placeholder="请输入兴趣爱好，多个爱好用逗号分隔"
                />
              </Col>
            </Row>
          </div>

          {/* 提交按钮 */}
          <Row>
            <Col span={24} className="text-center">
              <Button type="primary" htmlType="submit" size="large" className="mr-4">
                提交表单
              </Button>
              <Button htmlType="reset" size="large">
                重置表单
              </Button>
            </Col>
          </Row>
        </FormLayout>
      </div>
    </div>
  );
};

export default FormPage;