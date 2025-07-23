import React, { useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Button, Stepper, Step, StepLabel, Alert, Paper, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip } from "@mui/material";
import { Download, CloudUpload, ArrowBack, Edit, Save, Cancel, Delete } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { CreateFacultyData, FacultyUser } from "../../../../api/services/faculty/Faculty.types";

interface FacultyBulkDialogProps {
  open: boolean;
  onClose: () => void;
  faculties: FacultyUser[];
  onBulkSubmit: (data: CreateFacultyData) => Promise<void>;
}

const steps = ['Upload Files', 'Preview Data', 'Submit'];

const FacultyBulkDialog: React.FC<FacultyBulkDialogProps> = ({ open, onClose, faculties, onBulkSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bulkJson, setBulkJson] = React.useState('');
  const [bulkErrors, setBulkErrors] = React.useState<string[]>([]);
  const [bulkPreview, setBulkPreview] = React.useState<CreateFacultyData>([]); // This is the final validated data for submission
  const [parsedTableData, setParsedTableData] = React.useState<CreateFacultyData>([]); // Data for table display and editing

  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRowData, setEditingRowData] = useState<CreateFacultyData[0] | null>(null);

  const [bulkLoading, setBulkLoading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const resetState = () => {
    setActiveStep(0);
    setBulkJson('');
    setBulkErrors([]);
    setBulkPreview([]);
    setParsedTableData([]);
    setEditingRowIndex(null);
    setEditingRowData(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseDialog = () => {
    resetState();
    onClose();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setBulkJson(''); 
    setBulkPreview([]); 
    setBulkErrors([]); 
    setParsedTableData([]);
    setEditingRowIndex(null);
    setEditingRowData(null);
    try {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/json'].includes(file.type) &&
          !file.name.endsWith('.xlsx') && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        setBulkErrors(["Unsupported file type. Please upload .xlsx, .csv, or .json files."]);
        setUploadedFile(null);
        return;
      }

      const data = await file.arrayBuffer();
      let jsonData: any[] = [];

      if (file.name.endsWith('.xlsx')) {
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      } else if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(data);
        const result = XLSX.read(text, { type: 'string', raw: true });
        const sheet = result.Sheets[result.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      } else if (file.name.endsWith('.json')) {
        const text = new TextDecoder().decode(data);
        jsonData = JSON.parse(text);
        if (!Array.isArray(jsonData)) {
          throw new Error("JSON file must contain an array of faculty objects.");
        }
      }
      setBulkJson(JSON.stringify(jsonData, null, 2));
      // Automatically trigger validation after successful parse if desired, or wait for "Next"
      // For now, let's let "Next" or "Validate" button trigger handleBulkValidate
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse file";
      setBulkErrors([errorMessage]);
      setUploadedFile(null); // Clear file on error
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

  const handleBulkValidate = (jsonInput?: string) => {
    setBulkErrors([]);
    setBulkPreview([]); 
    
    const jsonToParse = jsonInput !== undefined ? jsonInput : bulkJson;
    let arr: any[] = [];
    try {
      arr = JSON.parse(jsonToParse);
      if (!Array.isArray(arr)) throw new Error("Input must be a JSON array");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON format";
      setBulkErrors([errorMessage]);
      setParsedTableData([]); // Clear table data on JSON parse error
      return;
    }

    // Populate table data (ensure all fields are strings for editing)
    const tableDataForDisplay: CreateFacultyData = arr.map(item => ({
        name: String(item.name || ""),
        empCode: String(item.empCode || ""),
        abbreviation: String(item.abbreviation || ""),
        department: String(item.department || ""),
        email: String(item.email || ""),
        phone: String(item.phone || ""),
        password: String(item.password || ""),
        role: String(item.role || "faculty")
    }));
    setParsedTableData(tableDataForDisplay);

    // Now perform full validation on the parsed data (arr or tableDataForDisplay)
    const errors: string[] = [];
    const existing = faculties;
    const previewForSubmission: CreateFacultyData = [];

    tableDataForDisplay.forEach((item, idx) => {
      if (!item.name || !item.empCode || !item.abbreviation || !item.department || !item.email || !item.password) {
        errors.push(`Row ${idx + 1}: Missing one or more required fields (name, empCode, abbreviation, department, email, password).`);
        // Do not return, let it be added to parsedTableData for editing, but it won't go to bulkPreview
      }

      const found = existing.find(f =>
        f.empCode === item.empCode ||
        f.email === item.email ||
        f.abbreviation === item.abbreviation
      );

      let isDuplicateErrorPushed = false;
      if (item.empCode && existing.some(f => f.empCode === item.empCode && f._id !== (item as any)._id)) { // Check if empCode is not empty before pushing error
        errors.push(`Row ${idx + 1} (Emp Code: ${item.empCode}): Duplicate Employee Code found in existing records.`);
        isDuplicateErrorPushed = true;
      }
      if (item.email && existing.some(f => f.email === item.email && f._id !== (item as any)._id)) { // Check if email is not empty
        errors.push(`Row ${idx + 1} (Email: ${item.email}): Duplicate Email found in existing records.`);
        isDuplicateErrorPushed = true;
      }
       if (item.abbreviation && existing.some(f => f.abbreviation === item.abbreviation && f._id !== (item as any)._id)) { // Check if abbreviation is not empty
        errors.push(`Row ${idx + 1} (Abbr: ${item.abbreviation}): Duplicate Abbreviation found in existing records.`);
        isDuplicateErrorPushed = true;
      }
      
      // Check for duplicates within the uploaded list itself
      for (let j = idx + 1; j < tableDataForDisplay.length; j++) {
        const otherItem = tableDataForDisplay[j];
        if (item.empCode && item.empCode === otherItem.empCode) {
            errors.push(`Row ${idx + 1} & Row ${j + 1}: Duplicate Employee Code '${item.empCode}' within the uploaded list.`);
            isDuplicateErrorPushed = true;
        }
        if (item.email && item.email === otherItem.email) {
            errors.push(`Row ${idx + 1} & Row ${j + 1}: Duplicate Email '${item.email}' within the uploaded list.`);
            isDuplicateErrorPushed = true;
        }
        if (item.abbreviation && item.abbreviation === otherItem.abbreviation) {
            errors.push(`Row ${idx + 1} & Row ${j + 1}: Duplicate Abbreviation '${item.abbreviation}' within the uploaded list.`);
            isDuplicateErrorPushed = true;
        }
      }
      
      if (!errors.some(e => e.startsWith(`Row ${idx + 1}: Missing`)) && !isDuplicateErrorPushed) {
         // Only add to final preview if no missing fields and no duplicates for this item
        previewForSubmission.push(item);
      }
    });
    setBulkErrors(errors);
    setBulkPreview(previewForSubmission); // This is the data that will be submitted
  };

  const handleBulkSubmit = async () => {
    setBulkLoading(true);
    try {
      if (bulkPreview.length === 0) {
        setBulkErrors(prev => [...prev, "No valid faculty to submit. Please ensure data is validated and errors are resolved."]);
        setBulkLoading(false);
        return;
      }
      await onBulkSubmit(bulkPreview);
      resetState(); // Reset state on successful submission
      onClose(); // Close dialog
    } catch (err) {
      setBulkErrors(["Bulk creation failed. " + (err instanceof Error ? err.message : "Please try again.")]);
    }
    setBulkLoading(false);
  };

  const handleNext = () => {
    if (activeStep === 0) { 
      if (!bulkJson) { // Check if bulkJson is empty, implying no file processed or file was invalid
        setBulkErrors(prev => prev.length > 0 ? prev : ["Please upload a valid file."]);
        return;
      }
      // If bulkJson has content, try to validate it. Errors from parsing might already be in bulkErrors.
      handleBulkValidate(); // Uses bulkJson from state
      // Check if handleBulkValidate itself produced errors or if initial parsing errors exist
      if (bulkErrors.length > 0 && parsedTableData.length === 0) { // Major parsing error, no table data
          // Errors are already set by processFile or handleBulkValidate
          return;
      }
      // Allow moving to next step even with validation errors in table, user can fix them there
    }
    if (activeStep === 1) { 
      // Re-validate before moving to submit step to ensure all table edits are processed
      handleBulkValidate(); // Uses bulkJson from state
      if (bulkPreview.length === 0 || bulkErrors.length > 0) {
        setBulkErrors(prev => {
            const currentErrors = Array.isArray(prev) ? prev : [];
            if (bulkPreview.length === 0 && !currentErrors.some(e => e.includes("No valid data to submit"))) {
                return [...currentErrors, "No valid data to submit. Please check errors or validate the JSON."];
            }
            return currentErrors;
        });
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1) { // Going back from Preview to Upload
      // Optionally clear preview and errors if you want re-validation from JSON
      // setBulkPreview([]); 
      // setBulkErrors([]);
    }
  };
  
  const handleDownloadTemplate = () => {
    // Create sample data with proper column headers and examples
    const templateData = [
      {
        name: "John Doe",
        empCode: "EMP001",
        abbreviation: "JD",
        department: "CSE",
        email: "john.doe@example.com",
        phone: "9876543210",
        password: "defaultPassword123",
        role: "faculty"
      },
      {
        name: "Jane Smith",
        empCode: "EMP002", 
        abbreviation: "JS",
        department: "ECE",
        email: "jane.smith@example.com",
        phone: "9876543211",
        password: "defaultPassword123",
        role: "Prof"
      },
      {
        name: "Dr. Robert Johnson",
        empCode: "EMP003",
        abbreviation: "RJ",
        department: "ME",
        email: "robert.johnson@example.com",
        phone: "9876543212",
        password: "defaultPassword123",
        role: "Prof"
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create a new worksheet directly from the sample data
    // This will use the keys from the first object as headers
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // name
      { wch: 12 }, // empCode
      { wch: 12 }, // abbreviation
      { wch: 15 }, // department
      { wch: 30 }, // email
      { wch: 15 }, // phone
      { wch: 20 }, // password
      { wch: 15 }  // role
    ];
    ws['!cols'] = columnWidths;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Faculty Data Template");

    // Generate and download the file
    XLSX.writeFile(wb, "Faculty_Bulk_Upload_Template.xlsx");
  };

  const handleEditRow = (index: number) => {
    setEditingRowIndex(index);
    setEditingRowData({ ...parsedTableData[index] });
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditingRowData(null);
  };

  const handleSaveRow = (index: number) => {
    if (editingRowData) {
      const updatedTableData = [...parsedTableData];
      updatedTableData[index] = { ...editingRowData };
      setParsedTableData(updatedTableData);
      const finalBulkJson = JSON.stringify(updatedTableData, null, 2);
      setBulkJson(finalBulkJson); 
      handleBulkValidate(finalBulkJson); // Re-validate all data with the final JSON
    }
    setEditingRowIndex(null);
    setEditingRowData(null);
  };

  const handleEditingRowChange = (field: keyof CreateFacultyData[0], value: string) => {
    if (editingRowData && editingRowIndex !== null) {
      const newEditingRowData = { ...editingRowData, [field]: value };
      setEditingRowData(newEditingRowData);

      // Create a temporary updated table data for immediate validation
      const tempUpdatedTableData = [...parsedTableData];
      tempUpdatedTableData[editingRowIndex] = newEditingRowData;
      
      const newBulkJson = JSON.stringify(tempUpdatedTableData, null, 2);
      // It's important to update bulkJson state if handleBulkValidate relies on it by default,
      // but passing it directly to handleBulkValidate is safer for immediate effect.
      setBulkJson(newBulkJson); 
      handleBulkValidate(newBulkJson);
    }
  };

  const handleDeleteRow = (indexToDelete: number) => {
    const updatedTableData = parsedTableData.filter((_, rowIndex) => rowIndex !== indexToDelete);
    setParsedTableData(updatedTableData);
    const newBulkJson = JSON.stringify(updatedTableData, null, 2);
    setBulkJson(newBulkJson);
    handleBulkValidate(newBulkJson);

    // If the deleted row was being edited, cancel editing mode
    if (editingRowIndex === indexToDelete) {
      setEditingRowIndex(null);
      setEditingRowData(null);
    } else if (editingRowIndex !== null && editingRowIndex > indexToDelete) {
      // If a row above the currently edited row was deleted, adjust the editing index
      setEditingRowIndex(editingRowIndex - 1);
    }
  };


  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Upload Files
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Upload a file containing faculty data (up to 5 files, currently processing first file).
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: Excel (.xlsx), CSV (.csv), or JSON (.json).
              Required columns/fields: name, empCode, abbreviation, department, email, password. Optional: phone, role.
            </Typography>
            <Paper
              variant="outlined"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.400',
                borderRadius: 2,
                cursor: 'pointer',
                mb: 2,
                '&:hover': { borderColor: 'primary.main' }
              }}
            >
              <input
                type="file"
                accept=".xlsx,.csv,.json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
                aria-label="Upload faculty data file"
              />
              <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
              <Typography>Drag and drop file here or click to browse</Typography>
              {uploadedFile && <Typography variant="caption" sx={{mt:1}}>Selected: {uploadedFile.name}</Typography>}
            </Paper>
            <Button
              variant="contained"
              onClick={() => fileInputRef.current?.click()}
              sx={{ mr: 2 }}
            >
              Choose File
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
            {bulkErrors.length > 0 && activeStep === 0 && !uploadedFile && ( 
              <Box mt={2}>
                <Typography color="error" variant="body2">File Parsing Errors:</Typography>
                <ul>
                  {bulkErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </Box>
            )}
            {uploadedFile && bulkErrors.length > 0 && ( // Show parsing errors if a file was uploaded but failed parsing
                 <Box mt={2}>
                    <Typography color="error" variant="body2">File Parsing Errors:</Typography>
                    <ul>
                        {bulkErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                </Box>
            )}
          </Box>
        );
      case 1: // Preview Data
        const tableColumns: { id: keyof CreateFacultyData[0]; label: string; minWidth?: number }[] = [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'empCode', label: 'Emp Code', minWidth: 100 },
            { id: 'abbreviation', label: 'Abbr.', minWidth: 80 },
            { id: 'department', label: 'Dept', minWidth: 100 },
            { id: 'email', label: 'Email', minWidth: 170 },
            { id: 'phone', label: 'Phone', minWidth: 120 },
            { id: 'password', label: 'Password', minWidth: 120 },
            { id: 'role', label: 'Role', minWidth: 100 },
        ];
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Review and edit faculty data below. Fields marked with errors need correction.
            </Typography>
            <Button variant="outlined" onClick={handleBulkValidate} sx={{ mb: 2 }}>
              Validate All Data
            </Button>
            <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {tableColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedTableData.map((row, rowIndex) => {
                      const isEditing = editingRowIndex === rowIndex;
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                          {tableColumns.map((column) => {
                            const value = isEditing && editingRowData ? editingRowData[column.id] : row[column.id];
                            return (
                              <TableCell key={column.id}>
                                {isEditing ? (
                                  <TextField
                                    value={value}
                                    onChange={(e) => handleEditingRowChange(column.id, e.target.value)}
                                    size="small"
                                    variant="standard"
                                    fullWidth
                                  />
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell sx={{ whiteSpace: 'nowrap'}}>
                            {isEditing ? (
                              <>
                                <IconButton onClick={() => handleSaveRow(rowIndex)} size="small" color="primary" aria-label="save row">
                                  <Save />
                                </IconButton>
                                <IconButton onClick={handleCancelEdit} size="small" aria-label="cancel edit">
                                  <Cancel />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton onClick={() => handleEditRow(rowIndex)} size="small" color="primary" aria-label="edit row">
                                  <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteRow(rowIndex)} size="small" color="error" aria-label="delete row">
                                  <Delete />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {parsedTableData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length + 1} align="center">
                                No data to display. Upload a file or ensure the JSON is valid.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {bulkErrors.length > 0 && (
              <Box mt={2}>
                <Typography color="error" variant="subtitle2" gutterBottom>Validation Errors:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {bulkErrors.map((err, idx) => {
                    const match = err.match(/Row (\d+)(?: & Row \d+)?(?: \(([^)]+)\))?: (.*)/);
                    let errorLabel = `Error ${idx + 1}`;
                    let errorMessage = err;

                    if (match) {
                      const rowNum = match[1];
                      const fieldInfo = match[2] ? ` (${match[2]})` : "";
                      errorLabel = `Row ${rowNum}${fieldInfo}`;
                      errorMessage = match[3];
                       if (err.includes("& Row")) { // For errors mentioning two rows
                         errorLabel = err.substring(0, err.indexOf(':'));
                         errorMessage = err.substring(err.indexOf(':') + 2);
                       }
                    }
                    
                    return (
                      <Tooltip title={errorMessage} key={idx} placement="top">
                        <Chip label={errorLabel} color="error" variant="outlined" size="small" />
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            )}
             {bulkPreview.length > 0 && bulkErrors.length === 0 && (
                <Alert severity="success" sx={{mt: 2}}>
                    {bulkPreview.length} faculty member(s) are valid and ready for submission.
                </Alert>
            )}
            {parsedTableData.length > 0 && bulkPreview.length === 0 && bulkErrors.length > 0 && (
                 <Alert severity="warning" sx={{mt: 2}}>
                    Please resolve the errors above. No faculty members are currently valid for submission.
                </Alert>
            )}
          </Box>
        );
      case 2: // Submit
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Confirm Submission</Typography>
            {bulkPreview.length > 0 ? (
              <>
                <Typography variant="body1">
                  You are about to submit {bulkPreview.length} new faculty member(s).
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                  Please review the data in the previous step if needed.
                </Typography>
                <Box sx={{ maxHeight: 250, overflow: 'auto', background: '#f7f7f7', p: 1, borderRadius: 1, border: '1px solid #eee', mb: 2 }}>
                  <pre style={{ fontSize: '0.8rem', margin: 0 }}>{JSON.stringify(bulkPreview, null, 2)}</pre>
                </Box>
              </>
            ) : (
              <Alert severity="warning">No valid faculty data to submit. Please go back and ensure data is uploaded and validated.</Alert>
            )}
             {bulkErrors.length > 0 && ( // Show any lingering errors, e.g. from submission attempt
              <Box mt={2}>
                <Typography color="error" variant="body2">Errors:</Typography>
                <ul>
                  {bulkErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </Box>
            )}
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth> {/* Changed maxWidth to lg for table */}
      <DialogTitle>Bulk Import Faculty</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}

        </Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Box sx={{ flex: '1 1 auto' }} /> {/* Spacer */}
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleBulkSubmit : handleNext}
          disabled={
            (activeStep === 0 && (!uploadedFile || (bulkErrors.length > 0 && parsedTableData.length ===0) )) || // Disable Next on Upload if no file or critical parsing error
            (activeStep === 1 && (bulkPreview.length === 0 || bulkErrors.length > 0)) || 
            (activeStep === 2 && (bulkPreview.length === 0 || bulkLoading)) || 
            bulkLoading
          }
        >
          {bulkLoading ? "Processing..." : (activeStep === steps.length - 1 ? 'Submit' : 'Next')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacultyBulkDialog;
