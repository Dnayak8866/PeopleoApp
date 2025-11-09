-- Insert one company
INSERT INTO companies (name, email, contact_number, address)
VALUES ('TechNova Solutions', 'info@technova.com', '9876543210', '123 Tech Park, Silicon Valley, CA');

-- Insert roles
INSERT INTO roles (role_name) VALUES ('Admin'), ('Employee');

-- Insert departments
INSERT INTO departments (name, company_id)
VALUES 
  ('Engineering', 1),
  ('Human Resources', 1),
  ('Sales', 1),
  ('Marketing', 1);

-- Insert designations
INSERT INTO designations (name, company_id)
VALUES 
  ('Software Engineer', 1),
  ('HR Manager', 1),
  ('Sales Executive', 1),
  ('Marketing Specialist', 1),
  ('Product Manager', 1);

-- Insert shift timings
INSERT INTO shift_timings (company_id, shift_name, from_time, to_time, is_night_shift)
VALUES 
  (1, 'Morning Shift', '09:00:00', '17:00:00', FALSE),
  (1, 'Evening Shift', '13:00:00', '21:00:00', FALSE),
  (1, 'Night Shift', '22:00:00', '06:00:00', TRUE);

-- Insert leave types
INSERT INTO leave_types (company_id, type_name, description, leave_balance)
VALUES 
  (1, 'Casual Leave', 'Casual leave for personal matters', 7),
  (1, 'Sick Leave', 'Leave for medical issues', 5),
  (1, 'Earned Leave', 'Annual earned leave', 10),
  (1, 'Maternity Leave', 'Leave for maternity support', 90);

-- Insert holidays
INSERT INTO holidays (company_id, holiday_date, name, is_optional)
VALUES 
  (1, '2025-01-01', 'New Year''s Day', FALSE),
  (1, '2025-01-26', 'Republic Day', FALSE),
  (1, '2025-05-01', 'Maharashtra Day', FALSE),
  (1, '2025-08-15', 'Independence Day', FALSE),
  (1, '2025-10-02', 'Gandhi Jayanti', TRUE),
  (1, '2025-12-25', 'Christmas', FALSE);

--admin employee
INSERT INTO employees (
    company_id,
    role_id,
    department_id,
    designation_id,
    full_name,
    email,
    phone_number,
	password,
    employee_code,
    joining_date,
    is_active,
    created_at
) VALUES (
    1,                               -- company_id
    1,                               -- role_id
    1,                               -- department_id
    2,                               -- designation_id
    'John Doe',                      -- full_name
    'john.doe@example.com',          -- email
    '+91-9876543210',                -- phone_number
	123456789,						 -- password
    'EMP001',                        -- employee_code
    '2024-05-10',                    -- joining_date
    TRUE,                            -- is_active
    NOW()                            -- created_at
);

-- Sample leave application for employee 1 (May 10-12, 2025)
INSERT INTO leave_applications (employee_id, leave_type_id, from_date, to_date, reason, status, applied_at)
VALUES (1, 1, '2025-05-10', '2025-05-12', 'Family function', 'Approved', NOW());

-- Sample attendance for employee 1 for May 2025
-- We'll mark many days present, some on leave (10-12), and leave May 26 as absent; May 1 is assumed not a holiday here
INSERT INTO attendance (employee_id, punch_in, punch_out, punch_in_latitude, punch_in_longitude, punch_out_latitude, punch_out_longitude, shift_id, attendance_date, working_hours, status)
VALUES
  -- Week 1
  
  (1, '2025-05-02 09:00:00', '2025-05-02 17:10:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-02', '08:10:00', 'Present'),
  (1, '2025-05-05 09:05:00', '2025-05-05 17:00:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-05', '07:55:00', 'Present'),

  -- Week 2
  (1, '2025-05-06 09:04:00', '2025-05-06 17:08:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-06', '08:04:00', 'Present'),
  (1, '2025-05-07 09:00:00', '2025-05-07 16:55:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-07', '07:55:00', 'Present'),
  (1, '2025-05-08 09:10:00', '2025-05-08 17:15:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-08', '08:05:00', 'Present'),

  -- On leave 10-12 (leave application covers these days) -> omit attendance rows (service will mark On Leave)

  -- Week 3
  (1, '2025-05-13 09:03:00', '2025-05-13 17:07:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-13', '08:04:00', 'Present'),
  (1, '2025-05-14 09:00:00', '2025-05-14 17:00:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-14', '08:00:00', 'Present'),

  -- Week 4
  (1, '2025-05-19 09:06:00', '2025-05-19 17:09:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-19', '08:03:00', 'Present'),
  (1, '2025-05-20 09:02:00', '2025-05-20 17:00:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-20', '07:58:00', 'Present'),

  -- Absent on May 26 (no attendance row) ; we'll not insert a row so service will mark Absent

  -- More present days
  (1, '2025-05-27 09:01:00', '2025-05-27 17:02:00', 12.9716, 77.5946, 12.9717, 77.5947, 1, '2025-05-27', '08:01:00', 'Present');

