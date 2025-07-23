import { FacultyUser,CreateFacultyData } from "../../../../api/services/faculty/Faculty.types";

export function checkFacultyDuplicates(arr: any[], existing: FacultyUser[]) {
  const errors: string[] = [];
  const preview: CreateFacultyData = [];
  arr.forEach((item, idx) => {
    const found = existing.find(f =>
      f.empCode === item.empCode ||
      f.email === item.email ||
      f.abbreviation === item.abbreviation
    );
    if (found) {
      errors.push(`Row ${idx + 1}: Duplicate found for empCode/email/abbreviation`);
    } else {
      preview.push({
        name: item.name || "",
        empCode: item.empCode || "",
        abbreviation: item.abbreviation || "",
        department: item.department || "",
        email: item.email || "",
        phone: item.phone || "",
        password: item.password || "",
        role: item.role || "faculty"
      });
    }
  });
  return { errors, preview };
}
