-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  company_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_number VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company_id INT REFERENCES companies(company_id)
);

-- Create designations table
CREATE TABLE IF NOT EXISTS designations (
  designation_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company_id INT REFERENCES companies(company_id)
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  employee_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(company_id),
  role_id INT REFERENCES roles(role_id),
  department_id INT REFERENCES departments(department_id),
  designation_id INT REFERENCES designations(designation_id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  password TEXT,
  employee_code VARCHAR(100) UNIQUE,
  joining_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create shift_timings table
CREATE TABLE IF NOT EXISTS shift_timings (
  shift_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(company_id),
  shift_name VARCHAR(100),
  from_time TIME NOT NULL,
  to_time TIME NOT NULL,
  is_night_shift BOOLEAN DEFAULT FALSE
);

-- Create leave_types table
CREATE TABLE IF NOT EXISTS leave_types (
  leave_type_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(company_id),
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  leave_balance INT
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  holiday_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(company_id),
  holiday_date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_optional BOOLEAN DEFAULT FALSE
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(employee_id),
  punch_in TIMESTAMP,
  punch_out TIMESTAMP,
  punch_in_latitude DECIMAL(9,6),
  punch_in_longitude DECIMAL(9,6),
  punch_in_photo TEXT, --Base 64 encoded image
  punch_out_latitude DECIMAL(9,6),
  punch_out_longitude DECIMAL(9,6),
  punch_out_photo TEXT, --Base 64 encoded image
  shift_id INT REFERENCES shift_timings(shift_id),
  attendance_date DATE NOT NULL,
  working_hours INTERVAL,
  status VARCHAR(50) DEFAULT 'Present',
  CONSTRAINT unique_attendance UNIQUE(employee_id, attendance_date)
);

-- Create leave_applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  leave_id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(employee_id),
  leave_type_id INT REFERENCES leave_types(leave_type_id),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  applied_at TIMESTAMP DEFAULT NOW(),
  approved_by INT REFERENCES employees(employee_id)
);

-- Create leave_balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  balance_id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(employee_id),
  leave_type_id INT REFERENCES leave_types(leave_type_id),
  year INT,
  balance DECIMAL(5,2) DEFAULT 0,
  carried_forward DECIMAL(5,2) DEFAULT 0
);

-- Ensure column exists
ALTER TABLE leave_types
ADD COLUMN IF NOT EXISTS leave_balance INT;
