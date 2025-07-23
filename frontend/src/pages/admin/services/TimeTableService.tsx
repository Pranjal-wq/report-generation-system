// filepath: d:\\att\\Frontend-ReportGeneration\\src\\pages\\admin\\services\\TimeTableService.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react"; // Added useCallback, useMemo
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  SelectChangeEvent, // Added for type safety
  IconButton, // Added
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'; // Added
import VisibilityIcon from '@mui/icons-material/Visibility'; // Added for view action
import useFacultyData from "./faculty/facultyHooks"; // Assuming this hook can be reused
import { FacultyUser } from "../../../api/services/faculty/Faculty.types"; // Assuming this type can be reused
import FacultyTimetableDialog from "./timetable/FacultyTimetableDialog"; // Existing view dialog
import EditTimetableDialog from "./timetable/EditTimetableDialog"; // New Edit Dialog
import { updateTimetable, getTimetable } from "../../../api/services/Admin/Timetable";
import { WeeklyTimetable, TimetableEntry } from "../../../api/services/Admin/Timetable.types";
import { useSubjects } from "../../../context/SubjectContext"; // Added

// Simplified FacultyTable component (ideally, this would be imported)
interface FacultyTableProps {
  faculties: FacultyUser[];
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewTimetable: (faculty: FacultyUser) => void;
  onEditTimetable: (faculty: FacultyUser) => void; // Added for editing
}

