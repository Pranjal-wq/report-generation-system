import React from 'react';
import { ExternalLink } from 'lucide-react';
import StudentReport from '../../components/Reports/student/StudentReport';
import { createRoot } from 'react-dom/client';

const ReportSection = () => {
	//  function to render StudentReport in a new window
	const openReportInNewPage = () => {
		const reportWindow = window.open('', '_blank');
		if (reportWindow) {
			reportWindow.document.write("<div id='student-report-container'></div>");
			reportWindow.document.close();
			const container = reportWindow.document.getElementById('student-report-container');
			if (container) {
				const root = createRoot(container);
				root.render(<StudentReport />);
			}
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Report Section</h2>
				<button onClick={openReportInNewPage} className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
					<ExternalLink className="w-5 h-5 mr-1" />
					Open in New Page
				</button>
			</div>
			<p className="text-gray-500 italic">Report section will use the Student Report component.</p>
		</div>
	);
};

export default ReportSection;
