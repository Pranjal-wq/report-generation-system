// @ts-ignore
import html2pdf from 'html2pdf.js';

export const exportToPDF = async (elementId: string, fileName: string = 'report.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    try {
        const container = element.querySelector('.overflow-x-auto.h-80.overflow-y-auto');
        let originalStyle: { height: string; overflow: string } | null = null;
        if (container) {
            originalStyle = {
                height: container.style.height,
                overflow: container.style.overflow,
            };
            container.style.height = 'auto';
            container.style.overflow = 'visible';
        }

        const options = {
            margin: [15, 15],
            filename: fileName,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 3,
                letterRendering: true,
                useCORS: true,
                allowTaint: true,
                logging: false,
                windowWidth: 1080
            },
            jsPDF: {
                unit: 'mm',
                format: 'a3',
                orientation: 'portrait',
                compress: true,
                precision: 16
            }
        };

        await html2pdf().set(options).from(element).save();

        if (container && originalStyle) {
            container.style.height = originalStyle.height;
            container.style.overflow = originalStyle.overflow;
        }
    } catch (error) {
        console.error('Error exporting PDF:', error);
    }
};