// d:\\att\\Frontend-ReportGeneration\\src\\pages\\admin\\services\\timetable\\TimetableDisplay.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { WeeklyTimetable, TimeSlot, DAY_NAMES, DayNumber } from '../../../../api/services/Admin/Timetable.types';
import SchoolIcon from '@mui/icons-material/School'; // Example Icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Example Icon
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Example Icon
import EventNoteIcon from '@mui/icons-material/EventNote'; // For session

interface TimetableDisplayProps {
  timetable: WeeklyTimetable | null;
  isLoading: boolean;
  error: string | null;
}

const TimetableDisplay: React.FC<TimetableDisplayProps> = ({ timetable, isLoading, error }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" my={2}>
        {error}
      </Typography>
    );
  }

  if (!timetable || Object.keys(timetable).length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No Timetable Data Available
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Please check back later or contact support if you believe this is an error.
        </Typography>
      </Paper>
    );
  }

  const allDays: DayNumber[] = ["1", "2", "3", "4", "5", "6", "7"];
  const completeTimetable: WeeklyTimetable = allDays.reduce((acc, day) => {
    acc[day] = timetable[day] || [];
    return acc;
  }, {} as WeeklyTimetable);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
      <Table stickyHeader aria-label="sticky timetable table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: '120px', backgroundColor: 'primary.main', color: 'common.white' }}>Day</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'common.white' }}>Schedule</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(completeTimetable).map(([day, timeSlots]) => (
            <TableRow key={day} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
              <TableCell component="th" scope="row" sx={{ verticalAlign: 'top', fontWeight: 'medium', p: 1.5 }}>
                {DAY_NAMES[day as DayNumber] || `Day ${day}`}
              </TableCell>
              <TableCell sx={{ p: 1.5 }}>
                {timeSlots && timeSlots.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {timeSlots.map((slot: TimeSlot, index: number) => (
                      <Card key={index} variant="outlined" sx={{ borderRadius: 2, borderColor: 'grey.300' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                            {slot.subject.subjectName} <Chip label={slot.subject.subjectCode} size="small" variant="outlined" />
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              {slot.timing}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              {slot.course} - Sem {slot.semester} ({slot.section})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                             <Typography variant="body2" color="textSecondary" sx={{display: 'flex', alignItems: 'center'}}>
                                Branch: {slot.branch}
                             </Typography>
                          </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                               {slot.location}
                            </Typography>
                          </Box>
                          {slot.session && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <EventNoteIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="textSecondary">
                                Session: {slot.session}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, minHeight: '80px', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      No classes scheduled for this day.
                    </Typography>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimetableDisplay;
