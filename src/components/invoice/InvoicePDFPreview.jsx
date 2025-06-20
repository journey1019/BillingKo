import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from "jspdf";
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';

/**
 * @param {string} yearMonth 선택한 연월 (예: '202501')
 * @param {object} invoiceBasicData 청구서 양식을 위한 데이터
 * @param {object} accountDetailData 청구서에 삽입될 상세 데이터
 */
const InvoicePDFPreview = ({ yearMonth, invoiceBasicData, accountDetailData }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const pdfUrlRef = useRef(null);

    useEffect(() => {
        if (!invoiceBasicData || !accountDetailData) return;

        let doc = new jsPDF({ unit: "mm", format: "a4" });
        doc = generateInvoicePage1(doc, yearMonth, invoiceBasicData, accountDetailData || []);
        doc = generateInvoicePage2(doc, yearMonth, invoiceBasicData, accountDetailData || []);

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        pdfUrlRef.current = url;

        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
            }
        };
    }, [yearMonth, invoiceBasicData, accountDetailData]);


    if (!pdfUrl) return <div>Loading PDF Preview...</div>;

    return (
        <div className="w-full h-[calc(95%)] border-2 border-gray-300 rounded-lg overflow-hidden">
            <iframe src={pdfUrl} className="w-full h-full border-none" title="Invoice Preview"></iframe>
        </div>
    );
};

export default InvoicePDFPreview;
