import { useEffect } from 'react';
import { useMasterDataContext } from '../context/MasterDataContext';

export const useMasterData = (companyId: number) => {
  const ctx = useMasterDataContext();

  useEffect(() => {
    // If nothing is loaded, fetch all. Caller can also call fetchAll manually.
    if (
      ctx.roles.length === 0 &&
      ctx.designations.length === 0 &&
      ctx.departments.length === 0 &&
      ctx.leaveTypes.length === 0 &&
      ctx.shiftTimings.length === 0
    ) {
      ctx.fetchAll(companyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const isLoading =
    ctx.loadingRoles ||
    ctx.loadingDesignations ||
    ctx.loadingDepartments ||
    ctx.loadingLeaveTypes ||
    ctx.loadingShiftTimings;

  const hasError =
    !!ctx.rolesError ||
    !!ctx.designationsError ||
    !!ctx.departmentsError ||
    !!ctx.leaveTypesError ||
    !!ctx.shiftTimingsError;

  return {
    roles: ctx.roles,
    designations: ctx.designations,
    departments: ctx.departments,
    leaveTypes: ctx.leaveTypes,
    shiftTimings: ctx.shiftTimings,
    isLoading,
    hasError,
    errors: {
      rolesError: ctx.rolesError,
      designationsError: ctx.designationsError,
      departmentsError: ctx.departmentsError,
      leaveTypesError: ctx.leaveTypesError,
      shiftTimingsError: ctx.shiftTimingsError,
    },
    // actions
    fetchAll: ctx.fetchAll,
    resetAll: ctx.resetAll,
  };
};

export const useRoles = () => {
  const ctx = useMasterDataContext();
  return {
    roles: ctx.roles,
    isLoading: ctx.loadingRoles,
    error: ctx.rolesError,
    fetch: ctx.fetchRoles,
    reset: ctx.resetAll,
  };
};

export const useDesignations = () => {
  const ctx = useMasterDataContext();
  return {
    designations: ctx.designations,
    isLoading: ctx.loadingDesignations,
    error: ctx.designationsError,
    fetch: ctx.fetchDesignations,
    reset: ctx.resetAll,
  };
};

export const useDepartments = () => {
  const ctx = useMasterDataContext();
  return {
    departments: ctx.departments,
    isLoading: ctx.loadingDepartments,
    error: ctx.departmentsError,
    fetch: ctx.fetchDepartments,
    reset: ctx.resetAll,
  };
};

export const useLeaveTypes = () => {
  const ctx = useMasterDataContext();
  return {
    leaveTypes: ctx.leaveTypes,
    isLoading: ctx.loadingLeaveTypes,
    error: ctx.leaveTypesError,
    fetch: ctx.fetchLeaveTypes,
    reset: ctx.resetAll,
  };
};

export const useShiftTimings = () => {
  const ctx = useMasterDataContext();
  return {
    shiftTimings: ctx.shiftTimings,
    isLoading: ctx.loadingShiftTimings,
    error: ctx.shiftTimingsError,
    fetch: ctx.fetchShiftTimings,
    reset: ctx.resetAll,
  };
};
