import React from 'react';
import { generateInvoicePDF } from './InvoiceGenerator';

const InvoicePreview = ({ invoiceBasicData }) => {
    const handleGeneratePdf = () => {
        const doc = generateInvoicePDF(invoiceBasicData);
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
