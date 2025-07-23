// filepath: d:\\att\\Frontend-ReportGeneration\\src\\pages\\admin\\services\\timetable\\EditTimetableDialog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Tabs, // Added Tabs
  Tab, // Added Tab
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FacultyUser } from '../../../../api/services/faculty/Faculty.types';
import { WeeklyTimetable, Subject, DayOfWeek, TimetableSlot } from '../../../../api/services/Admin/Timetable.types';
import { getTimetable, updateTimetable } from '../../../../api/services/Admin/Timetable';
import { DepartmentSubjectDetail } from '../../../../api/services/Admin/Subject.types'; // This is an array of subjects, not department-wise grouped.

interface EditTimetableDialogProps {
  open: boolean;
  onClose: (updated?: boolean) => void; // Modified to optionally indicate if an update occurred
  faculty: FacultyUser | null;
  departmentSpecificSubjects: DepartmentSubjectDetail[];
}

const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper to map DayOfWeek (e.g., "Monday") to numerical key (e.g., "1")
const dayStringToKeyMap: { [key in DayOfWeek]: string } = {
  "Monday": "1",
  "Tuesday": "2",
  "Wednesday": "3",
  "Thursday": "4",
  "Friday": "5",
  "Saturday": "6",
  "Sunday": "7",
};

