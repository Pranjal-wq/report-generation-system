// Types for Timetable API

export interface Subject {
  _id: string; // Subject's ObjectId
  subjectCode: string;
  subjectName: string;
  department: string; // Department code or ID
  isElective: boolean;
  // Add any other relevant subject fields if needed
}

export interface TimetableSlot {
  subject: Subject | null; // Can be null if no subject is assigned yet
  section: string;
  session: string; // Represents the period or timing, e.g., "1", "2", "9:00-10:00"
  semester: string | number;
  branch: string;
  course: string;
  timing?: string; // Optional: specific time like "09:00-10:00" if different from session
  location?: string; // Optional: classroom or location
  // Add any other fields that are part of a timetable slot in your backend
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface WeeklyTimetable {
  [key: string]: TimetableSlot[]; // Allow string keys for days like "1", "2" or "Monday", "Tuesday"
}

export interface TimetableDocument {
  _id: string;
  ownerId: string;
  TimeTable: WeeklyTimetable;
  assignedToMe: WeeklyTimetable;
  meAssignedToOther: WeeklyTimetable;  request: unknown[];
  meRequestedOther: unknown[];
}

// API Request/Response Types
export interface GetTimetableRequest {
  ownerId: string;
}

export interface GetTimetableResponse {
  status: "success" | "error";
  message: string;
  data?: {
    ownerId: string;
    timetable: WeeklyTimetable;
  };
}

export interface UpdateTimetableRequest {
  ownerId: string;
  timetable: WeeklyTimetable;
}

export interface UpdateTimetableResponse {
  status: "success" | "error";
  message: string;
  data?: TimetableDocument;
}

// Request and response types for deleting a subject from timetable
export interface DeleteSubjectRequest {
  ownerId: string;
  day: string;
  subjectId: string;
}

export interface DeleteSubjectResponse {
  status: "success" | "error";
  message: string;
  data?: {
    ownerId: string;
    timetable: WeeklyTimetable;
  };
}

// Error Response Type
export interface TimetableErrorResponse {
  status: "error";
  message: string;
}

// Day mapping for display purposes
export type DayNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7";

export interface DayMapping {
  [key: string]: string;
}

export const DAY_NAMES: DayMapping = {
  "1": "Monday",
  "2": "Tuesday", 
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "7": "Sunday"
};