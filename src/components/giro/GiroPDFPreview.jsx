
import React, { useEffect, useState } from 'react';
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

        // 첫 번째 페이지 생성
        let doc = GiroPage(yearMonth, invoiceBasicData, accountDetailData || []);

        // PDF를 Blob으로 변환
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        // 클린업 함수에서 URL 해제
        return () => URL.revokeObjectURL(url);
    }, [yearMonth, invoiceBasicData, accountDetailData]);

    if (!pdfUrl) return <div>Loading PDF Preview...</div>;

    return (
        <div className="w-full h-[570px] border-2 border-gray-300 rounded-lg overflow-hidden">
            <iframe src={pdfUrl} className="w-full h-full" title="Invoice Preview"></iframe>
        </div>
    );
};

export default GiroPDFPreview;
