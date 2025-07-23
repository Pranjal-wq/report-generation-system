import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Users, GraduationCap, Archive, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import StudentFields from './StudentFields';
import FacultyFields from './FacultyFields';
import ClassFields from './ClassFields';
import { useToast } from '../../context/ToastContext';
import { getClassReport } from '../../api/services/faculty/Faculty';

export type UserType = 'student' | 'faculty' | 'class' | null;

interface InputSectionProps {
	onSubmit?: (scholarNumber: string, semester: string) => void;
	onFacultyReport?: (reportData: any) => void;
	onUserTypeSelected?: (type: UserType) => void;
	onFacultyReportLoadStart?: () => void;
	onClassReport?: (reportData: any) => void;
	onClassReportLoadStart?: () => void;
}

const InputSection = ({ onSubmit, onFacultyReport, onUserTypeSelected, onFacultyReportLoadStart, onClassReport, onClassReportLoadStart }: InputSectionProps) => {
	const [selectedType, setSelectedType] = useState<UserType>(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [studentScholarNumber, setStudentScholarNumber] = useState('');
	const [studentSemester, setStudentSemester] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const facultyRef = useRef<any>(null);
	const classRef = useRef<any>(null);
	const toast = useToast();

	const handleFormSubmit = useCallback(async () => {
		if (isLoading) return;

		if (selectedType === 'student') {
			if (!studentScholarNumber.trim()) {
				toast.showError("Please enter a scholar number", "student-missing-field");
				return;
			}

			setIsLoading(true);
			toast.showInfo("Fetching Student  Details...", "student-report-loading");

			try {
				await onSubmit?.(studentScholarNumber, studentSemester);
				toast.showSuccess("Student data loaded successfully", "student-report-success");
			} catch (error) {
				toast.showError("Failed to fetch student details", "student-report-error");
				console.error("Error in student submission:", error);
			} finally {
				setIsLoading(false);
			}
		} else if (selectedType === 'faculty') {
			onFacultyReportLoadStart?.(); // Reset faculty report
			setIsLoading(true);
			try {
				const report = await facultyRef.current.submitAttendance();
				if (report) {
					onFacultyReport?.(report);
				}
			} catch (error) {
				toast.showError("An unexpected error occurred", "faculty-report-unexpected-error");
				console.error("Error in faculty submission:", error);
			} finally {
				// Always reset loading state regardless of success or failure
				setIsLoading(false);
			}
		} else if (selectedType === 'class') {
			if (classRef.current && classRef.current.isFormValid()) {
				onClassReportLoadStart?.(); // Reset class report
				setIsLoading(true);
				try {
					const classData = classRef.current.getFormData();
					console.log("Class Submission Data:", classData);
					const classReportData = await getClassReport(classData.employeeCode, classData.subjectId, classData.branch, classData.section);
					console.log("Class Report Data:", classReportData);
					onClassReport?.(classReportData);
					toast.showSuccess("Class data loaded successfully", "class-data-success");
				} catch (error) {
					toast.showError("Failed to process class data", "class-data-error");
					console.error("Error in class submission:", error);
				} finally {
					setIsLoading(false);
				}
			} else {
				toast.showError("Please fill all required fields", "class-missing-fields");
			}
		}
	}, [selectedType, studentScholarNumber, studentSemester, onSubmit, onFacultyReport, onClassReport, onClassReportLoadStart, isLoading, toast, onFacultyReportLoadStart]);

	const debouncedSubmit = useMemo(() => debounce(handleFormSubmit, 300), [handleFormSubmit]);

	useEffect(() => {
		return () => {
			debouncedSubmit.cancel();
		};
	}, [debouncedSubmit]);

	// Reset loading state when switching between user types
	useEffect(() => {
		setIsLoading(false);
	}, [selectedType]);

	return (
		<div className="bg-white rounded-lg shadow-lg">
			<div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
				<h2 className="text-2xl font-bold text-gray-900">Input Section</h2>
				{isCollapsed ? <ChevronDown className="w-6 h-6 text-gray-500" /> : <ChevronUp className="w-6 h-6 text-gray-500" />}
			</div>

			{!isCollapsed && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						debouncedSubmit();
					}}
					className="p-6 pt-0"
				>
					{/* User Type Selection */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
						<button
							type="button"
							onClick={() => {
								setSelectedType('student');
								onUserTypeSelected?.('student');
							}}
							className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedType === 'student'
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
								}`}
						>
							<GraduationCap className="w-6 h-6 mr-2" />
							<span className="font-medium">Student</span>
						</button>
						<button
							type="button"
							onClick={() => {
								setSelectedType('faculty');
								onUserTypeSelected?.('faculty');
							}}
							className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedType === 'faculty'
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
								}`}
						>
							<Users className="w-6 h-6 mr-2" />
							<span className="font-medium">Faculty</span>
						</button>
						<button
							type="button"
							onClick={() => {
								setSelectedType('class');
								onUserTypeSelected?.('class');
							}}
							className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedType === 'class'
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
								}`}
						>
							<Archive className="w-6 h-6 mr-2" />
							<span className="font-medium">Class</span>
						</button>
					</div>

					{/* Dynamic Form Fields */}
					{selectedType === 'student' && (
						<StudentFields
							scholarNumber={studentScholarNumber}
							onScholarNumberChange={setStudentScholarNumber}
							semester={studentSemester}
							onSemesterChange={setStudentSemester}
						/>
					)}
					{selectedType === 'faculty' && <FacultyFields ref={facultyRef} />}
					{selectedType === 'class' && <ClassFields ref={classRef} />}

					{/* Submit Button */}
					{selectedType && (
						<div className="mt-6">
							<button
								type="submit"
								disabled={isLoading}
								className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors ${isLoading
									? 'bg-blue-400 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700'
									} text-white`}
							>
								{isLoading && (
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								)}
								{isLoading ? 'Loading...' : 'Submit'}
							</button>
						</div>
					)}
				</form>
			)}
		</div>
	);
};

export default InputSection;