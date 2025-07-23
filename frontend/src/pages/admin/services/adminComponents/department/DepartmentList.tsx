import React from 'react';
import { Department } from '../../DepartmentTypes';
import ExportButton from '../../../../../components/ui/ExportButton';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface DepartmentListProps {
    departments: Department[];
    isLoading: boolean;
    onEdit: (department: Department) => void;
    onDelete: (department: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
    departments,
    isLoading,
    onEdit,
    onDelete
}) => {
    const exportColumns = React.useMemo(() => [
        { header: 'Department Name', dataKey: 'department' },
        { header: 'Department Code', dataKey: 'cn' },
    ], []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    if (departments.length === 0) {
        return <p className="text-gray-500 py-4">No departments found</p>;
    }

    return (
        <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden md:rounded-lg">
                    {/* Mobile view */}
                    <div className="md:hidden space-y-4">
                        <div className="flex justify-end mb-4">
                            <ExportButton
                                data={departments}
                                columns={exportColumns}
                                fileName="Departments"
                                title="Department List"
                                buttonText="Export"
                                buttonVariant="contained"
                                buttonColor="primary"
                                buttonSize="small"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            />
                        </div>
                        {departments.map((dept) => (
                            <div key={dept._id} className="bg-white p-4 rounded border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{dept.department}</h3>
                                        <Chip
                                            label={dept.cn}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <IconButton
                                            color="primary"
                                            aria-label={`Edit ${dept.department} department`}
                                            onClick={() => onEdit(dept)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            aria-label={`Delete ${dept.department} department`}
                                            onClick={() => onDelete(dept)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop view */}
                    <div className="hidden md:block">
                        <div className="flex justify-end mb-4">
                            <ExportButton
                                data={departments}
                                columns={exportColumns}
                                fileName="Departments"
                                title="Department List"
                                buttonText="Export"
                                buttonVariant="contained"
                                buttonColor="primary"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            />
                        </div>
                        <Table sx={{ minWidth: 650 }} aria-label="departments table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Department Name</TableCell>
                                    <TableCell>Department Code</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {departments.map((dept) => (
                                    <TableRow
                                        key={dept._id}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {dept.department}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={dept.cn}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label={`Edit ${dept.department} department`}
                                                onClick={() => onEdit(dept)}
                                                size="small"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                aria-label={`Delete ${dept.department} department`}
                                                onClick={() => onDelete(dept)}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentList;