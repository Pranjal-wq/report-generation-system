import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useClassContext } from '../../context/ClassContext';
import axios from 'axios';
import { getSubjectsAccToSection } from '../../api/services/director/director';
import { ownerIdToEmpMap } from '../../api/services/director/director';

// Loading spinner component for dropdown fields
const DropdownLoader = () => (
	<div className="flex items-center justify-center py-2">
		<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
		<span className="ml-2 text-xs text-gray-500">Loading...</span>
	</div>
);

// When the user selects the Class option these fields will come up 
const ClassFields = forwardRef((props, ref) => {
	const { branches } = useClassContext();
	const [selectedBranch, setSelectedBranch] = useState('');
	const [availableSessions, setAvailableSessions] = useState<{ batch: string; sections: string[] }[]>([]);
	const [selectedSession, setSelectedSession] = useState('');
	const [availableSections, setAvailableSections] = useState<string[]>([]);
	const [selectedSection, setSelectedSection] = useState('');
	const [subjects, setSubjects] = useState<{ subCode: string; subjectName: string; subjectId: string; ownerId: string }[]>([]);
	const [selectedSubject, setSelectedSubject] = useState('');
	const [ownerIdToEmpMapData, setOwnerIdToEmpMapData] = useState<any>([]); // Assuming this is the structure of the map

	// Add loading states for each dropdown
	const [isLoadingMap, setIsLoadingMap] = useState(false);
	const [isLoadingSessions, setIsLoadingSessions] = useState(false);
	const [isLoadingSections, setIsLoadingSections] = useState(false);
	const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

	// Expose methods to parent component
	useImperativeHandle(ref, () => ({
		getFormData: () => {
			const selectedSubjectData = subjects.find(subject => subject.subjectId === selectedSubject);

			// Find the employee code for the selected subject's owner
			let employeeCode = '';
			if (selectedSubjectData?.ownerId && ownerIdToEmpMapData.length > 0) {
				const ownerData = ownerIdToEmpMapData.find((item: any) =>
					item._id === selectedSubjectData.ownerId
				);
				employeeCode = ownerData?.employeeCode || '';
			}

			return {
				branch: selectedBranch,
				session: selectedSession,
				section: selectedSection,
				subjectId: selectedSubject,
				ownerId: selectedSubjectData?.ownerId || '',
				employeeCode,
				subjectName: selectedSubjectData?.subjectName || ''
			};
		},

		isFormValid: () => {
			return !!(selectedBranch && selectedSession && selectedSection && selectedSubject);
		}
	}));

	useEffect(() => {
		const fetchOwnerIdToEmpMap = async () => {
			try {
				setIsLoadingMap(true);
				const data = await ownerIdToEmpMap();
				if (data) {
					setOwnerIdToEmpMapData(data);
				}
			} catch (error) {
				console.error("Error fetching owner ID to employee map:", error);
			} finally {
				setIsLoadingMap(false);
			}
		};

		fetchOwnerIdToEmpMap();
	}, []);

	// Add separate useEffect to log when the state actually updates
	useEffect(() => {
		console.log("Owner ID to Emp map data updated:", ownerIdToEmpMapData);
	}, [ownerIdToEmpMapData]);

	// Handle branch change and update available sessions dynamically
	const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const branchValue = e.target.value;
		setSelectedBranch(branchValue);
		setIsLoadingSessions(true);

		// Update sessions based on the selected branch
		const branchData = branches.find((branch) => branch.branch === branchValue);
		setAvailableSessions(branchData ? branchData.sessions : []);
		setSelectedSession('');
		setAvailableSections([]);
		setSubjects([]); // Reset subjects when branch changes
		setIsLoadingSessions(false);
	};

	// Handle session change and update available sections dynamically
	const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const sessionValue = e.target.value;
		setSelectedSession(sessionValue);
		setIsLoadingSections(true);

		// Update sections based on the selected session
		const sessionData = availableSessions.find((session) => session.batch === sessionValue);
		setAvailableSections(sessionData ? sessionData.sections : []);
		setSubjects([]); // Reset subjects when session changes
		setIsLoadingSections(false);
	};

	// Handle section change and fetch subjects from the backend
	const handleSectionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const sectionValue = e.target.value;
		setSelectedSection(sectionValue);

		// Fetch subjects based on selected branch, session, and section
		if (selectedBranch && selectedSession && sectionValue) {
			try {
				setIsLoadingSubjects(true);
				const response = await getSubjectsAccToSection(
					selectedBranch,
					selectedSession,
					sectionValue
				);
				if (response && Array.isArray(response.subjects)) {
					setSubjects(response.subjects); // Ensure subjects are correctly set
				} else {
					setSubjects([]);
				}
			} catch (error) {
				console.error('Error fetching subjects:', error);
				setSubjects([]);
			} finally {
				setIsLoadingSubjects(false);
			}
		}
	};

	// Handle subject selection
	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubject(e.target.value);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{/* Branch (Dynamic) */}
			<div className="flex flex-col">
				<label htmlFor="Branch" className="text-sm font-medium text-gray-700 mb-1">Branch</label>
				<select
					id="Branch"
					value={selectedBranch}
					onChange={handleBranchChange}
					className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm ${branches.length === 0 ? 'cursor-not-allowed opacity-70' : ''}`}
					disabled={branches.length === 0}
				>
					<option value="">Select Branch</option>
					{branches.map((item) => (
						<option key={item.branch} value={item.branch}>
							{item.branch}
						</option>
					))}
				</select>
				{branches.length === 0 && <DropdownLoader />}
			</div>

			{/* Session (Dynamic based on selected branch) */}
			<div className="flex flex-col">
				<label htmlFor="classSession" className="text-sm font-medium text-gray-700 mb-1">Session</label>
				<select
					id="classSession"
					value={selectedSession}
					onChange={handleSessionChange}
					className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm ${(isLoadingSessions || !selectedBranch) ? 'cursor-not-allowed opacity-70' : ''}`}
					disabled={isLoadingSessions || !selectedBranch}
				>
					<option value="">Select Session</option>
					{availableSessions.map((session) => (
						<option key={session.batch} value={session.batch}>
							{session.batch}
						</option>
					))}
				</select>
				{isLoadingSessions && <DropdownLoader />}
			</div>

			{/* Section (Dynamic based on selected session) */}
			<div className="flex flex-col">
				<label htmlFor="classSection" className="text-sm font-medium text-gray-700 mb-1">Section</label>
				<select
					id="classSection"
					value={selectedSection}
					onChange={handleSectionChange}
					className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm ${(isLoadingSections || !selectedSession) ? 'cursor-not-allowed opacity-70' : ''}`}
					disabled={isLoadingSections || !selectedSession}
				>
					<option value="">Select Section</option>
					{availableSections.map((section) => (
						<option key={section} value={section}>
							{section}
						</option>
					))}
				</select>
				{isLoadingSections && <DropdownLoader />}
			</div>

			{/* Subject (Dynamic based on selected branch, session, and section) */}
			<div className="flex flex-col">
				<label htmlFor="classSubject" className="text-sm font-medium text-gray-700 mb-1">Subject</label>
				<select
					id="classSubject"
					value={selectedSubject}
					onChange={handleSubjectChange}
					className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm ${(isLoadingSubjects || !selectedSection) ? 'cursor-not-allowed opacity-70' : ''}`}
					disabled={isLoadingSubjects || !selectedSection}
				>
					<option value="">Select Subject</option>
					{subjects.map((subject) => (
						<option key={subject.subjectId} value={subject.subjectId}>
							{subject.subjectName}
						</option>
					))}
				</select>
				{isLoadingSubjects && <DropdownLoader />}
			</div>
		</div>
	);
});

ClassFields.displayName = 'ClassFields';

export default ClassFields;