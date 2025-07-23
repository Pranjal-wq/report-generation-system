// d:\\att\\Frontend-ReportGeneration\\src\\pages\\admin\\services\\timetable\\FacultyTimetableDialog.tsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import useTimetable from './timetableHooks';
import TimetableDisplay from './TimetableDisplay';
import { FacultyUser } from '../../../../api/services/faculty/Faculty.types';

interface FacultyTimetableDialogProps {
  open: boolean;
  onClose: () => void;
  faculty: FacultyUser | null;
}

const FacultyTimetableDialog: React.FC<FacultyTimetableDialogProps> = ({
  open,
  onClose,
  faculty,
}) => {
  const { timetable, isLoading, error, fetchTimetable } = useTimetable();

  useEffect(() => {
    if (open && faculty?._id) {
      fetchTimetable(faculty._id);
    } else if (!open) {
      // Potentially clear timetable or other state if needed when dialog closes
    }
  }, [open, faculty, fetchTimetable]);

  const effectiveTimetableToDisplay = timetable;

  const handleMainDialogClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleMainDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          Timetable for {faculty?.name || 'Faculty'}
          {faculty?.empCode && ` (${faculty.empCode})`}
        </DialogTitle>
        <DialogContent dividers>
          {faculty ? (
            <TimetableDisplay
              timetable={effectiveTimetableToDisplay}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <Typography>No faculty selected.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button onClick={handleMainDialogClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FacultyTimetableDialog;
