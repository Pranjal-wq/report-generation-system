import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    InputAdornment,
    Typography,
    Paper,
    Box
} from '@mui/material';
import {
    Add as AddIcon,
    Error as ErrorIcon,
    CalendarToday as CalendarIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

interface AddSessionFormProps {
    newSession: string;
    setNewSession: (session: string) => void;
    addNewSession: () => void;
    submitting: boolean;
    selectedCourseDuration: number | null;
    onBulkUpload?: () => void; // New prop for handling bulk upload
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({
    newSession,
    setNewSession,
    addNewSession,
    submitting,
    selectedCourseDuration,
    onBulkUpload
}) => {
    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');

    // Validate session format when input changes
    useEffect(() => {
        if (!newSession.trim()) {
            setIsValid(true);
            setValidationMessage('');
            return;
        }

        const sessionRegex = /^\d{4}-\d{2,4}$/;
        const isFormatValid = sessionRegex.test(newSession);

        if (!isFormatValid) {
            setIsValid(false);
            setValidationMessage('Session should be in YYYY-YY or YYYY-YYYY format');
            return;
        }

        const [startYear, endYear] = newSession.split('-').map(year => parseInt(year));
        const endYearFull = endYear < 100 ? 2000 + endYear : endYear;

        if (selectedCourseDuration && (endYearFull - startYear !== selectedCourseDuration)) {
            setIsValid(false);
            setValidationMessage(`Session duration should match ${selectedCourseDuration}-year program`);
        } else {
            setIsValid(true);
            setValidationMessage('');
        }
    }, [newSession, selectedCourseDuration]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid && newSession.trim()) {
            e.preventDefault();
            addNewSession();
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Box mb={2}>
                    <Typography variant="subtitle1" component="label" htmlFor="newSession" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon color="primary" sx={{ mr: 1 }} />
                        Add New Session {selectedCourseDuration ? `(for ${selectedCourseDuration}-year program)` : ''}
                    </Typography>

                    <TextField
                        fullWidth
                        id="newSession"
                        value={newSession}
                        onChange={(e) => setNewSession(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedCourseDuration
                            ? `e.g., ${new Date().getFullYear()}-${(new Date().getFullYear() + selectedCourseDuration).toString().slice(-2)}`
                            : "e.g., 2022-26"}
                        error={!isValid && newSession.trim() !== ''}
                        helperText={!isValid && newSession.trim() !== '' ? validationMessage : ''}
                        variant="outlined"
                        autoComplete="off"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                   
                                </InputAdornment>
                            ),
                        }}
                    />

                    {selectedCourseDuration && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <ErrorIcon fontSize="small" color="info" sx={{ mr: 0.5 }} />
                            Tip: For {selectedCourseDuration}-year program, use format like {new Date().getFullYear()}-{(new Date().getFullYear() + selectedCourseDuration).toString().slice(-2)}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onBulkUpload}
                        startIcon={<CloudUploadIcon />}
                        sx={{ height: 36.5 }}
                    >
                        Bulk Add
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addNewSession}
                        disabled={submitting || !newSession.trim() || !isValid}
                        startIcon={submitting ?
                            <Box component="span" sx={{ display: 'flex' }}>
                                <Box
                                    component="span"
                                    sx={{
                                        animation: 'spin 1s linear infinite',
                                        '@keyframes spin': {
                                            '0%': { transform: 'rotate(0deg)' },
                                            '100%': { transform: 'rotate(360deg)' },
                                        },
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        border: '2px solid',
                                        borderColor: 'currentColor',
                                        borderRightColor: 'transparent',
                                    }}
                                />
                            </Box>
                            : <AddIcon />
                        }
                    >
                        {submitting ? 'Adding...' : 'Add Session'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default AddSessionForm;