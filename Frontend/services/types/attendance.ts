export interface PunchInData {
  employee_id: number;
  attendance_date: Date;
  punch_in_latitude?: number;
  punch_in_longitude?: number;
  is_punch_in_from_office?: boolean;
  shift_id?: number;
}

export interface PunchOutData {
  employee_id: number;
  attendance_date: Date;
  punch_out_latitude?: number;
  punch_out_longitude?: number;
  is_punch_out_from_office?: boolean;
}

export interface DailySummary {
  date: string;
  totalEmployees: number;
  present: number;
  absent: number;
  onLeave: number;
  lateCheckIns: number;
  avgWorkingHours: number;
}

export interface AttendanceEmployee {
  id: number;
  name: string;
  designation: string;
  avatar: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  entryTime: string | null;
  exitTime: string | null;
  duration: string;
}
