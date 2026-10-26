/**
 * Professional Print Utility for St. Joseph International School Admission Documents.
 * Uses an isolated hidden iframe to ensure 100% clean A4 print & PDF generation,
 * completely immune to parent container overflow, modals, backdrop blur, or site navigation chrome.
 */
export function printDocumentElement(
  elementId = 'physical-admission-document',
  title = 'St. Joseph International School - Official Document',
  pageSize: 'A4' | 'Legal' = 'A4'
): void {
  if (typeof window === 'undefined') return;

  const isLegal = pageSize === 'Legal';
  const pageCss = isLegal
    ? `size: 216mm 356mm portrait; margin: 6mm 8mm 6mm 8mm;`
    : `size: A4 portrait; margin: 5mm 7mm 5mm 7mm;`;
  const targetHeight = isLegal ? '342mm' : '285mm';

  const target = document.getElementById(elementId);
  if (!target) {
    window.print();
    return;
  }

  // Remove any stale print frames
  const oldFrame = document.getElementById('sjis-isolated-print-frame');
  if (oldFrame) {
    oldFrame.remove();
  }

  // Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'sjis-isolated-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  const frameDoc = iframe.contentWindow?.document;
  if (!frameDoc) {
    window.print();
    return;
  }

  // Collect all active styles, fonts and Tailwind rules from the host page
  const headElements = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((el) => el.outerHTML)
    .join('\n');

  // Clone target element to avoid modifying host DOM
  const clonedTarget = target.cloneNode(true) as HTMLElement;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${headElements}
        <style>
          @page {
            ${pageCss}
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Georgia, "Times New Roman", Cambria, serif !important;
          }
          .no-print, [role="navigation"], header, footer, nav, aside {
            display: none !important;
          }
          #${elementId} {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: ${targetHeight} !important;
            max-height: ${targetHeight} !important;
            margin: 0 auto !important;
            padding: 2mm 3mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #${elementId} * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .admission-application-part {
            flex: 1 1 auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding-bottom: 2mm !important;
          }
          .admit-card-part {
            flex-shrink: 0 !important;
            margin-top: auto !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; margin: 0 auto;">
          ${clonedTarget.outerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  // Ensure fonts, styles, and candidate photograph / crest images are fully loaded and decoded
  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print failed, falling back to window.print():', err);
      window.print();
    } finally {
      // Clean up iframe after print dialog completes
      setTimeout(() => {
        iframe.remove();
      }, 4000);
    }
  };

  const images = Array.from(frameDoc.images);
  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    if (typeof img.decode === 'function') {
      return img.decode().catch(() => {});
    }
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  });

  const fontPromise = frameDoc.fonts?.ready ?? Promise.resolve();

  // Wait for all assets with a safety timeout fallback
  let triggered = false;
  const timeoutId = setTimeout(() => {
    if (!triggered) {
      triggered = true;
      triggerPrint();
    }
  }, 1200);

  Promise.all([...imagePromises, fontPromise])
    .then(() => {
      if (!triggered) {
        clearTimeout(timeoutId);
        triggered = true;
        // Brief 80ms tick to allow final reflow
        setTimeout(triggerPrint, 80);
      }
    })
    .catch(() => {
      if (!triggered) {
        clearTimeout(timeoutId);
        triggered = true;
        triggerPrint();
      }
    });
}
