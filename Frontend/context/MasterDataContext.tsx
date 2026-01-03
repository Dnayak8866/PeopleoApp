import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import {
  Role,
  Designation,
  Department,
  LeaveType,
  ShiftTiming,
} from '../services/types/masterData.types';
import { getHomePageDetails, HomePageDetails, CompanyDetails } from '../services/api/home';

type MasterDataContextValue = {
  roles: Role[];
  designations: Designation[];
  departments: Department[];
  leaveTypes: LeaveType[];
  shiftTimings: ShiftTiming[];
  companyDetails: CompanyDetails | null;

  loading: boolean;
  error: string | null;
  fetchHomePageDetails: (userId: number, companyId: number) => Promise<HomePageDetails | null>;
  resetAll: () => void;
};

const MasterDataContext = createContext<MasterDataContextValue | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [shiftTimings, setShiftTimings] = useState<ShiftTiming[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomePageDetailsHandler = useCallback(async (userId: number, companyId: number): Promise<HomePageDetails | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHomePageDetails(userId, companyId);

      setCompanyDetails(data.company);
      setRoles(data.masterData.roles || []);
      setDesignations(data.masterData.designations || []);
      setDepartments(data.masterData.departments || []);
      setLeaveTypes(data.masterData.leaveTypes || []);
      setShiftTimings(data.masterData.shiftTimings || []);

      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch home page details';
      setError(errorMessage);
      console.error('Failed to fetch home page details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetAll = useCallback(() => {
    setRoles([]);
    setDesignations([]);
    setDepartments([]);
    setLeaveTypes([]);
    setShiftTimings([]);
    setCompanyDetails(null);
    setError(null);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      roles,
      designations,
      departments,
      leaveTypes,
      shiftTimings,
      companyDetails,
      loading,
      error,
      fetchHomePageDetails: fetchHomePageDetailsHandler,
      resetAll,
    }),
    [
      roles,
      designations,
      departments,
      leaveTypes,
      shiftTimings,
      companyDetails,
      loading,
      error,
      fetchHomePageDetailsHandler,
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