const SimplifiedFacultyTable: React.FC<FacultyTableProps> = React.memo(({ // Wrapped with React.memo
  faculties,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  onViewTimetable,
  onEditTimetable, // Added
}) => {
  return (
    <Paper>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%' }}>Name</TableCell>
              <TableCell sx={{ width: '30%' }}>Email</TableCell>
              <TableCell sx={{ width: '20%' }}>Department</TableCell>
              <TableCell sx={{ width: '15%' }}>Employee Code</TableCell>
              <TableCell sx={{ width: '10%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty._id}>
                <TableCell>{faculty.name}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{faculty.email}</TableCell>
                <TableCell>{faculty.department}</TableCell>
                <TableCell>{faculty.empCode || faculty.employeeCode}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      onClick={() => onViewTimetable(faculty)} 
                      size="small" 
                      aria-label="view timetable" 
                      color="primary"
                      title="View Timetable"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => onEditTimetable(faculty)} 
                      size="small" 
                      aria-label="edit timetable" 
                      color="secondary"
                      title="Edit Timetable"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
});

// Simplified FacultyFilterBar component (ideally, this would be imported)
interface FacultyFilterBarProps {
  searchTerm: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  departmentFilter: string;
  onDepartmentChange: (event: SelectChangeEvent<string>) => void;
  departments: Array<{ _id: string; name: string }>; // Updated type for departments

}

const SimplifiedFacultyFilterBar: React.FC<FacultyFilterBarProps> = React.memo(({ // Wrapped with React.memo
  searchTerm,
  onSearch,
  departmentFilter,
  onDepartmentChange,
  departments,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Faculty"
              variant="outlined"
              value={searchTerm}
              onChange={onSearch}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Filter by Department"
              value={departmentFilter}
              onChange={onDepartmentChange as any} // Added 'as any' to bypass type checking for now, consider a proper fix
              variant="outlined"
              sx={{ width: '300px' }} // Added fixed width
            >
              <MenuItem value="">
                <em>All Departments</em>
              </MenuItem>
              {(departments || []).map((dept) => { // Simpler mapping
                return (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept._id} {/* Changed from dept.name to dept._id based on FacultyFilterBar.tsx reference */}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});


const TimeTableService: React.FC = () => {
  const {
    faculties,
    departments,
    // filteredFaculties, // This will be replaced by memoized version
    // setFilteredFaculties, // Removed as filteredFaculties is now locally memoized
    // subjects, // This will be replaced by context subjects for the dialog
    // fetchFaculty,
  } = useFacultyData();
  const { departmentWiseSubjects, loading: subjectsLoading, error: subjectsError } = useSubjects(); // Added

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for View Dialog
  const [selectedFacultyForView, setSelectedFacultyForView] = useState<FacultyUser | null>(null); 
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); 

  // State for Edit Dialog
  const [selectedFacultyForEdit, setSelectedFacultyForEdit] = useState<FacultyUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [isUpdatingTimetable, setIsUpdatingTimetable] = useState(false); // For loading state during update

  // Determine subjects to pass to the EditTimetableDialog based on the department filter
  const subjectsForDialog = useMemo(() => { // Changed to useMemo
    if (departmentFilter && departmentWiseSubjects) {
      const selectedDeptEntry = departmentWiseSubjects.find(dept => dept._id === departmentFilter);
      return selectedDeptEntry ? selectedDeptEntry.subjects : [];
    }
    return []; // If no department filter, pass empty array
  }, [departmentFilter, departmentWiseSubjects]);

  // Filtering logic
  const filteredFaculties = useMemo(() => {
    if (!departmentFilter) { // If no department is selected, return an empty array
      return [];
    }
    let result = faculties.filter(faculty => faculty.department === departmentFilter);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(searchLower) ||
          faculty.email.toLowerCase().includes(searchLower) ||
          (faculty.empCode || faculty.employeeCode || "").toLowerCase().includes(searchLower)
      );
    }
    return result;
  }, [searchTerm, departmentFilter, faculties]);

  useEffect(() => {
    setPage(0); // Reset page when filters change
  }, [searchTerm, departmentFilter]);


  // Pagination handlers
  const handleChangePage = useCallback((_event: unknown, newPage: number) => { // Wrapped with useCallback
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { // Wrapped with useCallback
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Search and filter handlers
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { // Wrapped with useCallback
    setSearchTerm(event.target.value);
  }, []);

  const handleDepartmentFilter = useCallback((event: SelectChangeEvent<string>) => { // Wrapped with useCallback
    setDepartmentFilter(event.target.value);
  }, []);

  const handleOpenTimetableDialog = useCallback((faculty: FacultyUser) => {
    setSelectedFacultyForView(faculty);
    setIsViewDialogOpen(true);
  }, []);

  const handleCloseTimetableDialog = useCallback(() => {
    setSelectedFacultyForView(null);
    setIsViewDialogOpen(false);
  }, []);

  const handleOpenEditDialog = useCallback((faculty: FacultyUser) => {
    setSelectedFacultyForEdit(faculty);
    setIsEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setSelectedFacultyForEdit(null);
    setIsEditDialogOpen(false);
  }, []);

  const handleUpdateTimetableInDialog = useCallback(async (facultyId: string, timetableData: WeeklyTimetable) => { // Wrapped with useCallback
    if (!facultyId || !timetableData) {
      console.error("Faculty ID and timetable data are required for update.");
      // Consider user feedback here, e.g., using a snackbar
      return;
    }

    setIsUpdatingTimetable(true);
    try {
      const response = await updateTimetable(facultyId, timetableData);

      if (response.status === 'success') {
        console.log('Timetable updated successfully:', response.data);
        // Show success message (e.g., snackbar)
        // For now, an alert:
        // alert('Timetable updated successfully!');
        handleCloseTimetableDialog(); // Close the view dialog if it was the source
        handleCloseEditDialog(); // Close the edit dialog if it was the source
      } else {
        console.error('Failed to update timetable:', response.message);
        // Show error message (e.g., snackbar)
        // alert(`Error updating timetable: ${response.message}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred during timetable update:', error);
      // Show generic error message (e.g., snackbar)
      // alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsUpdatingTimetable(false);
    }
  }, [handleCloseEditDialog, handleCloseTimetableDialog]); // Added dependencies

  const paginatedFaculties = useMemo(() => { // Memoized paginatedFaculties
    return filteredFaculties.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredFaculties, page, rowsPerPage]);

  // Display loading or error state for subjects from context if needed
  if (subjectsLoading) {
    // return <Typography>Loading subjects...</Typography>; // Or some loading spinner
  }
  if (subjectsError) {
    // return <Typography>Error loading subjects: {subjectsError.message}</Typography>;
  }

  return (
    <Box p={3} sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <Typography variant="h5" mb={3} fontWeight="bold">Faculty Timetables</Typography>
      
      {departmentFilter ? (
        // Layout when a department IS selected
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SimplifiedFacultyFilterBar
              searchTerm={searchTerm}
              onSearch={handleSearch}
              departmentFilter={departmentFilter}
              onDepartmentChange={handleDepartmentFilter}
              departments={departments as Array<{ _id: string; name: string }>}
            />
          </Grid>
          <Grid item xs={12}>
            <SimplifiedFacultyTable
              faculties={paginatedFaculties}
              page={page}
              rowsPerPage={rowsPerPage}
              count={filteredFaculties.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              onViewTimetable={handleOpenTimetableDialog}
              onEditTimetable={handleOpenEditDialog} // Added
            />
          </Grid>
        </Grid>
      ) : (
        // Layout when NO department is selected
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}> {/* Removed alignItems: 'center' */}
          <Box sx={{ width: '100%', maxWidth: 700 /* Constrain filter bar width */ }}>
            <SimplifiedFacultyFilterBar
              searchTerm={searchTerm}
              onSearch={handleSearch}
              departmentFilter={departmentFilter} // Will be empty
              onDepartmentChange={handleDepartmentFilter}
              departments={departments as Array<{ _id: string; name: string }>}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}> {/* Added Box to center Paper */}
            <Paper sx={{ p: 3, textAlign: 'center', width: 'fit-content' }}>
              <Typography variant="body1" color="textSecondary">
                Please select a department to view and manage faculty timetables.
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}

      {/* View Timetable Dialog - Ensure props are correctly passed */}
      {selectedFacultyForView && isViewDialogOpen && ( // Conditional rendering based on state
        <FacultyTimetableDialog
          open={isViewDialogOpen}
          onClose={handleCloseTimetableDialog}
          faculty={selectedFacultyForView}
          // onSave={handleUpdateTimetableInDialog} // Assuming onSave is for the dialog's internal save, not direct update
          // isSaving={isUpdatingTimetable} // Pass loading state if dialog handles it
          // subjects={subjectsForDialog} // Pass subjects if needed by view dialog
        />
      )}

      {/* Edit Timetable Dialog - Ensure props are correctly passed */}
      {selectedFacultyForEdit && isEditDialogOpen && ( // Conditional rendering based on state
        <EditTimetableDialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          faculty={selectedFacultyForEdit}
          onSave={handleUpdateTimetableInDialog} // Changed from onUpdateTimetable to onSave to match FacultyTimetableDialog pattern
          isSaving={isUpdatingTimetable} // Pass loading state
          departmentSpecificSubjects={subjectsForDialog}
        />
      )}
    </Box>
  );
};

export default TimeTableService;