const EditTimetableDialog: React.FC<EditTimetableDialogProps> = ({
  open,
  onClose,
  faculty,
  departmentSpecificSubjects, // This is expected to be DepartmentSubjectDetail[]
}) => {
  const [timetable, setTimetable] = useState<WeeklyTimetable>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSavingState] = useState(false); // Added for internal saving state
  const [error, setError] = useState<string | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<DayOfWeek>(daysOfWeek[0]); // State for active tab

  const fetchFacultyTimetable = useCallback(async () => {
    if (faculty?._id) {
      setIsLoading(true);
      setError(null); 
      try {
        const response = await getTimetable(faculty._id); // response is GetTimetableResponse
        if (response.status === 'success') {
          // Access timetable from response.data.timetable
          if (response.data && response.data.timetable) {
            const initialTimetable: WeeklyTimetable = {};
            const backendTimetable = response.data.timetable;

            daysOfWeek.forEach((dayString, index) => {
              const backendDayKey = (index + 1).toString(); // Assumes backend uses "1" for Monday, "2" for Tuesday, etc.
              const slotsFromBackend = backendTimetable[backendDayKey] || [];

              initialTimetable[dayString] = slotsFromBackend.map(slot => {
                const newSlot: Partial<TimetableSlot> = { ...slot };

                if (slot.subject && slot.subject._id && typeof slot.subject._id === 'object' && (slot.subject._id as any).$oid) {
                  newSlot.subject = {
                    ...(slot.subject as Subject),
                    _id: (slot.subject._id as any).$oid,
                  };
                } else if (slot.subject && typeof slot.subject._id === 'string') {
                  newSlot.subject = { ...slot.subject } as Subject;
                }

                return {
                  subject: (newSlot.subject as Subject) || null,
                  section: newSlot.section || '',
                  session: newSlot.session || '', // This is the period
                  semester: newSlot.semester || '',
                  branch: newSlot.branch || '',
                  course: newSlot.course || '',
                  timing: newSlot.timing || '', // Default to empty string
                  location: newSlot.location || '', // Default to empty string
                } as TimetableSlot; 
              });
            });
            setTimetable(initialTimetable);
          } else {
            // Status is success, but no timetable data in response.data.timetable
            const emptyTimetable: WeeklyTimetable = {};
            daysOfWeek.forEach(day => {
              emptyTimetable[day] = [];
            });
            setTimetable(emptyTimetable);
            // Optionally, you could set a message here if needed, but not an error for the form to show
            // For example: console.log(response.message); // "TimeTable retrieved successfully" or "Time Table Not Found"
          }
        } else { // response.status === 'error'
          const emptyTimetable: WeeklyTimetable = {};
          daysOfWeek.forEach(day => {
            emptyTimetable[day] = [];
          });
          setTimetable(emptyTimetable);
          setError(response.message || 'Failed to load timetable. Status was error.');
        }
      } catch (err) {
        console.error('Error fetching timetable:', err);
        const emptyTimetable: WeeklyTimetable = {};
        daysOfWeek.forEach(day => {
          emptyTimetable[day] = [];
        });
        setTimetable(emptyTimetable);
        setError('An unexpected error occurred while fetching the timetable.');
      } finally {
        setIsLoading(false);
      }
    } else {
      const emptyTimetable: WeeklyTimetable = {};
      daysOfWeek.forEach(day => {
        emptyTimetable[day] = [];
      });
      setTimetable(emptyTimetable);
    }
  }, [faculty]); // Removed allSubjects from dependency array as it's not used directly in fetch

  useEffect(() => {
    if (open) {
      fetchFacultyTimetable();
      setActiveDayTab(daysOfWeek[0]); // Reset to first day when dialog opens
      setError(null); // Clear previous errors when dialog opens
    }
  }, [open, fetchFacultyTimetable]);

  const handleSlotChange = useCallback((day: DayOfWeek, index: number, field: keyof TimetableSlot, value: any) => {
    setTimetable(prev => {
      const newTimetable = { ...prev };
      const daySlots = [...(newTimetable[day] || [])];
      const slotToUpdate = { ...daySlots[index] } as TimetableSlot;

      if (field === 'subject') {
        // value is expected to be a Subject object or null
        slotToUpdate.subject = value as Subject | null;
      } else {
        (slotToUpdate as any)[field] = value;
      }
      daySlots[index] = slotToUpdate;
      newTimetable[day] = daySlots;
      return newTimetable;
    });
  }, []); // departmentSpecificSubjects is not needed here if full subject object is passed

  const addSlot = useCallback((day: DayOfWeek) => {
    const newSlot: TimetableSlot = {
      subject: null,
      section: '',
      session: '',
      semester: '',
      branch: '',
      course: '',
      timing: '',
      location: '',
    };
    setTimetable(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }));
  }, []);

  const removeSlot = useCallback((day: DayOfWeek, slotIndex: number) => {
    setTimetable(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter((_, index) => index !== slotIndex),
    }));
  }, []);

  const handleSave = async () => {
    if (!faculty?._id) {
      setError("Faculty ID is missing.");
      return;
    }

    setIsSavingState(true);
    setError(null);

    const backendTimetableToSend: WeeklyTimetable = {};

    for (const dayString of daysOfWeek) {
      const dayKey = dayStringToKeyMap[dayString as DayOfWeek];
      const slotsForDay = timetable[dayString] || [];

      backendTimetableToSend[dayKey] = slotsForDay
        .filter(slot => slot.subject?._id && slot.session) // Ensure essential fields are present
        .map(slot => {
          // Ensure subject is correctly formatted (it should be by fetchFacultyTimetable)
          // Ensure all other string fields are present, defaulting to empty string if null/undefined
          return {
            subject: slot.subject, // Assumed to be correct from state
            section: slot.section || '',
            session: slot.session || '',
            semester: slot.semester || '',
            branch: slot.branch || '',
            course: slot.course || '',
            timing: slot.timing || '',
            location: slot.location || '',
          } as TimetableSlot;
        });
    }

    try {
      const response = await updateTimetable(faculty._id, backendTimetableToSend);
      if (response.status === 'success') {
        onClose(true); // Close dialog and indicate success
      } else {
        setError(response.message || 'Failed to save timetable.');
      }
    } catch (err: any) {
      console.error('Error saving timetable:', err);
      setError(err.message || 'An unexpected error occurred while saving the timetable.');
    } finally {
      setIsSavingState(false);
    }
  };

  const handleCloseDialog = () => {
    if (isSaving) return; // Optionally prevent closing while saving
    onClose(); // Pass no argument or false if no update occurred
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: DayOfWeek) => {
    setActiveDayTab(newValue);
  };

  if (!faculty) return null;
  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box>
          <Typography variant="h6" component="div">
            Edit Timetable for {faculty?.name || 'Faculty'}
          </Typography>          <Typography variant="body2" color="textSecondary">
            {faculty?.department} Department • {faculty?.employeeCode}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}            <Tabs
              value={activeDayTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="timetable day tabs"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                mb: 3,
                '& .MuiTab-root': {
                  minWidth: 100,
                  fontWeight: 'medium',
                  textTransform: 'capitalize',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              {daysOfWeek.map((day) => (
                <Tab 
                  label={day} 
                  value={day} 
                  key={day}
                  icon={
                    <Chip 
                      label={(timetable[day] || []).length} 
                      size="small" 
                      color={activeDayTab === day ? "primary" : "default"}
                      sx={{ 
                        minWidth: 24, 
                        height: 20, 
                        fontSize: '0.75rem',
                        '& .MuiChip-label': { px: 0.5 }
                      }}
                    />
                  }
                  iconPosition="end"
                />
              ))}
            </Tabs>{/* Render Cards for activeDayTab */}
            <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
              {(timetable[activeDayTab] || []).length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body2" color="textSecondary">
                    No slots configured for {activeDayTab}. Click "Add Slot" to get started.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(timetable[activeDayTab] || []).map((slot, slotIndex) => (
                    <Card 
                      key={slotIndex} 
                      variant="outlined" 
                      sx={{ 
                        position: 'relative',
                        '&:hover': { 
                          boxShadow: 2,
                          borderColor: 'primary.main'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <CardContent sx={{ pb: 2 }}>
                        {/* Slot Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={`Slot ${slotIndex + 1}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            {slot.subject && (
                              <Chip 
                                label={slot.subject.subjectCode} 
                                size="small" 
                                color="secondary"
                              />
                            )}
                          </Box>
                          <IconButton 
                            onClick={() => removeSlot(activeDayTab, slotIndex)} 
                            color="error" 
                            size="small"
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'error.light',
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Slot Fields */}
                        <Grid container spacing={2}>
                          {/* Period (Session) */}
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Session"
                              value={slot.session}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'session', e.target.value)}
                              size="small"
                              fullWidth
                              variant="outlined"
                              required
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Subject */}
                          <Grid item xs={12} sm={6} md={5}>
                            <FormControl fullWidth size="small" variant="outlined" required>
                              <InputLabel>Subject</InputLabel>
                              <Select
                                value={slot.subject?._id || ''}
                                onChange={(e) => {
                                  const selectedSubjectObj = departmentSpecificSubjects.find(sub => sub._id === e.target.value);
                                  const subjectForSlot: Subject | null = selectedSubjectObj ? {
                                    _id: selectedSubjectObj._id || '',
                                    subjectCode: selectedSubjectObj.subjectCode,
                                    subjectName: selectedSubjectObj.subjectName,
                                    isElective: selectedSubjectObj.isElective,
                                    department: faculty?.department || ''
                                  } : null;
                                  handleSlotChange(activeDayTab, slotIndex, 'subject', subjectForSlot);
                                }}
                                label="Subject"
                                sx={{ 
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                  },
                                }}
                              >
                                <MenuItem value=""><em>Select Subject</em></MenuItem>
                                {departmentSpecificSubjects.map(subject => (
                                  <MenuItem key={subject._id} value={subject._id}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        {subject.subjectName}
                                      </Typography>
                                      <Typography variant="caption" color="textSecondary">
                                        {subject.subjectCode}
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Timing */}
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Timing"
                              value={slot.timing}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'timing', e.target.value)}
                              size="small"
                              fullWidth
                              placeholder="e.g., 09:00-10:00"
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Course */}
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Course"
                              value={slot.course}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'course', e.target.value)}
                              size="small"
                              fullWidth
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Branch */}
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Branch"
                              value={slot.branch}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'branch', e.target.value)}
                              size="small"
                              fullWidth
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Semester */}
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Semester"
                              value={slot.semester}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'semester', e.target.value)}
                              size="small"
                              fullWidth
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Section */}
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Section"
                              value={slot.section}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'section', e.target.value)}
                              size="small"
                              fullWidth
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>

                          {/* Location */}
                          <Grid item xs={12} sm={6} md={12}>
                            <TextField
                              label="Location"
                              value={slot.location}
                              onChange={(e) => handleSlotChange(activeDayTab, slotIndex, 'location', e.target.value)}
                              size="small"
                              fullWidth
                              placeholder="e.g., Room 101, Lab A, Online"
                              variant="outlined"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addSlot(activeDayTab)}
              variant="outlined"
              size="large"
              sx={{ 
                mt: 2, 
                borderStyle: 'dashed',
                py: 1.5,
                '&:hover': {
                  borderStyle: 'solid',
                  bgcolor: 'primary.50'
                }
              }}
              fullWidth
            >
              Add New Slot to {activeDayTab}
            </Button>
          </>
        )}
      </DialogContent>      <DialogActions sx={{ 
        borderTop: 1, 
        borderColor: 'divider', 
        bgcolor: 'grey.50',
        px: 3,
        py: 2,
        gap: 1
      }}>
        <Button 
          onClick={handleCloseDialog} 
          color="secondary" 
          disabled={isSaving}
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isLoading || isSaving}
          size="large"
          sx={{ minWidth: 140 }}
        >
          {isSaving ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Saving...
            </Box>
          ) : (
            'Save Timetable'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTimetableDialog;

