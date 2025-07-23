import React from 'react';
import { mockAttendanceData } from '../../../mock/student/mockdata'; // Adjust relative path if needed

// Color helper for percentage column
const getColorClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-200';
  if (percentage >= 70) return 'bg-orange-200';
  return 'bg-red-200';
};

const DailyAttendanceReport = () => {
	// Use overall attendance data for subject details and daily attendance data for date range
	const subjectsData = mockAttendanceData.overall.semesterSummary.subjectsData;
	const dailyRecords = mockAttendanceData.daily.dailyRecords;

	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="border p-2 bg-gray-100 w-24">Percentage</th>
							<th className="border p-2 bg-gray-100">Subject</th>
							<th className="border p-2 bg-gray-100">Professor</th>
							{dailyRecords.map((record, i) => (
								<th key={i} title={record.date} className="border p-2 bg-gray-100 w-12 text-center">
									{i + 1}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{subjectsData.map((subject, index) => (
							<tr key={index}>
								<td className={`border p-2 text-center ${getColorClass(subject.percentage)}`}>
									{subject.percentage.toFixed(1)}
								</td>
								<td className="border p-2">{subject.subjectName}</td>
								<td className="border p-2">{subject.professorName}</td>
								{dailyRecords.map((record, idx) => {
									// Find matching class record for the subject in this day
									const classRecord = record.classes.find(
										(cls) => cls.subjectId === subject.subjectId
									);
									return (
										<td key={idx} className="border p-2 text-center">
											{classRecord
												? classRecord.isPresent === "1"
													? "P"
													: "A"
												: ""}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DailyAttendanceReport;
