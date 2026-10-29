/**
 * PDF Generation and Direct Download Utility for St. Joseph International School Admission Documents.
 * Converts rendered DOM elements (e.g. Admit Card, Application Slip) directly into high-DPI PDF files
 * and triggers immediate native file download on mobile devices (Android / iOS) and desktop browsers.
 */

export interface DownloadPdfOptions {
  pageSize?: 'A4' | 'Legal';
  scale?: number;
  quality?: number;
}

export async function downloadElementAsPdf(
  elementOrId: string | HTMLElement,
  filename: string,
  options: DownloadPdfOptions = {}
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const { pageSize = 'A4', scale = 2.5, quality = 0.95 } = options;

  const target =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!target) {
    console.error(`downloadElementAsPdf: target element "${elementOrId}" not found in DOM.`);
    return false;
  }

  try {
    // Dynamically import jspdf and html2canvas to ensure clean client-side bundling
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    // Render high-DPI canvas representation
    const canvas = await html2canvas(target, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: target.scrollWidth || 794, // Standard 210mm at 96 DPI
    });

    const isLegal = pageSize === 'Legal';
    const pdfPageWidth = isLegal ? 216 : 210; // mm
    const pdfPageHeight = isLegal ? 356 : 297; // mm

    const imgWidth = pdfPageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isLegal ? 'legal' : 'a4',
      compress: true,
    });

    // Check if content fits in one page or needs multi-page pagination
    if (imgHeight <= pdfPageHeight + 5) {
      // Single page fit (typical for Admit Card)
      const imgData = canvas.toDataURL('image/jpeg', quality);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfPageHeight), undefined, 'FAST');
    } else {
      // Multi-page content (e.g. Full Application Form + Admit Card)
      let heightLeft = imgHeight;
      let position = 0;
      const imgData = canvas.toDataURL('image/jpeg', quality);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;

      while (heightLeft > 5) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
      }
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
    return true;
  } catch (err) {
    console.error('Failed to generate direct PDF:', err);
    return false;
  }
}

