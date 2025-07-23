import React, { useState } from 'react';
import { Button } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import ExportDialog from './ExportDialog';

interface ExportButtonProps {
    data: any[];
    columns: { header: string; dataKey: string }[];
    fileName?: string;
    title?: string;
    buttonText?: string;
    buttonVariant?: 'text' | 'outlined' | 'contained';
    buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    buttonSize?: 'small' | 'medium' | 'large';
    className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
    data,
    columns,
    fileName = 'export',
    title = 'Report',
    buttonText = 'Export',
    buttonVariant = 'contained',
    buttonColor = 'primary',
    buttonSize = 'medium',
    className
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Only show the button if there's data to export
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <Button
                variant={buttonVariant}
                color={buttonColor}
                size={buttonSize}
                onClick={handleOpenDialog}
                startIcon={<FileDownloadIcon />}
                className={className}
                sx={{
                    bgcolor: buttonVariant === 'contained' ? '#002147' : undefined,
                    '&:hover': { bgcolor: buttonVariant === 'contained' ? '#003166' : undefined },
                }}
            >
                {buttonText}
            </Button>

            <ExportDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                data={data}
                columns={columns}
                fileName={fileName}
                title={title}
            />
        </>
    );
};

export default ExportButton;