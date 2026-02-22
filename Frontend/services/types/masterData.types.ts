export interface Role {
  id: number;
  roleName: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Designation {
  designation_id: number;
  name: string;
  description?: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  department_id: number;
  name: string;
  description?: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveType {
  leave_type_id: number;
  type_name: string;
  description?: string;
  leave_balance: number;
  company_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftTiming {
  shift_id: number;
  shift_name: string;
  from_time: string; // e.g. "09:00:00"
  to_time: string; // e.g. "17:00:00"
  is_night_shift: boolean;
  company_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MasterDataPayloads {
  roles: Role[];
  designations: Designation[];
  departments: Department[];
  leaveTypes: LeaveType[];
  shiftTimings: ShiftTiming[];
}
