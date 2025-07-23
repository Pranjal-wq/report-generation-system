
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import FacultyForm from "./faculty/FacultyForm";
import FacultyBulkDialog from "./faculty/FacultyBulkDialog";
import FacultyTable from "./faculty/FacultyTable";
import FacultyFilterBar from "./faculty/FacultyFilterBar";
import useFacultyData from "./faculty/facultyHooks";
import { createFaculties, updateFacultyById } from "../../../api/services/Admin/admin";
import { toast } from "react-toastify";
import { CreateFacultyData, UpdateFacultyPayload, FacultyUser } from "../../../api/services/faculty/Faculty.types";

const defaultFaculty = {
  empCode: "",
  abbreviation: "",
  department: "",
  email: "",
  phone: "",
  password: "",
  name: "",
  role: "faculty"
} as CreateFacultyData[0];

const FacultyService: React.FC = () => {
  const {
    faculties,
    departments,
    filteredFaculties,
    setFilteredFaculties,
    fetchFaculty,
    fetchDepartments
  } = useFacultyData();

  const [form, setForm] = useState<CreateFacultyData[0]>(defaultFaculty);
  const [editDialog, setEditDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [bulkDialog, setBulkDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtering logic
  React.useEffect(() => {
    let result = faculties;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(searchLower) ||
          faculty.email.toLowerCase().includes(searchLower) ||
          (faculty.empCode || faculty.employeeCode || '').toLowerCase().includes(searchLower)
      );
    }
    if (departmentFilter) {
      result = result.filter(faculty => faculty.department === departmentFilter);
    }
    setFilteredFaculties(result);
    setPage(0);
  }, [searchTerm, departmentFilter, faculties, setFilteredFaculties]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreate = async () => {
    try {
      await createFaculties([form]);
      toast.success("Faculty created");
      setForm(defaultFaculty);
      fetchFaculty();
    } catch (error) {
      toast.error("Failed to create faculty");
    }
  };

  const handleEdit = (faculty: FacultyUser) => {
    setEditId(faculty._id || null);
    setForm({
      name: faculty.name,
      empCode: faculty.empCode || faculty.employeeCode || '',
      abbreviation: faculty.abbreviation,
      department: faculty.department,
      email: faculty.email,
      phone: faculty.phone,
      password: '',
      role: faculty.role
    });
    setEditDialog(true);
  };
  const handleUpdate = async () => {
    try {
      if (!editId) return;
      const updateData: UpdateFacultyPayload["toModify"] = {
        ...form,
        ...(form.password ? { password: form.password } : {})
      };
      await updateFacultyById(editId, updateData);
      toast.success("Faculty updated");
      setEditDialog(false);
      setForm(defaultFaculty);
      fetchFaculty();
    } catch (error) {
      toast.error("Failed to update faculty");
    }
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Bulk dialog submit
  const handleBulkSubmit = async (bulkData: CreateFacultyData) => {
    try {
      await createFaculties(bulkData);
      toast.success("Bulk faculty created");
      fetchFaculty();
    } catch {
      toast.error("Bulk creation failed");
    }
  };

  // Search and filter handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleDepartmentFilter = (event: any) => {
    setDepartmentFilter(event.target.value);
  };

  // Get current page data
  const paginatedFaculties = filteredFaculties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3} sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <Typography variant="h5" mb={3} fontWeight="bold">Faculty Management</Typography>
      <Button variant="outlined" onClick={() => setBulkDialog(true)} sx={{ mb: 2 }}>
        Bulk Add Faculty
      </Button>
      <Grid container spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2} fontWeight="bold">Add Faculty</Typography>
              <FacultyForm
                form={form}
                departments={departments}
                onChange={handleChange}
                onSubmit={handleCreate}
                isEdit={false}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <FacultyFilterBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            departmentFilter={departmentFilter}
            onDepartmentChange={handleDepartmentFilter}
            departments={departments}
          />
          <FacultyTable
            faculties={paginatedFaculties}
            page={page}
            rowsPerPage={rowsPerPage}
            count={filteredFaculties.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onEdit={handleEdit}
          />
        </Grid>
      </Grid>
      <FacultyBulkDialog
        open={bulkDialog}
        onClose={() => setBulkDialog(false)}
        faculties={faculties}
        onBulkSubmit={handleBulkSubmit}
      />
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>
          Edit Faculty
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FacultyForm
            form={form}
            departments={departments}
            onChange={handleChange}
            onSubmit={handleUpdate}
            isEdit={true}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
          <Button onClick={() => setEditDialog(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyService;