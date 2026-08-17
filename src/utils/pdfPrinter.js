import { escapeHtml } from './sanitize';

// Helper utility to open styled PDF documents in a separate browser tab for viewing & printing

export function openPdfDocument({ title, subtitle, documentType, author, date, sections, tables, footerNote }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this site to view and print the PDF document.');
    return;
  }

  const safeTitle = escapeHtml(title || 'Official Document');
  const safeSubtitle = escapeHtml(subtitle || '');
  const safeDocType = escapeHtml(documentType || 'OFFICIAL DOCUMENT');
  const safeAuthor = escapeHtml(author || 'Apex Digital Academy');
  const safeDate = escapeHtml(date || new Date().toLocaleDateString());
  const safeFooter = escapeHtml(footerNote || 'Generated via Apex Digital School System');

  const sectionsHtml = (sections || []).map(sec => `
    <div class="section">
      ${sec.title ? `<h2>${escapeHtml(sec.title)}</h2>` : ''}
      ${sec.content ? `<div class="content">${escapeHtml(sec.content).replace(/\n/g, '<br/>')}</div>` : ''}
      ${sec.bullets ? `
        <ul>
          ${sec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  const tablesHtml = (tables || []).map(tbl => `
    <div class="section">
      ${tbl.title ? `<h2>${escapeHtml(tbl.title)}</h2>` : ''}
      <table>
        <thead>
          <tr>
            ${(tbl.headers || []).map(h => `<th>${escapeHtml(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${(tbl.rows || []).map(row => `
            <tr>
              ${(row || []).map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title} - Official PDF Document</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .toolbar {
          position: sticky;
          top: 10px;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          border-radius: 12px;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          z-index: 1000;
          border: 1px solid #e5e7eb;
        }
        .toolbar h3 {
          font-size: 14px;
          color: #4b5563;
        }
        .btn-print {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-print:hover {
          background: #4338ca;
        }
        .btn-close {
          background: #e5e7eb;
          color: #374151;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }
        .pdf-page {
          background: #ffffff;
          width: 210mm;
          min-height: 297mm;
          padding: 25mm 20mm;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: 4px;
          position: relative;
        }
        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #4f46e5;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .logo-area h1 {
          font-size: 22px;
          color: #1e1b4b;
          font-weight: 800;
        }
        .logo-area p {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
        .doc-type-badge {
          background: #e0e7ff;
          color: #3730a3;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .doc-title-block {
          margin-bottom: 24px;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #4f46e5;
        }
        .doc-title-block h1 {
          font-size: 20px;
          color: #111827;
          margin-bottom: 6px;
        }
        .meta-grid {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #4b5563;
        }
        .meta-item strong {
          color: #111827;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h2 {
          font-size: 15px;
          color: #3730a3;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 6px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .content {
          font-size: 13.5px;
          line-height: 1.6;
          color: #374151;
        }
        ul {
          margin-left: 20px;
          margin-top: 8px;
        }
        li {
          font-size: 13.5px;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12.5px;
        }
        th, td {
          border: 1px solid #d1d5db;
          padding: 10px 12px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          color: #111827;
          font-weight: 700;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
        }

        @media print {
          body {
            background: none;
            padding: 0;
          }
          .toolbar {
            display: none !important;
          }
          .pdf-page {
            box-shadow: none;
            width: 100%;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>

      <div class="toolbar">
        <h3>📄 Document Preview</h3>
        <button class="btn-print" onclick="window.print()">
          🖨️ Save as PDF / Print
        </button>
        <button class="btn-close" onclick="window.close()">
          Close Tab
        </button>
      </div>

      <div class="pdf-page">
        <div class="header-bar">
          <div class="logo-area">
            <h1>APEX DIGITAL SCHOOL</h1>
            <p>Smart LMS & AI Academic Ecosystem</p>
          </div>
          <div class="doc-type-badge">${safeDocType}</div>
        </div>

        <div class="doc-title-block">
          <h1>${safeTitle}</h1>
          ${safeSubtitle ? `<p style="font-size: 13px; color: #4b5563; margin-bottom: 8px;">${safeSubtitle}</p>` : ''}
          <div class="meta-grid">
            <div class="meta-item"><strong>Generated By:</strong> ${safeAuthor}</div>
            <div class="meta-item"><strong>Date:</strong> ${safeDate}</div>
          </div>
        </div>

        ${sectionsHtml}
        ${tablesHtml}

        <div class="footer">
          <span>Apex Digital School System • Confidential Academic Document</span>
          <span>${safeFooter}</span>
        </div>
      </div>

    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
