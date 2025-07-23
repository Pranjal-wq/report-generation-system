import React from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText
} from '@mui/material';
import { SubjectInputData } from '../../../../api/services/Admin/Subject.types';
import { Department } from '../DepartmentTypes';

interface SubjectFormProps {
  form: SubjectInputData;
  departments: Department[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>, isCheckbox?: boolean) => void;
  onSubmit: () => void;
  isEdit: boolean;
  loading?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  form,
  departments,
  onChange,
  onSubmit,
  isEdit,
  loading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Subject Code"
            name="subjectCode"
            value={form.subjectCode}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Subject Name"
            name="subjectName"
            value={form.subjectName}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal" variant="outlined" required disabled={loading}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              name="department"
              value={form.department}
              onChange={(e) => onChange(e as any)} // MUI Select uses a different event structure
              label="Department"
            >
              <MenuItem value="">
                <em>Select Department</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.department} ({dept.cn})
                </MenuItem>
              ))}
            </Select>
            {!form.department && <FormHelperText error>Department is required</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="isElective"
                checked={Boolean(form.isElective)}
                onChange={(e) => onChange(e, true)}
                color="primary"
                disabled={loading}
              />
            }
            label="Is Elective"
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Subject' : 'Create Subject')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SubjectForm;
