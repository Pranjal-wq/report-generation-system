import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Alert, Typography, Chip, Box
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ValidationResult {
    session: string;
    valid: boolean;
    error?: string;
}

interface BulkSessionInputProps {
    open: boolean;
    onClose: () => void;
    onBulkUpload: (sessions: string[]) => void;
    courseDuration: number | null;
    isUploading: boolean;
    validateSessionFormat: (session: string, duration?: number) => boolean;
}

const BulkSessionInput: React.FC<BulkSessionInputProps> = ({
    open,
    onClose,
    onBulkUpload,
    courseDuration,
    isUploading,
    validateSessionFormat
}) => {
    const [sessionInput, setSessionInput] = useState<string>('');
    const [sessions, setSessions] = useState<string[]>([]);
    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [example, setExample] = useState<string>('');

    // Generate an example based on selected course duration
    useEffect(() => {
        if (courseDuration) {
            const currentYear = new Date().getFullYear();
            const endYear = currentYear + courseDuration;
            setExample(`${currentYear}-${endYear.toString().slice(-2)} or ${currentYear}-${endYear}`);
        } else {
            setExample('2022-26 or 2022-2026');
        }
    }, [courseDuration]);

    // Parse and validate sessions when input changes
    useEffect(() => {
        if (!sessionInput.trim()) {
            setSessions([]);
            setValidationResults([]);
            setIsValid(false);
            return;
        }

        // Split by newlines, commas, or semicolons and trim whitespace
        const parsed = sessionInput
            .split(/[\n,;]/)
            .map(s => s.trim())
            .filter(Boolean);

        setSessions(parsed);

        // Validate each session
        if (courseDuration) {
            const results = parsed.map(session => {
                const isValid = validateSessionFormat(session, courseDuration);
                return {
                    session,
                    valid: isValid,
                    error: isValid ? undefined : `Invalid format for a ${courseDuration}-year program`
                };
            });

            setValidationResults(results);
            setIsValid(results.every(r => r.valid));
        } else {
            setValidationResults([]);
            setIsValid(false);
        }
    }, [sessionInput, courseDuration, validateSessionFormat]);

    const handleBulkUpload = () => {
        if (sessions.length > 0 && isValid) {
            onBulkUpload(sessions);
        }
    };

    const validCount = validationResults.filter(r => r.valid).length;
    const invalidCount = validationResults.filter(r => !r.valid).length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Bulk Add Sessions</DialogTitle>
            <DialogContent>
                <div className="mb-4">
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Enter multiple sessions below, separated by new lines, commas, or semicolons.
                    </Typography>
                    <Typography variant="body2" color="primary" gutterBottom>
                        Example format: {example}
                    </Typography>
                </div>

                <TextField
                    label="Enter Sessions"
                    multiline
                    rows={6}
                    fullWidth
                    variant="outlined"
                    value={sessionInput}
                    onChange={(e) => setSessionInput(e.target.value)}
                    placeholder={`Enter multiple sessions here, for example:\n${example}\n2023-27\n2024-28`}
                />

                {sessions.length > 0 && validationResults.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                            Validation Results:
                        </Typography>

                        {isValid ? (
                            <Alert severity="success">
                                All {sessions.length} sessions are valid.
                            </Alert>
                        ) : (
                            <Alert severity="error">
                                {invalidCount} out of {sessions.length} sessions have invalid format.
                            </Alert>
                        )}

                        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                            {validationResults.map((result, index) => (
                                <Chip
                                    key={index}
                                    label={result.session}
                                    color={result.valid ? "success" : "error"}
                                    size="small"
                                    title={result.error || "Valid session"}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={isUploading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleBulkUpload}
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    disabled={isUploading || !isValid || sessions.length === 0}
                >
                    {isUploading ? 'Uploading...' : `Upload ${sessions.length} Sessions`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkSessionInput;