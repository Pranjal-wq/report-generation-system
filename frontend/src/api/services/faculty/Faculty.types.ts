export interface FacultyUser {
  _id?: string;
  name: string;
  password: string;
  about?: string;
  empCode: string;
  employeeCode?: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  abbreviation: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateFacultyData = Array<{
  name: string;
  empCode: string;
  abbreviation: string;
  department: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}>;

export interface FacultyFilter {
  department?: string;
  name?: string;
  employeeCode?: string;
  role?: string;
}

export interface UpdateFacultyPayload {
  id: string;
  toModify: Partial<{
    name: string;
    empCode: string;
    abbreviation: string;
    department: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    about: string;
  }>;
}