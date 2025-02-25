/** src/components/Invoice/InvoicePreview.jsx */
import React, { useState } from 'react';
import { generateInvoicePDF } from './InvoiceGenerator';

const InvoicePreview = ({ invoiceBasicData }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleGeneratePdf = () => {
        // jsPDF를 이용하여 PDF 객체 생성
        const doc = generateInvoicePDF(invoiceBasicData);
        // PDF를 blob 형태로 변환 후 URL 생성
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
    };

    return (
        <div>
            <button onClick={handleGeneratePdf}>PDF 생성 및 미리보기</button>
            {pdfUrl && (
                <div>
                    {/* iframe으로 PDF 미리보기 */}
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        title="청구서 PDF 미리보기"
                        style={{ border: '1px solid #ccc', marginTop: '20px' }}
                    ></iframe>
                    {/* PDF 다운로드 링크 */}
                    <a href={pdfUrl} download="invoice.pdf" style={{ display: 'block', marginTop: '10px' }}>
                        PDF 다운로드
                    </a>
                </div>
            )}
        </div>
    );
};

export default InvoicePreview;
