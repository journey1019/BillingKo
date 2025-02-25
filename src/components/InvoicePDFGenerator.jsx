import React, { useState } from 'react';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

export default function InvoicePDFGenerator({ invoiceBasicData }) {
    const [pdfUrl, setPdfUrl] = useState(null);

    // const handleGeneratePDF = async () => {
    //     try {
    //         const url = await generateInvoicePDF(invoiceBasicData);
    //         setPdfUrl(url);
    //         window.open(url, '_blank');
    //     } catch (error) {
    //         console.error("PDF 생성 중 오류 발생:", error);
    //     }
    // };
    const handleGeneratePDF = () => {
        const doc = generateInvoicePDF(invoiceBasicData);
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    };

    return (
        <div>
            <button onClick={handleGeneratePDF}>PDF 생성하기</button>
            {/*{pdfUrl && (*/}
            {/*    <p>*/}
            {/*        생성된 PDF 보기: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">다운로드/보기</a>*/}
            {/*    </p>*/}
            {/*)}*/}
        </div>
    );
}
