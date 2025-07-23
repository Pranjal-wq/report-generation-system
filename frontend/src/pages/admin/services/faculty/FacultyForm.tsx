import React, { useState } from "react";
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Collapse,
  IconButton,
  Typography
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { CreateFacultyData } from "../../../../api/services/faculty/Faculty.types";

interface FacultyFormProps {
  form: CreateFacultyData[0];
  departments: { _id: string, count: number }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onSubmit: () => void;
  isEdit?: boolean;
  title?: string;
}

const FacultyForm: React.FC<FacultyFormProps> = ({ 
  form, 
  departments, 
  onChange, 
  onSubmit, 
  isEdit, 
  title = "Faculty Form" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'grey.300', 
      borderRadius: 2, 
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Header with toggle button */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 1.5,
          bgcolor: 'grey.50',
          cursor: 'pointer'
        }}
        onClick={toggleExpanded}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ p: 0.5 }}>
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>      {/* Collapsible form content */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 3 }}>
          {/* Row 1: Name and Employee Code */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
            />
            <TextField
              label="Employee Code"
              name="empCode"
              value={form.empCode}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>          {/* Row 2: Email and Phone */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
              type="email"
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Row 3: Abbreviation and Role */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              label="Abbreviation"
              name="abbreviation"
              value={form.abbreviation}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
            />
            <TextField
              label="Role"
              name="role"
              value={form.role}
              onChange={onChange}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Row 4: Department and Password */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <FormControl fullWidth size="small">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="department"
                value={form.department}
                onChange={onChange}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept._id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={onChange}
              fullWidth
              size="small"
              type="password"
              variant="outlined"
              helperText={isEdit ? "Leave empty to keep current password" : ""}
            />
          </Box>          {/* Submit Button */}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onSubmit} 
            fullWidth 
            size="medium"
            sx={{ mt: 2, py: 1.2 }}
          >
            {isEdit ? "Update Faculty" : "Create Faculty"}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FacultyForm;
