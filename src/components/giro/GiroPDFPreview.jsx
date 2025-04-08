import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { GiroPage } from './GiroPage.js';

/**
 * @param {string} yearMonth 선택한 연월 (예: '202501')
 * @param {object} invoiceBasicData 청구서 양식을 위한 데이터
 * @param {object} accountDetailData 청구서에 삽입될 상세 데이터
 */
const GiroPDFPreview = ({ yearMonth, invoiceBasicData, accountDetailData }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (!invoiceBasicData || !accountDetailData) return;

        // ✅ jsPDF 문서 생성 (문서 객체를 직접 생성)
        let doc = new jsPDF({
            unit: "mm",
            format: "a4"
        });

        // 첫 번째 페이지 생성
        doc = GiroPage(doc, yearMonth, invoiceBasicData, accountDetailData || []);

        // PDF를 Blob으로 변환
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        // 클린업 함수에서 URL 해제
        return () => URL.revokeObjectURL(url);
    }, [yearMonth, invoiceBasicData, accountDetailData]);

    if (!pdfUrl) return <div>Loading PDF Preview...</div>;

    return (
        <div className="w-full h-[calc(90%)] border-2 border-gray-300 rounded-lg overflow-hidden">
            <iframe src={pdfUrl} className="w-full h-full border-none" title="Giro Preview"></iframe>
        </div>
    );
};

export default GiroPDFPreview;
