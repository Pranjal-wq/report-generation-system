import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface Column {
  header: string;
  dataKey: string;
}

export const exportToPDFFromData = (
  data: any[],
  columns: Column[],
  fileName: string = 'report.pdf',
  title: string = 'Report'
) => {
  try {
    // Create new document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table headers and data
    const headers = columns.map(col => col.header);
    const tableData = data.map(row =>
      columns.map(col => {
        const value = row[col.dataKey];
        return value !== undefined && value !== null ? String(value) : '';
      })
    );

    // Add table
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 35 },
    });

    // Save document
    doc.save(fileName);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};