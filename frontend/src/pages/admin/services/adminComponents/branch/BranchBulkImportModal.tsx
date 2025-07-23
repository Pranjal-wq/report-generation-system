import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { addBranch } from '../../../../../api/services/Admin/admin';
import * as XLSX from 'xlsx';

interface Branch {
    program: string;
    course: string;
    shortForm: string;
    duration: number;
}

interface ParsedBranch extends Branch {
    status: 'valid' | 'invalid' | 'duplicate';
    error?: string;
}

interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    data: Branch[] | null;
    status: 'uploading' | 'valid' | 'invalid';
    error?: string;
}

interface BranchBulkImportModalProps {
    open: boolean;
    onClose: () => void;
    departmentId: string;
    existingBranches: Branch[];
    onSuccess: () => void;
}

const BranchBulkImportModal: React.FC<BranchBulkImportModalProps> = ({
    open,
    onClose,
    departmentId,
    existingBranches,
    onSuccess
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [parsedBranches, setParsedBranches] = useState<ParsedBranch[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const steps = ['Upload Files', 'Preview Data', 'Submit'];

    const handleCloseModal = () => {
        if (uploadedFiles.length > 0 && !submitting) {
            setShowWarningDialog(true);
        } else {
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setActiveStep(0);
        setUploadedFiles([]);
        setParsedBranches([]);
        onClose();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, isDrag = false) => {
        const files = isDrag
            ? event.dataTransfer?.files
            : (event.target as HTMLInputElement).files;

        if (!files || files.length === 0) return;

        const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length);
        if (uploadedFiles.length + newFiles.length > 5) {
            toast.warning(`You can only upload up to 5 files. Only the first ${5 - uploadedFiles.length} will be processed.`);
        }

        const tempFiles: UploadedFile[] = newFiles.map(file => ({
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: null,
            status: 'uploading'
        }));

        setUploadedFiles(prev => [...prev, ...tempFiles]);

        newFiles.forEach((file, index) => {
            processFile(file, tempFiles[index].id);
        });
    };

    const processFile = async (file: File, fileId: string) => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let parsedData: Branch[] = [];
                const result = e.target?.result;

                if (!result) {
                    updateFileStatus(fileId, 'invalid', 'Failed to read file');
                    return;
                }

                switch (fileType) {
                    case 'json':
                        parsedData = JSON.parse(result as string);
                        break;
                    case 'csv':
                        parsedData = parseCSV(result as string);
                        break;
                    case 'xlsx':
                        parsedData = parseXLSX(result);
                        break;
                    default:
                        throw new Error('Unsupported file format');
                }

                if (parsedData.length === 0) {
                    updateFileStatus(fileId, 'invalid', 'No valid branch data found');
                } else {
                    updateFileWithData(fileId, parsedData);
                }
            } catch (error) {
                console.error('Error processing file:', error);
                updateFileStatus(fileId, 'invalid', 'Failed to parse file');
            }
        };

        if (fileType === 'json' || fileType === 'csv') {
            reader.readAsText(file);
        } else if (fileType === 'xlsx') {
            reader.readAsBinaryString(file);
        } else {
            updateFileStatus(fileId, 'invalid', 'Unsupported file format');
        }
    };

    const parseCSV = (csvText: string): Branch[] => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        const programIndex = headers.findIndex(h =>
            h === 'program' || h === 'branch name' || h === 'branch'
        );
        const courseIndex = headers.findIndex(h =>
            h === 'course' || h === 'course name'
        );
        const shortFormIndex = headers.findIndex(h =>
            h === 'shortform' || h === 'short form' || h === 'code' || h === 'branch code'
        );
        const durationIndex = headers.findIndex(h =>
            h === 'duration' || h === 'years'
        );

        if (programIndex === -1 || courseIndex === -1 || shortFormIndex === -1) {
            throw new Error('Invalid CSV format - required columns missing');
        }

        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = line.split(',').map(v => v.trim());
                return {
                    program: values[programIndex],
                    course: values[courseIndex],
                    shortForm: values[shortFormIndex],
                    duration: durationIndex !== -1 ? parseInt(values[durationIndex]) || 4 : 4
                };
            });
    };

    const parseXLSX = (data: any): Branch[] => {
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return jsonData.map((row: any) => ({
            program: row.program || row.Program || row['Branch Name'] || row.branch || row.Branch || '',
            course: row.course || row.Course || row['Course Name'] || '',
            shortForm: row.shortForm || row['Short Form'] || row.code || row.Code || row['Branch Code'] || '',
            duration: row.duration || row.Duration || row.years || row.Years || 4
        }));
    };

    const updateFileStatus = (fileId: string, status: 'uploading' | 'valid' | 'invalid', error?: string) => {
        setUploadedFiles(prev =>
            prev.map(file =>
                file.id === fileId ? { ...file, status, error } : file
            )
        );
    };

    const updateFileWithData = (fileId: string, data: Branch[]) => {
        setUploadedFiles(prev =>
            prev.map(file =>
                file.id === fileId ? { ...file, data, status: 'valid' } : file
            )
        );
    };

    const handleNext = () => {
        if (activeStep === 0) {
            const validFiles = uploadedFiles.filter(f => f.status === 'valid');
            if (validFiles.length === 0) {
                toast.error('Please upload at least one valid file');
                return;
            }

            const allData = validFiles.flatMap(f => f.data || []);
            validateData(allData);
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (activeStep === 1) {
            setShowWarningDialog(true);
        } else {
            setActiveStep(prev => prev - 1);
        }
    };

    const validateData = (data: Branch[]) => {
        const validated = data.map((branch, index) => {
            if (!branch.program || !branch.course || !branch.shortForm) {
                return {
                    ...branch,
                    status: 'invalid' as const,
                    error: 'Missing required fields'
                };
            }

            // Check for duplicates in current data
            const isDuplicate = data.findIndex(
                (d, i) => i !== index && d.shortForm === branch.shortForm
            ) !== -1;

            // Check against existing branches
            const exists = existingBranches.some(
                b => b.shortForm === branch.shortForm
            );

            let status: 'valid' | 'invalid' | 'duplicate' = 'valid';
            if (isDuplicate) status = 'duplicate';
            if (exists) status = 'invalid';

            return {
                ...branch,
                status,
                error: isDuplicate ? 'Duplicate branch code' : exists ? 'Branch already exists' : undefined
            };
        });

        setParsedBranches(validated);
    };

    const handleSubmit = async () => {
        const validBranches = parsedBranches.filter(d => d.status === 'valid');
        if (validBranches.length === 0) {
            toast.error('No valid branches to submit');
            return;
        }

        setSubmitting(true);
        try {
            await addBranch({
                departmentId,
                branches: validBranches
            });
            toast.success(`Successfully added ${validBranches.length} branches`);
            resetAndClose();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to add branches');
        } finally {
            setSubmitting(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                program: 'Computer Science and Engineering',
                course: 'B.Tech',
                shortForm: 'CSE',
                duration: 4
            },
            {
                program: 'Electronics and Communication Engineering',
                course: 'B.Tech',
                shortForm: 'ECE',
                duration: 4
            }
        ];

        // Create a workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(template);
        XLSX.utils.book_append_sheet(wb, ws, 'Branches');

        // Generate and download the file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
            view[i] = wbout.charCodeAt(i) & 0xFF;
        }

        const blob = new Blob([buf], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'branch_template.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0: // Upload Files
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-600">
                                Upload files containing branch data (up to 5 files).
                                Supported formats: Excel (.xlsx), CSV (.csv), or JSON (.json)
                            </p>
                            <button
                                onClick={downloadTemplate}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                <span className="mr-1">Download Template</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </div>

                        <div
                            className={`flex flex-col items-center p-6 border-2 border-dashed rounded-lg transition-all
                                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragActive(false);
                                handleFileUpload(e, true);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-4">
                                Drag and drop files here or click to browse
                            </p>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadedFiles.length >= 5}
                            >
                                Choose Files
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept=".xlsx,.csv,.json"
                                multiple
                                onChange={handleFileUpload}
                            />
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadedFiles.map(file => (
                                            <tr key={file.id} className="border-t border-gray-200">
                                                <td className="py-2 px-4 text-sm">{file.name}</td>
                                                <td className="py-2 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${file.status === 'valid' ? 'bg-green-100 text-green-800' :
                                                            file.status === 'uploading' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                        {file.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4 text-sm">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </td>
                                                <td className="py-2 px-4 text-right">
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => {
                                                            setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            case 1: // Preview Data
                return (
                    <div>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">Review the data before submitting. Remove any invalid entries if needed.</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto max-h-96">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Form</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {parsedBranches.map((branch, index) => (
                                        <tr key={index} className={branch.status !== 'valid' ? 'bg-red-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.program}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.course}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.shortForm}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.duration} years</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${branch.status === 'valid' ? 'bg-green-100 text-green-800' :
                                                        branch.status === 'duplicate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {branch.status}
                                                </span>
                                                {branch.error && (
                                                    <span className="block text-xs text-red-600 mt-1">{branch.error}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setParsedBranches(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex space-x-4 text-sm">
                            <span>
                                <span className="font-medium text-green-600">{parsedBranches.filter(d => d.status === 'valid').length}</span> valid
                            </span>
                            <span>
                                <span className="font-medium text-yellow-600">{parsedBranches.filter(d => d.status === 'duplicate').length}</span> duplicates
                            </span>
                            <span>
                                <span className="font-medium text-red-600">{parsedBranches.filter(d => d.status === 'invalid').length}</span> invalid
                            </span>
                        </div>
                    </div>
                );

            case 2: // Confirm
                return (
                    <div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You are about to add {parsedBranches.filter(d => d.status === 'valid').length} new branches.
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700">
                            Please confirm that you want to proceed with adding these branches to the system.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Bulk Import Branches</h3>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4">
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            {steps.map((step, index) => (
                                <div key={step} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < activeStep ? 'bg-blue-600 text-white' :
                                            index === activeStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
                                                'bg-gray-100 text-gray-400'
                                        }`}>
                                        {index < activeStep ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <span className={`mt-2 text-xs ${index <= activeStep ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                        {renderStepContent()}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <div className="flex space-x-2">
                        {activeStep > 0 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Back
                            </button>
                        )}

                        {activeStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={activeStep === 0 && uploadedFiles.filter(f => f.status === 'valid').length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || parsedBranches.filter(d => d.status === 'valid').length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Warning Dialog */}
                {showWarningDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Warning</h3>
                            <p className="text-gray-500 mb-6">
                                Going back will clear all uploaded files and parsed data. Are you sure you want to continue?
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowWarningDialog(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowWarningDialog(false);
                                        setActiveStep(0);
                                        setUploadedFiles([]);
                                        setParsedBranches([]);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Yes, go back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchBulkImportModal;