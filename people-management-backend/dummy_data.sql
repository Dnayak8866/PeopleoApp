-- =============================================================================
-- Peopleo App - Master Dummy Data Seed Script
-- Compatible with PostgreSQL schema & TypeORM Entities
-- =============================================================================

-- 1. CLEANUP EXISTING DATA (Optional safely cascaded clean up)
TRUNCATE TABLE 
  attendance, 
  leave_applications, 
  holidays, 
  leave_types, 
  shift_timings, 
  employees, 
  designations, 
  departments, 
  roles, 
  companies 
RESTART IDENTITY CASCADE;

-- 2. INSERT COMPANY
INSERT INTO companies (name, email, contact_number, address, created_at)
VALUES ('TechNova Solutions', 'info@technova.com', '+91-9876543210', '123 Tech Park, Silicon Valley, CA', NOW());

-- 3. INSERT ROLES
INSERT INTO roles (role_name) VALUES ('Admin'), ('Employee');

-- 4. INSERT DEPARTMENTS
INSERT INTO departments (name, company_id)
VALUES 
  ('Engineering', 1),
  ('Human Resources', 1),
  ('Sales & Business', 1),
  ('Marketing & Growth', 1),
  ('Product & Design', 1);

-- 5. INSERT DESIGNATIONS
INSERT INTO designations (name, company_id)
VALUES 
  ('Engineering Lead', 1),
  ('Software Engineer', 1),
  ('HR Manager', 1),
  ('Sales Executive', 1),
  ('Marketing Specialist', 1),
  ('UI/UX Designer', 1),
  ('QA Engineer', 1);

-- 6. INSERT SHIFT TIMINGS
INSERT INTO shift_timings (company_id, shift_name, from_time, to_time, is_night_shift)
VALUES 
  (1, 'Regular Shift', '09:00:00', '17:00:00', FALSE),
  (1, 'Evening Shift', '13:00:00', '21:00:00', FALSE),
  (1, 'Night Shift', '22:00:00', '06:00:00', TRUE);

-- 7. INSERT LEAVE TYPES
INSERT INTO leave_types (company_id, type_name, description, leave_balance)
VALUES 
  (1, 'Casual Leave', 'Casual leave for personal matters', 12),
  (1, 'Sick Leave', 'Leave for medical and health issues', 10),
  (1, 'Earned Leave', 'Annual privilege leave', 15),
  (1, 'Maternity/Paternity Leave', 'Parental support leave', 90);

-- 8. INSERT HOLIDAYS (2026)
INSERT INTO holidays (company_id, holiday_date, name, is_optional)
VALUES 
  (1, '2026-01-01', 'New Year''s Day', FALSE),
  (1, '2026-01-26', 'Republic Day', FALSE),
  (1, '2026-03-25', 'Holi', FALSE),
  (1, '2026-05-01', 'Labor Day', FALSE),
  (1, '2026-08-15', 'Independence Day', FALSE),
  (1, '2026-10-02', 'Gandhi Jayanti', TRUE),
  (1, '2026-11-01', 'Diwali', FALSE),
  (1, '2026-12-25', 'Christmas', FALSE);

-- 9. INSERT EMPLOYEES
-- Passwords: plain text string or hashed (e.g. 123456789)
INSERT INTO employees (
  company_id, role_id, department_id, designation_id, shift_id,
  full_name, email, phone_number, password, employee_code,
  joining_date, dob, gender, is_active, is_deleted, created_at
) VALUES 
  -- EMP001 (Admin/Owner)
  (1, 1, 1, 1, 1, 'John Doe', 'john.doe@technova.com', '+91-9876543210', '123456789', 'EMP001', '2024-01-15', '1988-04-12', 'Male', TRUE, FALSE, NOW()),
  -- EMP002 (HR Manager)
  (1, 2, 2, 3, 1, 'Jane Smith', 'jane.smith@technova.com', '+91-9876543211', '123456789', 'EMP002', '2024-02-01', '1990-08-25', 'Female', TRUE, FALSE, NOW()),
  -- EMP003 (Software Engineer)
  (1, 2, 1, 2, 1, 'Alex Rivera', 'alex.rivera@technova.com', '+91-9876543212', '123456789', 'EMP003', '2024-03-10', '1993-11-05', 'Male', TRUE, FALSE, NOW()),
  -- EMP004 (Sales Executive)
  (1, 2, 3, 4, 1, 'Sarah Connor', 'sarah.connor@technova.com', '+91-9876543213', '123456789', 'EMP004', '2024-04-01', '1992-02-14', 'Female', TRUE, FALSE, NOW()),
  -- EMP005 (Marketing Specialist)
  (1, 2, 4, 5, 1, 'Michael Scott', 'michael.scott@technova.com', '+91-9876543214', '123456789', 'EMP005', '2024-05-15', '1985-03-15', 'Male', TRUE, FALSE, NOW()),
  -- EMP006 (UI/UX Designer)
  (1, 2, 5, 6, 1, 'Emily Davis', 'emily.davis@technova.com', '+91-9876543215', '123456789', 'EMP006', '2024-06-01', '1995-07-20', 'Female', TRUE, FALSE, NOW()),
  -- EMP007 (QA Engineer)
  (1, 2, 1, 7, 1, 'David Miller', 'david.miller@technova.com', '+91-9876543216', '123456789', 'EMP007', '2024-07-10', '1991-09-30', 'Male', TRUE, FALSE, NOW());

