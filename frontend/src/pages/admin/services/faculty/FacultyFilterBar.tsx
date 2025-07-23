import React from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Toolbar, Typography, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface FacultyFilterBarProps {
  searchTerm: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  departmentFilter: string;
  onDepartmentChange: (event: any) => void;
  departments: { _id: string, count: number }[];
}

const FacultyFilterBar: React.FC<FacultyFilterBarProps> = ({ searchTerm, onSearch, departmentFilter, onDepartmentChange, departments }) => (
  <Toolbar sx={{ 
    pl: { sm: 2 }, 
    pr: { xs: 1, sm: 1 },
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    backgroundColor: 'rgba(248, 248, 248, 0.7)'
  }}>
    <Typography
      sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
      variant="h6"
      id="tableTitle"
      component="div"
    >
      Faculty List
    </Typography>
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="filter-department-label">Department</InputLabel>
      <Select
        labelId="filter-department-label"
        value={departmentFilter}
        label="Department"
        onChange={onDepartmentChange}
        size="small"
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept._id} value={dept._id}>
            {dept._id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      placeholder="Search faculty"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={onSearch}
      sx={{ ml: 1 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Toolbar>
);

export default FacultyFilterBar;
