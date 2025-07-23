import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    FileDownload as FileDownloadIcon,
    Description as DescriptionIcon,
    TableChart as TableChartIcon
} from '@mui/icons-material';
import { exportToExcel } from '../../Utils/ExportExcel';
import { exportToPDF } from '../../Utils/ExportPDF';

interface ExportDialogProps {
    open: boolean;
    onClose: () => void;
    data: any[];
    columns: { header: string; dataKey: string }[];
    fileName: string;
    title: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
    open,
    onClose,
    data,
    columns,
    fileName,
    title
}) => {
    const handleExportPDF = () => {
        // First create a temporary element to render the data for PDF export
        const tempDiv = document.createElement('div');
        tempDiv.id = 'temp-export-container';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';

        // Create a simple table with the data
        const table = document.createElement('table');
        table.classList.add('export-table');

        // Add title
        const titleRow = document.createElement('div');
        titleRow.classList.add('export-title');
        titleRow.style.fontSize = '18px';
        titleRow.style.fontWeight = 'bold';
        titleRow.style.marginBottom = '10px';
        titleRow.textContent = title;
        tempDiv.appendChild(titleRow);

        // Add subtitle with date
        const dateRow = document.createElement('div');
        dateRow.classList.add('export-date');
        dateRow.style.fontSize = '12px';
        dateRow.style.marginBottom = '15px';
        dateRow.textContent = `Generated: ${new Date().toLocaleDateString()}`;
        tempDiv.appendChild(dateRow);

        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.header;
            th.style.backgroundColor = '#2980b9';
            th.style.color = 'white';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body with data
        const tbody = document.createElement('tbody');
        data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = rowIndex % 2 === 0 ? 'white' : '#f0f0f0';

            columns.forEach(col => {
                const td = document.createElement('td');
                const value = row[col.dataKey];
                td.textContent = value !== undefined && value !== null ? String(value) : '';
                td.style.padding = '8px';
                td.style.borderBottom = '1px solid #ddd';
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tempDiv.appendChild(table);

        // Append to document, export, then remove
        document.body.appendChild(tempDiv);

        // Use the existing exportToPDF utility
        exportToPDF('temp-export-container', `${fileName}.pdf`);

        // Clean up
        document.body.removeChild(tempDiv);
        onClose();
    };

    const handleExportExcel = () => {
        console.log('Exporting Excel with data:', data.length, 'rows');
        exportToExcel(data, `${fileName}.xlsx`);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#002147', color: 'white' }}>
                Export Options
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Choose a format to export your data:
                </Typography>

                <List sx={{ pt: 1 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleExportPDF}>
                            <ListItemIcon>
                                <DescriptionIcon sx={{ color: '#f44336' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Export as PDF"
                                secondary="Download a formatted PDF document"
                            />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={handleExportExcel}>
                            <ListItemIcon>
                                <TableChartIcon sx={{ color: '#4caf50' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Export as Excel"
                                secondary="Download as Excel spreadsheet"
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    sx={{ bgcolor: '#002147', '&:hover': { bgcolor: '#003166' } }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog;