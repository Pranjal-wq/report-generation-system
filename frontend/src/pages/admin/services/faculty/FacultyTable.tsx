import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button } from "@mui/material";
import { FacultyUser } from "../../../../api/services/faculty/Faculty.types";

interface FacultyTableProps {
  faculties: FacultyUser[];
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (faculty: FacultyUser) => void;
}

const FacultyTable: React.FC<FacultyTableProps> = ({ faculties, page, rowsPerPage, count, onPageChange, onRowsPerPageChange, onEdit }) => (
  <Paper sx={{ width: '100%', height: 'fit-content', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }} elevation={3}>
    <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto', flex: '1 1 auto' }}>
      <Table stickyHeader sx={{ minWidth: 650, tableLayout: 'fixed', width: '100%' }} aria-labelledby="tableTitle" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '15%' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '20%' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '15%' }}>Department</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '15%' }}>Employee Code</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '10%' }}>Abbreviation</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '15%' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(248, 248, 248, 0.9)', width: '10%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {faculties.map((faculty) => (
            <TableRow
              hover
              key={faculty._id || faculty.empCode || `${faculty.name}-${faculty.email}`}
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.name}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.email}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.department}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.empCode || faculty.employeeCode}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.abbreviation}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.phone}</TableCell>
              <TableCell>
                <Button 
                  size="small" 
                  variant="outlined"
                  color="primary"
                  onClick={() => onEdit(faculty)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {faculties.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                No faculty found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
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

export default FacultyTable;
