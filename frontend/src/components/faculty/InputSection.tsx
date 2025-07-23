




import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, FileText, Archive, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getTimetable } from '../../api/services/faculty/Faculty';
import ClassFields from './ClassFields';

type TabType = 'timetable' | 'selfReport' | 'class';

// Add interface for subject option
interface SubjectOption {
    id: string;
    name: string;
}

interface InputSectionProps {
    onTimetableSubmit?: (data: any) => void;
    onSelfReportSubmit?: (data: any) => void;
    onClassSubmit?: (data: any) => void;
    onTabChange?: (tab: TabType) => void; // Add new prop for tab change
    empCode?: String;
}

const InputSection = ({ onTimetableSubmit, onSelfReportSubmit, onClassSubmit, onTabChange, empCode }: InputSectionProps) => {
    const [selectedTab, setSelectedTab] = useState<TabType>('timetable');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [reportRange, setReportRange] = useState({
        startDate: '',
        endDate: new Date().toISOString(),
    });

    const [classSemesterOptions, setClassSemesterOptions] = useState<string[]>([]);
    const [classBranchOptions, setClassBranchOptions] = useState<string[]>([]);
    const [classSectionOptions, setClassSectionOptions] = useState<string[]>([]);
    // Change to store objects with id and name
    const [classSubjectOptions, setClassSubjectOptions] = useState<SubjectOption[]>([]);

    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    // Store subjectId instead of subjectName
    const [selectedSubject, setSelectedSubject] = useState('');

    const [classSessions, setClassSessions] = useState<any[]>([]);

    const showToast = (toastId: any, message: string, type: "success" | "error") => {
        toast.update(toastId, {
            render: message,
            type,
            isLoading: false,
            autoClose: 3000,
            className: type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
        });
    };

    const handleSubmit = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);

        // Validate inputs for self report
        if (selectedTab === 'selfReport' && !reportRange.startDate) {
            toast.warning('Please select a start date', {
                position: window.innerWidth < 768 ? "bottom-center" : "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: 'toast-message',
            });
            setIsLoading(false);
            return;
        }

        try {
            // Use info type for blue background during loading
            const toastId = toast.loading(`Processing ${selectedTab} data...`, {
                position: window.innerWidth < 768 ? "bottom-center" : "top-right",
                // Apply custom styling for blue background
                className: 'bg-blue-600 text-white',
                // Setting the type to info for blue styling when using theme="colored"
                type: "info",
            });

            if (selectedTab === 'timetable') {
                await onTimetableSubmit?.(empCode);
                showToast(toastId, "Timetable data processed successfully!", "success");
            } else if (selectedTab === 'selfReport') {
                await onSelfReportSubmit?.({ startDate: reportRange.startDate, endDate: reportRange.endDate });
                showToast(toastId, "Self-report data processed successfully!", "success");
            } else if (selectedTab === 'class') {
                // Pass class details to onClassSubmit callback
                await onClassSubmit?.({
                    branch: selectedBranch,
                    section: selectedSection,
                    subjectId: selectedSubject // This will now correctly be the subject ID
                });
                showToast(toastId, "Class data processed successfully!", "success");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            showToast(toastId, `Error processing ${selectedTab} data. Please try again.`, "error");
        } finally {
            setIsLoading(false);
        }
    }, [selectedTab, isLoading, onTimetableSubmit, onSelfReportSubmit, onClassSubmit, reportRange, empCode, selectedBranch, selectedSection, selectedSubject]);

    const debouncedSubmit = useMemo(() => (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
    }, [handleSubmit]);

    useEffect(() => {
        setIsLoading(false);
    }, [selectedTab]);

    useEffect(() => {
        if (selectedTab === 'class' && empCode) {
            getTimetable(empCode as string)
                .then((data) => {
                    const sessions = Object.values(data?.TimeTable || data || {}).flat();
                    setClassSessions(sessions); // store raw data
                })
                .catch(console.error);
        }
    }, [selectedTab, empCode]);

    // Derive semester options from classSessions
    useEffect(() => {
        if (classSessions.length === 0) {
            setClassSemesterOptions([]);
            setSelectedSemester('');
            return;
        }
        const semesters = new Set<string>();
        classSessions.forEach((item: any) => {
            if (item.semester) semesters.add(item.semester);
        });
        setClassSemesterOptions([...semesters]);
        setSelectedSemester('');
    }, [classSessions]);

    // Branch options depend on selectedSemester
    useEffect(() => {
        if (!selectedSemester) {
            setClassBranchOptions([]);
            setSelectedBranch('');
            setClassSectionOptions([]);
            setSelectedSection('');
            setClassSubjectOptions([]);
            setSelectedSubject('');
            return;
        }
        const filtered = classSessions.filter((s) => s.semester === selectedSemester);
        const branches = new Set<string>();
        filtered.forEach((f: any) => {
            if (f.branch) branches.add(f.branch);
        });
        setClassBranchOptions([...branches]);
        setSelectedBranch('');
        setClassSectionOptions([]);
        setSelectedSection('');
        setClassSubjectOptions([]);
        setSelectedSubject('');
    }, [selectedSemester, classSessions]);

    // Section options depend on selectedBranch
    useEffect(() => {
        if (!selectedBranch) {
            setClassSectionOptions([]);
            setSelectedSection('');
            setClassSubjectOptions([]);
            setSelectedSubject('');
            return;
        }
        const filtered = classSessions.filter(
            (s) => s.semester === selectedSemester && s.branch === selectedBranch
        );
        const sections = new Set<string>();
        filtered.forEach((f: any) => {
            if (f.section) sections.add(f.section);
        });
        setClassSectionOptions([...sections]);
        setSelectedSection('');
        setClassSubjectOptions([]);
        setSelectedSubject('');
    }, [selectedBranch, selectedSemester, classSessions]);

    // Subject options depend on selectedSection
    useEffect(() => {
        if (!selectedSection) {
            setClassSubjectOptions([]);
            setSelectedSubject('');
            return;
        }
        const filtered = classSessions.filter(
            (s) =>
                s.semester === selectedSemester &&
                s.branch === selectedBranch &&
                s.section === selectedSection
        );

        // Use Map to prevent duplicates with the same ID
        const subjectsMap = new Map<string, SubjectOption>();

        filtered.forEach((f: any) => {
            if (f.subject?._id && f.subject?.subjectName) {
                subjectsMap.set(f.subject._id, {
                    id: f.subject._id,
                    name: f.subject.subjectName
                });
            }
        });

        setClassSubjectOptions(Array.from(subjectsMap.values()));
        setSelectedSubject('');
    }, [selectedSection, selectedBranch, selectedSemester, classSessions]);

    // Responsive toast position handler
    useEffect(() => {
        const handleResize = () => {
            // This will help handle position changes if needed
            // without needing to update any existing toasts
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update this function to call onTabChange
    const handleTabChange = (tab: TabType) => {
        setSelectedTab(tab);

        // Map InputSection tab to Dashboard activeTab - correctly map tab names
        if (onTabChange) {
            if (tab === 'timetable') {
                onTabChange('timetable');
            } else if (tab === 'selfReport') {
                onTabChange('faculty-report');
            } else if (tab === 'class') {
                onTabChange('class-report');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div 
                className="p-6 flex justify-between items-center cursor-pointer" 
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h2 className="text-2xl font-bold text-gray-900">Input Section</h2>
                {isCollapsed ? <ChevronDown className="w-6 h-6 text-gray-500" /> : <ChevronUp className="w-6 h-6 text-gray-500" />}
            </div>
            
            {/* Smooth Collapse Animation */}
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'
                }`}
            >
                <form onSubmit={debouncedSubmit} className="p-6 pt-0">
                    {/* Tab Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => handleTabChange('timetable')}
                            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedTab === 'timetable'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
                        >
                            <Calendar className="w-6 h-6 mr-2" />
                            <span className="font-medium">Timetable</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('selfReport')}
                            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedTab === 'selfReport'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
                        >
                            <FileText className="w-6 h-6 mr-2" />
                            <span className="font-medium">SelfReport</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('class')}
                            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedTab === 'class'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
                        >
                            <Archive className="w-6 h-6 mr-2" />
                            <span className="font-medium">Class</span>
                        </button>
                    </div>

                    {/* Dynamic Tab Content */}
                    {selectedTab === 'timetable' && (
                        <div>
                            <p>Timetable content goes here.</p>
                        </div>
                    )}
                    {selectedTab === 'selfReport' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="mb-2">
                                <label className="block mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={reportRange.startDate}
                                    onChange={e => setReportRange({ ...reportRange, startDate: e.target.value })}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={reportRange.endDate.split('T')[0]}
                                    onChange={e => setReportRange({ ...reportRange, endDate: new Date(e.target.value).toISOString() })}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </div>
                    )}
                    {selectedTab === 'class' && (
                        <div className="p-4 border rounded-md bg-gray-50">
                            <ClassFields
                                classSemesterOptions={classSemesterOptions}
                                classBranchOptions={classBranchOptions}
                                classSectionOptions={classSectionOptions}
                                classSubjectOptions={classSubjectOptions}
                                selectedSemester={selectedSemester}
                                setSelectedSemester={setSelectedSemester}
                                selectedBranch={selectedBranch}
                                setSelectedBranch={setSelectedBranch}
                                selectedSection={selectedSection}
                                setSelectedSection={setSelectedSection}
                                selectedSubject={selectedSubject}
                                setSelectedSubject={setSelectedSubject}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputSection;