-- 10. INSERT LEAVE APPLICATIONS
INSERT INTO leave_applications (
  employee_id, leave_type_id, from_date, to_date, reason, status, duration, applied_at, approved_by
) VALUES 
  (2, 1, '2026-08-05', '2026-08-06', 'Personal family event', 'Approved', 'Full Day', '2026-08-01 10:00:00', 1),
  (3, 2, '2026-08-10', '2026-08-11', 'Viral fever and rest', 'Approved', 'Full Day', '2026-08-09 09:30:00', 1),
  (4, 1, '2026-08-14', '2026-08-14', 'Doctor appointment', 'Pending', 'Full Day', '2026-08-03 14:20:00', NULL),
  (6, 3, '2026-08-18', '2026-08-20', 'Summer vacation', 'Approved', 'Full Day', '2026-08-02 11:15:00', 1);

-- 11. INSERT MONTHLY ATTENDANCE LOGS (August 2026)
-- Working days across August 2026 for Employees 1 to 7

INSERT INTO attendance (
  employee_id, shift_id, attendance_date, session_number, 
  punch_in, punch_out, punch_in_latitude, punch_in_longitude, 
  is_punch_in_from_office, punch_out_latitude, punch_out_longitude, 
  is_punch_out_from_office, working_hours, status
) VALUES 
  -- -------------------------------------------------------------
  -- Employee 1: John Doe (Admin) - On time / High attendance
  -- -------------------------------------------------------------
  (1, 1, '2026-08-03', 1, '2026-08-03 08:58:00', '2026-08-03 17:05:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:07:00', 'Present'),
  (1, 1, '2026-08-04', 1, '2026-08-04 09:02:00', '2026-08-04 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:58:00', 'Present'),
  (1, 1, '2026-08-05', 1, '2026-08-05 08:55:00', '2026-08-05 17:10:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:15:00', 'Present'),
  (1, 1, '2026-08-06', 1, '2026-08-06 09:00:00', '2026-08-06 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 2: Jane Smith (HR) - Approved Leave on Aug 5-6
  -- -------------------------------------------------------------
  (2, 1, '2026-08-03', 1, '2026-08-03 09:00:00', '2026-08-03 17:02:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:02:00', 'Present'),
  (2, 1, '2026-08-04', 1, '2026-08-04 09:05:00', '2026-08-04 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:55:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 3: Alex Rivera (Engineer) - Punctual
  -- -------------------------------------------------------------
  (3, 1, '2026-08-03', 1, '2026-08-03 08:50:00', '2026-08-03 17:15:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:25:00', 'Present'),
  (3, 1, '2026-08-04', 1, '2026-08-04 08:55:00', '2026-08-04 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:05:00', 'Present'),
  (3, 1, '2026-08-05', 1, '2026-08-05 09:00:00', '2026-08-05 17:05:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:05:00', 'Present'),
  (3, 1, '2026-08-06', 1, '2026-08-06 08:59:00', '2026-08-06 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:01:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 4: Sarah Connor (Sales) - Occasional Late
  -- -------------------------------------------------------------
  (4, 1, '2026-08-03', 1, '2026-08-03 09:40:00', '2026-08-03 17:30:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:50:00', 'Present'),
  (4, 1, '2026-08-04', 1, '2026-08-04 09:00:00', '2026-08-04 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present'),
  (4, 1, '2026-08-05', 1, '2026-08-05 09:45:00', '2026-08-05 17:30:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:45:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 5: Michael Scott (Marketing) - Present
  -- -------------------------------------------------------------
  (5, 1, '2026-08-03', 1, '2026-08-03 09:00:00', '2026-08-03 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present'),
  (5, 1, '2026-08-04', 1, '2026-08-04 09:05:00', '2026-08-04 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:55:00', 'Present'),
  (5, 1, '2026-08-05', 1, '2026-08-05 08:58:00', '2026-08-05 17:02:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:04:00', 'Present'),
  (5, 1, '2026-08-06', 1, '2026-08-06 09:00:00', '2026-08-06 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 6: Emily Davis (Design) - Present
  -- -------------------------------------------------------------
  (6, 1, '2026-08-03', 1, '2026-08-03 08:55:00', '2026-08-03 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:05:00', 'Present'),
  (6, 1, '2026-08-04', 1, '2026-08-04 09:00:00', '2026-08-04 17:05:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:05:00', 'Present'),
  (6, 1, '2026-08-05', 1, '2026-08-05 09:12:00', '2026-08-05 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:48:00', 'Present'),

  -- -------------------------------------------------------------
  -- Employee 7: David Miller (QA) - Present & Late
  -- -------------------------------------------------------------
  (7, 1, '2026-08-03', 1, '2026-08-03 09:00:00', '2026-08-03 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present'),
  (7, 1, '2026-08-04', 1, '2026-08-04 09:35:00', '2026-08-04 17:20:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '07:45:00', 'Present'),
  (7, 1, '2026-08-05', 1, '2026-08-05 09:00:00', '2026-08-05 17:00:00', 12.9716, 77.5946, TRUE, 12.9716, 77.5946, TRUE, '08:00:00', 'Present');
