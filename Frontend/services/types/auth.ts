interface LoginRequest {
    phone: string;
    password: string;
}

interface UserDetails {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    roleId: number;
    departmentId: number;
    designationId: number;
    employeeCode: string;
    companyId: number;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDetails;
    companyId: number;
}

interface CompanyDetails {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
    address: string;
}

interface MasterData {
    roles: any[];
    departments: any[];
    designations: any[];
    leaveTypes: any[];
    shiftTimings: any[];
}

interface HomePageDetails {
    user: UserDetails;
    company: CompanyDetails;
    masterData: MasterData;
}

export { LoginRequest, LoginResponse, UserDetails, CompanyDetails, MasterData, HomePageDetails };