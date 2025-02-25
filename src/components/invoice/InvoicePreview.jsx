import React from 'react';
import { generateInvoicePDF } from './InvoiceGenerator';

const InvoicePreview = ({ invoiceBasicData }) => {
    const handleGeneratePdf = () => {
        // PDF 문서 생성
        const doc = generateInvoicePDF(invoiceBasicData);
        // jsPDF에서는 output('blob')을 이용해 Blob 생성
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    };

    return (
        <div>
            <button onClick={handleGeneratePdf}>PDF 생성 및 새창 미리보기</button>
        </div>
    );
};

export default InvoicePreview;
