import React from 'react';
import { Info } from 'lucide-react';

interface SubjectOption {
    id: string;
    name: string;
}

interface ClassFieldsProps {
    classSemesterOptions: string[];
    classBranchOptions: string[];
    classSectionOptions: string[];
    classSubjectOptions: SubjectOption[];
    selectedSemester: string;
    setSelectedSemester: (semester: string) => void;
    selectedBranch: string;
    setSelectedBranch: (branch: string) => void;
    selectedSection: string;
    setSelectedSection: (section: string) => void;
    selectedSubject: string;
    setSelectedSubject: (subjectId: string) => void;
}

const ClassFields: React.FC<ClassFieldsProps> = ({
    classSemesterOptions,
    classBranchOptions,
    classSectionOptions,
    classSubjectOptions,
    selectedSemester,
    setSelectedSemester,
    selectedBranch,
    setSelectedBranch,
    selectedSection,
    setSelectedSection,
    selectedSubject,
    setSelectedSubject,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                    <label>
                        Semester <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-black text-white text-sm rounded-lg p-2 z-10">
                            Start by selecting the semester. This will enable the branch selection.
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <select
                    value={selectedSemester}
                    onChange={(e) => {
                        setSelectedSemester(e.target.value);
                        setSelectedBranch('');
                        setSelectedSection('');
                        setSelectedSubject('');
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">Select Semester</option>
                    {classSemesterOptions.map((semester) => (
                        <option key={semester} value={semester}>
                            {semester}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                    <label>
                        Branch <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-black text-white text-sm rounded-lg p-2 z-10">
                            Select your branch after choosing a semester. This will enable section selection.
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <select
                    value={selectedBranch}
                    onChange={(e) => {
                        setSelectedBranch(e.target.value);
                        setSelectedSection('');
                        setSelectedSubject('');
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedSemester}
                    required
                >
                    <option value="">Select Branch</option>
                    {classBranchOptions.map((branch) => (
                        <option key={branch} value={branch}>
                            {branch}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                    <label>
                        Section <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-black text-white text-sm rounded-lg p-2 z-10">
                            Choose your section after selecting a branch. This will enable subject selection.
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <select
                    value={selectedSection}
                    onChange={(e) => {
                        setSelectedSection(e.target.value);
                        setSelectedSubject('');
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedBranch}
                    required
                >
                    <option value="">Select Section</option>
                    {classSectionOptions.map((section) => (
                        <option key={section} value={section}>
                            {section}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                    <label>
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-black text-white text-sm rounded-lg p-2 z-10">
                            Finally, select your subject based on the chosen semester, branch, and section.
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedSection}
                    required
                >
                    <option value="">Select Subject</option>
                    {classSubjectOptions.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ClassFields;