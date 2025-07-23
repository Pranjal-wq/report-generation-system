import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Subject } from '../../../../api/services/Admin/Subject.types';
import { Department } from '../DepartmentTypes';

interface SubjectTableProps {
  subjects: Subject[];
  departments: Department[];
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (subject: Subject) => void;
  loading?: boolean;
}

const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  departments,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  loading = false,
}) => {
  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d._id === departmentId);
    return dept ? `${dept.department} (${dept.cn})` : departmentId;
  };

  if (loading && subjects.length === 0) {
    return <Typography sx={{ textAlign: 'center', my: 2 }}>Loading subjects...</Typography>;
  }
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2, height: 'fit-content', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }} elevation={3}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto', flex: '1 1 auto' }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650, tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '15%', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '15%', backgroundColor: 'rgba(248, 248, 248, 0.9)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={subject._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                <TableCell sx={{ width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.subjectCode}</TableCell>
                <TableCell sx={{ width: '25%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.subjectName}</TableCell>
                <TableCell sx={{ width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDepartmentName(subject.department)}</TableCell>
                <TableCell sx={{ width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Chip
                    label={subject.isElective ? 'Elective' : 'Core'}
                    color={subject.isElective ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', width: '15%' }}>
                  <IconButton onClick={() => onEdit(subject)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && subjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ 
          borderTop: '1px solid rgba(224, 224, 224, 1)',
          flexShrink: 0,
          minHeight: '52px' 
        }}
      />
    </Paper>
  );
};

export default SubjectTable;
