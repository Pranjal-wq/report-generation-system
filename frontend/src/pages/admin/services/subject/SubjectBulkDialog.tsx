import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Tooltip,
  Chip,
  CircularProgress,
  Checkbox
} from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Assuming types are defined locally or paths are adjusted if these are incorrect
// For now, defining them inline based on common usage in the provided files
interface Department {
  _id: string;
  department: string;
  cn: string; // Common Name or Code
}

interface SubjectInputData {
  subjectCode: string;
  subjectName: string;
  department: string; // Should be department ID
  isElective: boolean;
}
// End of assumed type definitions

interface SubjectBulkDialogProps {
  open: boolean;
  onClose: () => void;
  departments: Department[];
  onBulkSubmit: (data: SubjectInputData[]) => Promise<void>;
  loading?: boolean;
}

type SubjectRowErrors = {
  subjectCode?: string;
  subjectName?: string;
  department?: string;
  isElective?: string;
};

const steps = ['Upload File', 'Preview, Validate & Edit Data', 'Submit'];

const SubjectBulkDialog: React.FC<SubjectBulkDialogProps> = ({
  open,
  onClose,
  departments,
  onBulkSubmit,
  loading: externalLoading = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<SubjectInputData[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: SubjectRowErrors }>({});
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRowData, setEditingRowData] = useState<SubjectInputData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalLoading(externalLoading);
  }, [externalLoading]);

  const resetState = () => {
    setActiveStep(0);
    setUploadedFile(null);
    setBulkPreview([]);
    setValidationErrors({});
    setBulkErrors([]);
    setInternalLoading(false);
    setEditingRowIndex(null);
    setEditingRowData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseDialog = () => {
    resetState();
    onClose();
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setBulkPreview([]);
    setValidationErrors({});
    setBulkErrors([]);
    setEditingRowIndex(null);
    setEditingRowData(null);
    setInternalLoading(true);

    try {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/json'].includes(file.type) &&
          !file.name.endsWith('.xlsx') && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        setBulkErrors(["Unsupported file type. Please upload .xlsx, .csv, or .json files."]);
        setUploadedFile(null);
        setInternalLoading(false);
        return;
      }

      const data = await file.arrayBuffer();
      let jsonData: Record<string, any>[] = [];

      if (file.name.endsWith('.xlsx')) {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as Record<string, any>[];
      } else if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(data);
        const result = XLSX.read(text, { type: 'string', raw: true });
        const sheetName = result.SheetNames[0];
        const worksheet = result.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as Record<string, any>[];
      } else if (file.name.endsWith('.json')) {
        const text = new TextDecoder().decode(data);
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          setBulkErrors(["Invalid JSON format. Input must be a JSON array."]);
          setUploadedFile(null);
          setInternalLoading(false);
          return;
        }
        jsonData = parsed as Record<string, any>[];
      }

      const subjects: SubjectInputData[] = jsonData.map((row: Record<string, any>) => {
        const electiveValue = row['Is Elective'] || row['isElective'] || row['Is Elective (true/false)'] || row['is_elective'] || '';
        let isElective: boolean;
        if (typeof electiveValue === 'boolean') {
          isElective = electiveValue;
        } else {
          const stringValue = String(electiveValue).toLowerCase().trim();
          isElective = stringValue === 'true' || stringValue === '1' || stringValue === 'yes';
        }

        const departmentValue = row['Department'] || row['department'] || row['Department ID'] || row['department_id'] || '';
        let matchedDepartmentId = String(departmentValue); 

        if (departmentValue) {
          const foundDept = departments.find(dept =>
            dept._id === departmentValue ||
            dept.cn === departmentValue || 
            dept.department.toLowerCase() === String(departmentValue).toLowerCase()
          );
          if (foundDept) {
            matchedDepartmentId = foundDept._id;
          }
        }
        
        return {
          subjectCode: String(row['Subject Code'] || row['subjectCode'] || row['subject_code'] || ''),
          subjectName: String(row['Subject Name'] || row['subjectName'] || row['subject_name'] || ''),
          isElective: isElective,
          department: matchedDepartmentId,
        };
      });

      setBulkPreview(subjects);
      if (subjects.length > 0) {
        validateData(subjects); 
      } else {
        setBulkErrors(prev => [...prev, "No data found in the file or file is empty."]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse file";
      setBulkErrors(prev => [...prev, errorMessage]);
      setUploadedFile(null);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const validateData = (dataToValidate: SubjectInputData[] = bulkPreview): boolean => {
    const newValidationErrors: { [key: number]: SubjectRowErrors } = {};
    const generalErrorMessages: string[] = [];
    let hasOverallErrors = false;

    dataToValidate.forEach((item, index) => {
      const itemErrors: SubjectRowErrors = {};
      let hasItemErrors = false;

      if (!item.subjectCode?.trim()) {
        itemErrors.subjectCode = "Subject Code is required";
        hasItemErrors = true;
      }
      if (!item.subjectName?.trim()) {
        itemErrors.subjectName = "Subject Name is required";
        hasItemErrors = true;
      }
      if (!item.department?.trim()) {
        itemErrors.department = "Department is required";
        hasItemErrors = true;
      } else {
        const departmentExists = departments.find(dept => dept._id === item.department);
        if (!departmentExists) {
          itemErrors.department = `Department ID '${item.department}' not found. Select a valid department.`;
          hasItemErrors = true;
        }
      }
      if (typeof item.isElective !== 'boolean') {
        itemErrors.isElective = "Is Elective must be true or false.";
        hasItemErrors = true;
      }

      // Check for duplicates within the uploaded list
      for (let j = index + 1; j < dataToValidate.length; j++) {
        const otherItem = dataToValidate[j];
        if (item.subjectCode && item.subjectCode === otherItem.subjectCode) {
          itemErrors.subjectCode = (itemErrors.subjectCode ? itemErrors.subjectCode + " " : "") + "(Duplicate in list)";
          hasItemErrors = true;
          // Also mark the other item if not already marked for this specific duplication
        }
        if (item.subjectName && item.department &&
            item.subjectName === otherItem.subjectName &&
            item.department === otherItem.department) {
          itemErrors.subjectName = (itemErrors.subjectName ? itemErrors.subjectName + " " : "") + "(Duplicate name in this dept in list)";
          hasItemErrors = true;
        }
      }
      
      if (hasItemErrors) {
        newValidationErrors[index] = itemErrors;
        hasOverallErrors = true;
        // Construct a summary error message for the bulkErrors state
        const errorSummary = Object.values(itemErrors).join(' ');
        generalErrorMessages.push(`Row ${index + 1}: ${errorSummary}`);
      }
    });

    setValidationErrors(newValidationErrors);
    // Preserve existing non-row-specific bulk errors (like file parse errors)
    // and add new row-specific summary errors.
    setBulkErrors(prev => [...prev.filter(err => !err.startsWith("Row ")), ...generalErrorMessages]);
    return !hasOverallErrors;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!uploadedFile || bulkPreview.length === 0) {
        toast.error("Please upload a file with data.");
        if (bulkErrors.length === 0 && bulkPreview.length === 0) {
             setBulkErrors(prev => [...prev, "No data processed. Check file content/format."]);
        }
        return;
      }
      // Check for file-level errors (not row-specific validation summaries)
      if (bulkErrors.some(err => !err.startsWith("Row "))) {
        toast.error("Resolve file processing errors before proceeding.");
        return;
      }
      // Validation is already called by processFile.
      // Allow moving to next step even with validation errors, user can fix them there.
    }
    if (activeStep === 1) {
      if (!validateData(bulkPreview)) {
        toast.error("Please fix all validation errors before submitting.");
        return;
      }
      if (bulkPreview.length === 0) {
        toast.warn("No valid subjects to import.");
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Subject Code': "SUBJ101",
        'Subject Name': "Introduction to Subjectology",
        'Department': "DEPT_ID_OR_CN_OR_NAME",
        'Is Elective (true/false)': false,
      },
      {
        'Subject Code': "SUBJ102",
        'Subject Name': "Advanced Subjecteering",
        'Department': "CSE_DEPT_ID",
        'Is Elective (true/false)': true,
      }
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    const columnWidths = [ { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 20 } ];
    ws['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(wb, ws, 'SubjectsTemplate');
    XLSX.writeFile(wb, 'SubjectsBulkUploadTemplate.xlsx');
  };

  const handleEditRow = (index: number) => {
    setEditingRowIndex(index);
    setEditingRowData({ ...bulkPreview[index] });
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditingRowData(null);
    // Re-validate the specific row that was being edited to clear/reset its errors if needed
    // or rely on the next global validation. For simplicity, errors might persist until next save.
  };

  const handleSaveRow = (index: number) => {
    if (editingRowData) {
      const updatedData = [...bulkPreview];
      updatedData[index] = { ...editingRowData };
      setBulkPreview(updatedData);
      setEditingRowIndex(null);
      setEditingRowData(null);
      validateData(updatedData); 
    }
  };

  const handleEditingRowChange = (field: keyof SubjectInputData, value: string | boolean) => {
    if (editingRowData && editingRowIndex !== null) {
      const newEditingRowData = { ...editingRowData, [field]: value };
      setEditingRowData(newEditingRowData);
      
      // Perform validation on the temporarily updated data for immediate feedback
      const tempUpdatedPreview = [...bulkPreview];
      tempUpdatedPreview[editingRowIndex] = newEditingRowData;
      validateData(tempUpdatedPreview);
    }
  };

  const handleDeleteRow = (indexToDelete: number) => {
    const updatedTableData = bulkPreview.filter((_, rowIndex) => rowIndex !== indexToDelete);
    setBulkPreview(updatedTableData);
    
    const newValidationErrors: { [key: number]: SubjectRowErrors } = {};
    Object.keys(validationErrors).forEach(keyStr => {
      const numericKey = parseInt(keyStr, 10);
      if (numericKey < indexToDelete) {
        newValidationErrors[numericKey] = validationErrors[numericKey];
      } else if (numericKey > indexToDelete) {
        newValidationErrors[numericKey - 1] = validationErrors[numericKey];
      }
    });
    setValidationErrors(newValidationErrors);

    validateData(updatedTableData);

    if (editingRowIndex === indexToDelete) {
      setEditingRowIndex(null);
      setEditingRowData(null);
    } else if (editingRowIndex !== null && editingRowIndex > indexToDelete) {
      setEditingRowIndex(editingRowIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateData(bulkPreview)) {
        toast.error("Please ensure all data is valid before submitting.");
        setActiveStep(1); 
        return;
    }
    const validPreview = bulkPreview.filter((_, index) => !validationErrors[index] || Object.keys(validationErrors[index]).length === 0);

    if (validPreview.length === 0) {
        toast.warn("No valid subjects to import.");
        if (bulkPreview.length > 0) setActiveStep(1); // Go back if there was data but none valid
        return;
    }
    
    setInternalLoading(true);
    try {
      await onBulkSubmit(validPreview); // Submit only valid records
      toast.success(`Successfully imported ${validPreview.length} subjects!`);
      handleCloseDialog(); 
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to import subjects: ${message}`);
      setBulkErrors(prev => [...prev, `Submission failed: ${message}`]);
    } finally {
      setInternalLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: { // Upload File
        return (
          <Box>
            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{ border: '2px dashed grey', borderRadius: '4px', padding: 4, textAlign: 'center', cursor: 'pointer', mb: 2, backgroundColor: '#f9f9f9' }}
            >
              <input
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
                style={{ display: 'none' }}
                id="subject-bulk-file-input"
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Typography variant="h6" gutterBottom>Drag 'n' drop file here, or click to select</Typography>
              <Typography variant="body2" color="textSecondary">Supported: .xlsx, .csv, .json</Typography>
              {uploadedFile && <Typography variant="body1" sx={{ mt: 2 }}>Selected: {uploadedFile.name}</Typography>}
            </Box>
            <Button onClick={handleDownloadTemplate} variant="outlined" sx={{ mb: 2 }}>
              Download Template (.xlsx)
            </Button>
            {internalLoading && <Box sx={{display: 'flex', justifyContent: 'center', my:2}}><CircularProgress /></Box>}
            {bulkErrors.filter(e => !e.startsWith("Row ")).length > 0 && ( // Show only non-row specific errors here
              <Alert severity="error" sx={{ mt: 2 }}>
                {bulkErrors.filter(e => !e.startsWith("Row ")).map((err, i) => <Typography key={i} component="div">{err}</Typography>)}
              </Alert>
            )}
          </Box>
        );
      }
      case 1: { // Preview, Validate & Edit Data
        const tableColumns = [
          { id: 'subjectCode', label: 'Subject Code', minWidth: 150 },
          { id: 'subjectName', label: 'Subject Name', minWidth: 200 },
          { id: 'department', label: 'Department', minWidth: 200 },
          { id: 'isElective', label: 'Is Elective', minWidth: 100 },
          { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' as const }
        ];

        return (
          <Box>
            {bulkErrors.filter(e => e.startsWith("Row ")).length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Validation Issues Summary (Fix In Table):</Typography>
                {bulkErrors.filter(e => e.startsWith("Row ")).slice(0, 5).map((err, i) => <Typography key={i} component="div" variant="caption">{err}</Typography>)}
                {bulkErrors.filter(e => e.startsWith("Row ")).length > 5 && <Typography variant="caption">...and more.</Typography>}
              </Alert>
            )}
             <Typography variant="caption" display="block" gutterBottom>
              Department column should contain a valid Department ID. Use the dropdown in edit mode.
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {tableColumns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth, fontWeight: 'bold' }} align={column.align}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bulkPreview.map((row, rowIndex) => {
                      const isEditing = editingRowIndex === rowIndex;
                      const rowErrors = validationErrors[rowIndex] || {};
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} sx={Object.keys(rowErrors).length > 0 ? { backgroundColor: 'rgba(255,0,0,0.05)' } : {}}>
                          {tableColumns.map((column) => {
                            const value = isEditing && editingRowData ? editingRowData[column.id as keyof SubjectInputData] : row[column.id as keyof SubjectInputData];
                            if (column.id === 'actions') {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {isEditing ? (
                                    <>
                                      <IconButton onClick={() => handleSaveRow(rowIndex)} size="small" color="primary" title="Save"><SaveIcon /></IconButton>
                                      <IconButton onClick={handleCancelEdit} size="small" title="Cancel"><CancelIcon /></IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton onClick={() => handleEditRow(rowIndex)} size="small" color="primary" title="Edit" disabled={editingRowIndex !== null}><EditIcon /></IconButton>
                                      <IconButton onClick={() => handleDeleteRow(rowIndex)} size="small" color="error" title="Delete" disabled={editingRowIndex !== null}><DeleteIcon /></IconButton>
                                    </>
                                  )}
                                </TableCell>
                              );
                            }
                            if (isEditing && editingRowData) {
                              if (column.id === 'department') {
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    <FormControl fullWidth error={!!rowErrors.department} size="small">
                                      <Select
                                        value={editingRowData.department || ''}
                                        onChange={(e) => handleEditingRowChange('department', e.target.value as string)}
                                      >
                                        {departments.map(dept => (
                                          <MenuItem key={dept._id} value={dept._id}>{dept.department} ({dept.cn})</MenuItem>
                                        ))}
                                      </Select>
                                      {rowErrors.department && <FormHelperText>{rowErrors.department}</FormHelperText>}
                                    </FormControl>
                                  </TableCell>
                                );
                              }
                              if (column.id === 'isElective') {
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                     <Checkbox
                                        checked={Boolean(editingRowData.isElective)}
                                        onChange={(e) => handleEditingRowChange('isElective', e.target.checked)}
                                        size="small"
                                      />
                                    {rowErrors.isElective && <FormHelperText error>{rowErrors.isElective}</FormHelperText>}
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <TextField
                                    value={editingRowData[column.id as keyof SubjectInputData] || ''}
                                    onChange={(e) => handleEditingRowChange(column.id as keyof SubjectInputData, e.target.value)}
                                    size="small"
                                    fullWidth
                                    error={!!rowErrors[column.id as keyof SubjectRowErrors]}
                                    helperText={rowErrors[column.id as keyof SubjectRowErrors]}
                                  />
                                </TableCell>
                              );
                            }
                            // Display mode
                            let displayValue = String(value);
                            if (column.id === 'department') {
                                const dept = departments.find(d => d._id === value);
                                displayValue = dept ? `${dept.department} (${dept.cn})` : String(value);
                            }
                            if (column.id === 'isElective') {
                                displayValue = String(Boolean(value));
                            }
                            return (
                              <TableCell key={column.id} align={column.align} sx={rowErrors[column.id as keyof SubjectRowErrors] ? {color: 'red'} : {}}>
                                {displayValue}
                                {rowErrors[column.id as keyof SubjectRowErrors] && 
                                  <Tooltip title={rowErrors[column.id as keyof SubjectRowErrors] || ''}>
                                    <Chip label="!" size="small" color="error" sx={{ml:1, cursor:'help'}} />
                                  </Tooltip>
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
             {bulkPreview.length === 0 && !internalLoading && <Typography sx={{mt:2, textAlign:'center'}}>No data to display. Upload a file in the previous step.</Typography>}
          </Box>
        );
      }
      case 2: { // Submit
        const validRecordsCount = bulkPreview.filter((_, index) => !validationErrors[index] || Object.keys(validationErrors[index]).length === 0).length;
        return (
          <Box>
            <Typography variant="h6">Confirm Submission</Typography>
            <Typography>Total records in preview: {bulkPreview.length}</Typography>
            <Typography color={validRecordsCount === bulkPreview.length && bulkPreview.length > 0 ? "green" : "inherit"}>
                Records ready for submission (no errors): {validRecordsCount}
            </Typography>
            {bulkPreview.length > 0 && validRecordsCount < bulkPreview.length && (
              <Alert severity="warning" sx={{my:1}}>
                {bulkPreview.length - validRecordsCount} record(s) have validation errors and will NOT be submitted. Please go back to fix them.
              </Alert>
            )}
             {bulkPreview.length === 0 && <Alert severity="info">There are no records to submit.</Alert>}
             {validRecordsCount === 0 && bulkPreview.length > 0 && <Alert severity="error">No records are valid for submission.</Alert>}
            {bulkErrors.filter(e => !e.startsWith("Row ")).length > 0 && ( // Show submission or other general errors
              <Alert severity="error" sx={{ mt: 2 }}>
                {bulkErrors.filter(e => !e.startsWith("Row ")).map((err, i) => <Typography key={i} component="div">{err}</Typography>)}
              </Alert>
            )}
          </Box>
        );
      }
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth PaperProps={{ sx: { minHeight: '80vh' } }}>
      <DialogTitle sx={{pb: 0}}>
        Bulk Import Subjects
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb:1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent sx={{pt:1}}>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleCloseDialog} color="inherit" disabled={internalLoading}>
          Close
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep !== 0 && (
          <Button onClick={handleBack} disabled={internalLoading}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={internalLoading || (activeStep === 0 && (!uploadedFile || bulkPreview.length === 0 && !internalLoading) ) || (activeStep === 2 && bulkPreview.filter((_, index) => !validationErrors[index] || Object.keys(validationErrors[index]).length === 0).length === 0 && bulkPreview.length > 0) }
          startIcon={internalLoading && (activeStep === steps.length -1 || (activeStep === 0 && uploadedFile)) ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubjectBulkDialog;
