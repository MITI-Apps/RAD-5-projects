export enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER"
};
export interface User {
    id: string,
    name: string,
    role: UserRole,
    gpa?: number
};