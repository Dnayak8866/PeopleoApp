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
INSERT INTO leave_types (company_id, type_name, description)
VALUES 
  (1, 'Casual Leave', 'Casual leave for personal matters'),
  (1, 'Sick Leave', 'Leave for medical issues'),
  (1, 'Earned Leave', 'Annual earned leave'),
  (1, 'Maternity Leave', 'Leave for maternity support');

-- Insert holidays
INSERT INTO holidays (company_id, holiday_date, name, is_optional)
VALUES 
  (1, '2025-01-01', 'New Year\'s Day', FALSE),
  (1, '2025-01-26', 'Republic Day', FALSE),
  (1, '2025-08-15', 'Independence Day', FALSE),
  (1, '2025-10-02', 'Gandhi Jayanti', TRUE),
  (1, '2025-12-25', 'Christmas', FALSE);
