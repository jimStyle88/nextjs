-- 创建枚举列表表
CREATE TABLE IF NOT EXISTS enum_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_name (name),
  INDEX idx_value (value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;