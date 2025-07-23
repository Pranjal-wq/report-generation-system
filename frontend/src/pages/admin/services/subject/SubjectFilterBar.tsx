import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Department } from '../DepartmentTypes';

interface SubjectFilterBarProps {
  searchTerm: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  departmentFilter: string;
  onDepartmentChange: (event: any) => void; // MUI Select uses 'any' for event
  electiveFilter: string; // "all", "true", "false"
  onElectiveChange: (event: any) => void;
  departments: Department[];
}

const SubjectFilterBar: React.FC<SubjectFilterBarProps> = ({
  searchTerm,
  onSearch,
  departmentFilter,
  onDepartmentChange,
  electiveFilter,
  onElectiveChange,
  departments,
}) => {
  return (
    <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Code/Name"
            value={searchTerm}
            onChange={onSearch}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ minWidth: 200 }}> {/* Added minWidth for fixed size feel, adjust as needed */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="department-filter-label">Department</InputLabel>
            <Select
              labelId="department-filter-label"
              value={departmentFilter}
              onChange={onDepartmentChange}
              label="Department"
              name="departmentFilter" // Added name for consistency
              sx={{
                '& .MuiSelect-select': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              }}
              renderValue={(selected) => {
                if (selected === "") {
                  return <em>All Departments</em>;
                }
                const dept = departments.find(d => d._id === selected);
                return dept ? `${dept.department} (${dept.cn})` : "";
              }}
            >
              <MenuItem value="">
                <em>All Departments</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id} sx={{maxWidth: 300 /* Adjust if needed for dropdown list items */}}>
                  {dept.department} ({dept.cn})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="elective-filter-label">Type</InputLabel>
            <Select
              labelId="elective-filter-label"
              value={electiveFilter}
              onChange={onElectiveChange}
              label="Type"
              name="electiveFilter" // Added name for consistency
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="true">Elective</MenuItem>
              <MenuItem value="false">Core</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubjectFilterBar;
