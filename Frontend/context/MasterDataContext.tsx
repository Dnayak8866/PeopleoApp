import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import {
  Role,
  Designation,
  Department,
  LeaveType,
  ShiftTiming,
} from '../services/types/masterData.types';
import {
  getRoles,
  getDesignations,
  getDepartments,
  getLeaveTypes,
  getShiftTimings,
} from '../services/api/masterData';

type MasterDataContextValue = {
  // data
  roles: Role[];
  designations: Designation[];
  departments: Department[];
  leaveTypes: LeaveType[];
  shiftTimings: ShiftTiming[];

  // loading
  loadingRoles: boolean;
  loadingDesignations: boolean;
  loadingDepartments: boolean;
  loadingLeaveTypes: boolean;
  loadingShiftTimings: boolean;

  // errors
  rolesError: string | null;
  designationsError: string | null;
  departmentsError: string | null;
  leaveTypesError: string | null;
  shiftTimingsError: string | null;

  // actions
  fetchRoles: (companyId: number) => Promise<void>;
  fetchDesignations: (companyId: number) => Promise<void>;
  fetchDepartments: (companyId: number) => Promise<void>;
  fetchLeaveTypes: (companyId: number) => Promise<void>;
  fetchShiftTimings: (companyId: number) => Promise<void>;
  fetchAll: (companyId: number) => Promise<void>;
  resetAll: () => void;
};

const MasterDataContext = createContext<MasterDataContextValue | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data
  const [roles, setRoles] = useState<Role[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [shiftTimings, setShiftTimings] = useState<ShiftTiming[]>([]);

  // Loading
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [loadingShiftTimings, setLoadingShiftTimings] = useState(false);

  // Errors
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [designationsError, setDesignationsError] = useState<string | null>(null);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [leaveTypesError, setLeaveTypesError] = useState<string | null>(null);
  const [shiftTimingsError, setShiftTimingsError] = useState<string | null>(null);

  // Fetchers
  const fetchRolesHandler = useCallback(async (companyId: number) => {
    setLoadingRoles(true);
    setRolesError(null);
    try {
      const data = await getRoles(companyId);
      setRoles(data || []);
    } catch (err: any) {
      setRolesError(err?.message || 'Failed to fetch roles');
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  const fetchDesignationsHandler = useCallback(async (companyId: number) => {
    setLoadingDesignations(true);
    setDesignationsError(null);
    try {
      const data = await getDesignations(companyId);
      setDesignations(data || []);
    } catch (err: any) {
      setDesignationsError(err?.message || 'Failed to fetch designations');
    } finally {
      setLoadingDesignations(false);
    }
  }, []);

  const fetchDepartmentsHandler = useCallback(async (companyId: number) => {
    setLoadingDepartments(true);
    setDepartmentsError(null);
    try {
      const data = await getDepartments(companyId);
      setDepartments(data || []);
    } catch (err: any) {
      setDepartmentsError(err?.message || 'Failed to fetch departments');
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  const fetchLeaveTypesHandler = useCallback(async (companyId: number) => {
    setLoadingLeaveTypes(true);
    setLeaveTypesError(null);
    try {
      const data = await getLeaveTypes(companyId);
      setLeaveTypes(data || []);
    } catch (err: any) {
      setLeaveTypesError(err?.message || 'Failed to fetch leave types');
    } finally {
      setLoadingLeaveTypes(false);
    }
  }, []);

  const fetchShiftTimingsHandler = useCallback(async (companyId: number) => {
    setLoadingShiftTimings(true);
    setShiftTimingsError(null);
    try {
      const data = await getShiftTimings(companyId);
      setShiftTimings(data || []);
    } catch (err: any) {
      setShiftTimingsError(err?.message || 'Failed to fetch shift timings');
    } finally {
      setLoadingShiftTimings(false);
    }
  }, []);

  const fetchAll = useCallback(async (companyId: number) => {
    // Kick off parallel fetches and update each state
    setLoadingRoles(true);
    setLoadingDesignations(true);
    setLoadingDepartments(true);
    setLoadingLeaveTypes(true);
    setLoadingShiftTimings(true);

    setRolesError(null);
    setDesignationsError(null);
    setDepartmentsError(null);
    setLeaveTypesError(null);
    setShiftTimingsError(null);

    try {
      const [r, d, dept, lt, st] = await Promise.all([
        getRoles(companyId),
        getDesignations(companyId),
        getDepartments(companyId),
        getLeaveTypes(companyId),
        getShiftTimings(companyId),
      ]);
      setRoles(r || []);
      setDesignations(d || []);
      setDepartments(dept || []);
      setLeaveTypes(lt || []);
      setShiftTimings(st || []);
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch master data';
      setRolesError(msg);
      setDesignationsError(msg);
      setDepartmentsError(msg);
      setLeaveTypesError(msg);
      setShiftTimingsError(msg);
    } finally {
      setLoadingRoles(false);
      setLoadingDesignations(false);
      setLoadingDepartments(false);
      setLoadingLeaveTypes(false);
      setLoadingShiftTimings(false);
    }
  }, []);

  const resetAll = useCallback(() => {
    setRoles([]);
    setDesignations([]);
    setDepartments([]);
    setLeaveTypes([]);
    setShiftTimings([]);

    setRolesError(null);
    setDesignationsError(null);
    setDepartmentsError(null);
    setLeaveTypesError(null);
    setShiftTimingsError(null);

    setLoadingRoles(false);
    setLoadingDesignations(false);
    setLoadingDepartments(false);
    setLoadingLeaveTypes(false);
    setLoadingShiftTimings(false);
  }, []);

  const value = useMemo(
    () => ({
      roles,
      designations,
      departments,
      leaveTypes,
      shiftTimings,
      loadingRoles,
      loadingDesignations,
      loadingDepartments,
      loadingLeaveTypes,
      loadingShiftTimings,
      rolesError,
      designationsError,
      departmentsError,
      leaveTypesError,
      shiftTimingsError,
      fetchRoles: fetchRolesHandler,
      fetchDesignations: fetchDesignationsHandler,
      fetchDepartments: fetchDepartmentsHandler,
      fetchLeaveTypes: fetchLeaveTypesHandler,
      fetchShiftTimings: fetchShiftTimingsHandler,
      fetchAll,
      resetAll,
    }),
    [
      roles,
      designations,
      departments,
      leaveTypes,
      shiftTimings,
      loadingRoles,
      loadingDesignations,
      loadingDepartments,
      loadingLeaveTypes,
      loadingShiftTimings,
      rolesError,
      designationsError,
      departmentsError,
      leaveTypesError,
      shiftTimingsError,
      fetchRolesHandler,
      fetchDesignationsHandler,
      fetchDepartmentsHandler,
      fetchLeaveTypesHandler,
      fetchShiftTimingsHandler,
      fetchAll,
      resetAll,
    ]
  );

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
};

export const useMasterDataContext = (): MasterDataContextValue => {
  const ctx = useContext(MasterDataContext);
  if (!ctx) {
    throw new Error('useMasterDataContext must be used within a MasterDataProvider');
  }
  return ctx;
};
