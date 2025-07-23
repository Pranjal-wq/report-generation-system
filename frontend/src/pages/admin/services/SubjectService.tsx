import React, { useState, useEffect, useCallback } from "react";
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
  DialogActions,
  CircularProgress,
  Alert
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import SubjectForm from "./subject/SubjectForm";
import SubjectBulkDialog from "./subject/SubjectBulkDialog";
import SubjectTable from "./subject/SubjectTable";
import SubjectFilterBar from "./subject/SubjectFilterBar";
import useSubjectData from "./subject/subjectHooks";
import { addSubjects, updateSubject } from "../../../api/services/Admin/Subject";
import { toast } from "react-toastify";
import { SubjectInputData, UpdateSubjectData, Subject } from "../../../api/services/Admin/Subject.types";

const defaultSubject: SubjectInputData = {
  subjectCode: "",
  subjectName: "",
  department: "",
  isElective: false,
};

const SubjectService: React.FC = () => {
  const {
    subjects,
    departments,
    filteredSubjects,
    setFilteredSubjects,
    fetchSubjectsList,
    fetchDepartmentsList,
    loadingSubjects: initialLoadingSubjects,
    loadingDepartments: initialLoadingDepartments,
  } = useSubjectData();

  const [form, setForm] = useState<SubjectInputData>(defaultSubject);
  const [editDialog, setEditDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // Stores _id of subject being edited
  const [bulkDialog, setBulkDialog] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [electiveFilter, setElectiveFilter] = useState("all"); // "all", "true", "false"

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Filtering logic
  useEffect(() => {
    let result = subjects;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (subject) =>
          subject.subjectName.toLowerCase().includes(searchLower) ||
          subject.subjectCode.toLowerCase().includes(searchLower)
      );
    }
    if (departmentFilter) {
      result = result.filter(subject => subject.department === departmentFilter);
    }
    if (electiveFilter !== "all") {
      result = result.filter(subject => subject.isElective.toString() === electiveFilter);
    }
    setFilteredSubjects(result);
    setPage(0); // Reset page on filter change
  }, [searchTerm, departmentFilter, electiveFilter, subjects, setFilteredSubjects]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
    isCheckbox: boolean = false
  ) => {
    const target = e.target as HTMLInputElement; // Cast for typical input/select
    const name = target.name || (e.target as any).name; // For MUI select
    const value = isCheckbox ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!form.department) {
        toast.error("Department is required.");
        return;
    }
    setIsSubmitting(true);
    try {
      const response = await addSubjects([form]);
      let successCount = response.success.length;
      let errorCount = response.errors.length;

      if (successCount > 0) {
        toast.success(`${successCount} subject(s) created successfully!`);
        setForm(defaultSubject);
        fetchSubjectsList(); // Refresh list
      }
      if (errorCount > 0) {
        const errorMessages = response.errors.map(err => `${err.subjectCode}: ${err.error}`).join('\n');
        toast.error(<div>Failed to create {errorCount} subject(s):<br/>{errorMessages}</div>, { autoClose: 7000 });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create subject.");
      console.error("Create subject error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditId(subject._id);
    setForm({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      department: subject.department,
      isElective: subject.isElective,
    });
    setEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    if (!form.department) {
        toast.error("Department is required.");
        return;
    }
    setIsSubmitting(true);
    try {
      const payload: UpdateSubjectData = { ...form };
      await updateSubject({ id: editId, toModify: payload });
      toast.success("Subject updated successfully!");
      setEditDialog(false);
      setForm(defaultSubject);
      setEditId(null);
      fetchSubjectsList(); // Refresh list
    } catch (error: any) {
      toast.error(error?.message || "Failed to update subject.");
      console.error("Update subject error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBulkSubmit = async (bulkData: SubjectInputData[]) => {
    setIsBulkSubmitting(true);
    try {
      const response = await addSubjects(bulkData);
      const successCount = response.success.length;
      const errorCount = response.errors.length;

      if (successCount > 0) {
        toast.success(`${successCount} subject(s) created successfully!`);
      }
      if (errorCount > 0) {
        const errorMessages = response.errors.map(err => `${err.subjectCode || err.subjectName}: ${err.error}`).join('\n');
        toast.error(<div>{errorCount} subject(s) failed to import:<br/>{errorMessages}</div>, { autoClose: 10000 });
      }
      if (successCount > 0 || errorCount === 0) { // Close if any success or no errors at all
        setBulkDialog(false);
      }
      fetchSubjectsList(); // Refresh list
    } catch (error: any) {
      toast.error(error?.message || "Bulk subject creation failed.");
      console.error("Bulk create error:", error);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);
  const handleDepartmentFilterChange = (event: any) => setDepartmentFilter(event.target.value as string);
  const handleElectiveFilterChange = (event: any) => setElectiveFilter(event.target.value as string);

  const paginatedSubjects = filteredSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (initialLoadingSubjects || initialLoadingDepartments) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading configuration...</Typography>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 1, sm: 2, md: 3 }} sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <Typography variant="h5" mb={3} fontWeight="bold">Subject Management</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
            variant="outlined" 
            onClick={() => setBulkDialog(true)} 
            startIcon={<CloudUploadIcon />}
            sx={{ mr: 1 }}
        >
          Bulk Add Subjects
        </Button>
      </Box>

      <Grid container spacing={3} direction={{ xs: 'column-reverse', md: 'row' }}>
        <Grid item xs={12} md={8}>
          <SubjectFilterBar
            searchTerm={searchTerm}
            onSearch={handleSearchChange}
            departmentFilter={departmentFilter}
            onDepartmentChange={handleDepartmentFilterChange}
            electiveFilter={electiveFilter}
            onElectiveChange={handleElectiveFilterChange}
            departments={departments}
          />
          {filteredSubjects.length === 0 && !searchTerm && !departmentFilter && electiveFilter === "all" ? (
             <Alert severity="info" sx={{mt: 2}}>No subjects available. Add subjects using the form or bulk upload.</Alert>
          ) : (
            <SubjectTable
                subjects={paginatedSubjects}
                departments={departments}
                page={page}
                rowsPerPage={rowsPerPage}
                count={filteredSubjects.length}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onEdit={handleEdit}
                loading={initialLoadingSubjects}
            />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={1} fontWeight="medium">Add New Subject</Typography>
              <SubjectForm
                form={form}
                departments={departments}
                onChange={handleFormChange}
                onSubmit={handleCreate}
                isEdit={false}
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <SubjectBulkDialog
        open={bulkDialog}
        onClose={() => setBulkDialog(false)}
        departments={departments}
        onBulkSubmit={handleBulkSubmit}
        loading={isBulkSubmitting}
      />

      <Dialog open={editDialog} onClose={() => { setEditDialog(false); setEditId(null); setForm(defaultSubject);}} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>
          Edit Subject
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <SubjectForm
            form={form}
            departments={departments}
            onChange={handleFormChange}
            onSubmit={handleUpdate}
            isEdit={true}
            loading={isSubmitting}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
          <Button onClick={() => { setEditDialog(false); setEditId(null); setForm(defaultSubject);}} variant="outlined" disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectService;
