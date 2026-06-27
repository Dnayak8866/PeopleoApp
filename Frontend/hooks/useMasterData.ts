import { useMasterDataContext } from '../context/MasterDataContext';

export const useMasterData = () => {
  const ctx = useMasterDataContext();
  return {
    ...ctx,
    isLoading: ctx.loading,
    hasError: !!ctx.error,
    fetchAll: ctx.fetchHomePageDetails,
  };
};

export const useRoles = () => {
  const ctx = useMasterDataContext();
  return {
    roles: ctx.roles,
    isLoading: ctx.loading,
    error: ctx.error,
    fetch: ctx.fetchHomePageDetails,
    reset: ctx.resetAll,
  };
};

export const useDesignations = () => {
  const ctx = useMasterDataContext();
  return {
    designations: ctx.designations,
    isLoading: ctx.loading,
    error: ctx.error,
    fetch: ctx.fetchHomePageDetails,
    reset: ctx.resetAll,
  };
};

export const useDepartments = () => {
  const ctx = useMasterDataContext();
  return {
    departments: ctx.departments,
    isLoading: ctx.loading,
    error: ctx.error,
    fetch: ctx.fetchHomePageDetails,
    reset: ctx.resetAll,
  };
};

export const useLeaveTypes = () => {
  const ctx = useMasterDataContext();
  return {
    leaveTypes: ctx.leaveTypes,
    isLoading: ctx.loading,
    error: ctx.error,
    fetch: ctx.fetchHomePageDetails,
    reset: ctx.resetAll,
  };
};

export const useShiftTimings = () => {
  const ctx = useMasterDataContext();
  return {
    shiftTimings: ctx.shiftTimings,
    isLoading: ctx.loading,
    error: ctx.error,
    fetch: ctx.fetchHomePageDetails,
    reset: ctx.resetAll,
  };
};
