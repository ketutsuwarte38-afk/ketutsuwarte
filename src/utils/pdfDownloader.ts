import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadElementAsPdf(
  elementId: string,
  fileName: string,
  onProgress?: (loading: boolean) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    window.print();
    return;
  }

  try {
    if (onProgress) onProgress(true);

    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp high-DPI text and borders
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Proportional dimensions
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if needed
    while (heightLeft > 5) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);
  } catch (err) {
    console.error('Error generating direct PDF:', err);
    // Fallback to browser print dialog
    window.print();
  } finally {
    if (onProgress) onProgress(false);
  }
}
