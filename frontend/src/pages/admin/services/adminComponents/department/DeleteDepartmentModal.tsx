import React, { useState } from 'react';
import { Department } from '../../DepartmentTypes';
import { deleteDepartment } from '../../../../../api/services/Admin/admin';
import { toast } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

interface DeleteDepartmentModalProps {
    open: boolean;
    onClose: () => void;
    department: Department | null;
    onSuccess: () => void;
}

const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({
    open,
    onClose,
    department,
    onSuccess
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!department) return;

        setIsDeleting(true);
        try {
            await deleteDepartment(department._id);
            toast.success(`Department "${department.department}" deleted successfully`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error deleting department:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete department');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-department-dialog"
            aria-describedby="delete-department-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="delete-department-dialog" sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                Delete Department
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-department-description">
                    Are you sure you want to delete the department{' '}
                    <strong>{department?.department}</strong>? This action will
                    delete all associated courses, branches, sessions, and data. This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    variant="outlined"
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    disabled={isDeleting}
                    startIcon={isDeleting ? null : <DeleteIcon />}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDepartmentModal;