export type EmployeeRole = 'tester' | 'leader' | 'admin';
export type EmployeeStatus = 'activo' | 'temporal' | 'bloqueado';

export interface Employee {
    id: number;
    name: string;
    email: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    mustChangePassword?: boolean;
}
