import React, { useState, useEffect } from 'react';
import { Department } from '../../DepartmentTypes';
import { updateDepartment } from '../../../../../api/services/Admin/admin';
import { toast } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EditDepartmentModalProps {
    open: boolean;
    onClose: () => void;
    department: Department | null;
    onSuccess: () => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
    open,
    onClose,
    department,
    onSuccess
}) => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentCode, setDepartmentCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (department) {
            setDepartmentName(department.department);
            setDepartmentCode(department.cn);
        }
    }, [department]);

    const handleSubmit = async () => {
        if (!department || !departmentName.trim() || !departmentCode.trim()) {
            toast.error('Department name and code are required');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateDepartment(department._id, {
                department: departmentName,
                cn: departmentCode
            });

            toast.success(`Department "${departmentName}" updated successfully`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating department:', error);
            toast.error(error?.response?.data?.message || 'Failed to update department');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="edit-department-dialog"
            aria-describedby="edit-department-form"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="edit-department-dialog" sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon color="primary" sx={{ mr: 1 }} />
                Edit Department
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 py-2">
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editDepartmentName"
                        label="Department Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="editDepartmentCode"
                        label="Department Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
                        required
                    />
                </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? null : <EditIcon />}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDepartmentModal;