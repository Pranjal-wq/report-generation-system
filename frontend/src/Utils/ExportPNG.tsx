import domToImage from 'dom-to-image';

export const exportToPNG = async (elementId: string, fileName: string = 'report.png') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }
    try {
        const dataURL = await domToImage.toPng(element, { bgcolor: '#ffffff' });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = fileName;
        link.click();
    } catch (error) {
        console.error('Error exporting PNG:', error);
    }
};
