'use client';

import { Form, Input, Select, Radio, DatePicker, Upload, InputNumber } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'input' | 'select' | 'radio' | 'date' | 'upload' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  rules?: Array<{
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    type?: 'email' | 'url' | 'number' | 'integer' | 'float' | 'array' | 'object' | 'date' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'boolean' | 'method' | 'regexp';
  }>;
  required?: boolean;
  disabled?: boolean;
  span?: number;
  defaultValue?: string | number | boolean | null | Date;
  uploadProps?: UploadProps;
  inputNumberProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  };
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'input',
  placeholder,
  options,
  rules = [],
  required = false,
  disabled = false,
  span = 12,
  defaultValue,
  uploadProps,
  inputNumberProps,
}) => {
  const fieldRules = [...rules];
  
  if (required) {
    fieldRules.push({
      required: true,
      message: `请输入${label}`,
    });
  }

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            placeholder={placeholder}
            options={options}
            disabled={disabled}
          />
        );
      case 'radio':
        return (
          <Radio.Group disabled={disabled}>
            {options?.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'date':
        return (
          <DatePicker
            style={{ width: '100%' }}
            placeholder={placeholder}
            disabled={disabled}
            defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
          />
        );
      case 'upload':
        return <Upload {...uploadProps} />;
      case 'number':
        return (
          <InputNumber
            placeholder={placeholder}
            disabled={disabled}
            {...inputNumberProps}
          />
        );
      case 'input':
      default:
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={fieldRules}
      span={span}
      style={{ marginBottom: '16px' }}
    >
      {renderField()}
    </Form.Item>
  );
};

export default FormField;