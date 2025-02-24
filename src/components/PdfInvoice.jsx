// src/components/PdfInvoice.jsx
import React from 'react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const sampleData = {
    details: [
        { label: "청구 금액", value: "100,000원" },
        { label: "납기일", value: "2025-03-01" },
        // 추가 항목들...
    ]
};

export default function PdfInvoice() {
    const handleGenerate = () => {
        generateInvoicePDF(sampleData);
    };

    return (
        <div>
            <span>청구서 PDF 생성</span>

            <button onClick={handleGenerate}>PDF 생성하기</button>
        </div>
    );
}
