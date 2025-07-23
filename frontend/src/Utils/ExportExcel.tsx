import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string = 'report.xlsx') => {
    try {
        // Create a worksheet from the data
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        // Generate the Excel file and trigger download
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error('Error exporting Excel:', error);
    }
};