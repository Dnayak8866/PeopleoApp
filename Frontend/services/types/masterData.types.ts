export interface Role {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Designation {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  daysAllowed?: number;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftTiming {
  id: number;
  name: string;
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
  description?: string;
  companyId: number;
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
