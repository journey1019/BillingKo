// src/components/InvoicePDFGenerator.jsx
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NotoSansKR from '../assets/fonts/NotoSansKR-Regular.base64';

export default function InvoicePDFGenerator({ invoiceBasicData }) {
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        // 커스텀 폰트를 VFS에 추가
        doc.addFileToVFS("NotoSansKR-Regular.ttf", NotoSansKR);
        doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
        doc.setFont("NotoSansKR");

        // invoiceBasicData에서 필요한 값 추출
        const addressData = invoiceBasicData.find(item => item.code_name === "ko_address");
        const postCodeData = invoiceBasicData.find(item => item.code_name === "ko_post_code");
        const companyNameData = invoiceBasicData.find(item => item.code_name === "ko_company_name");

        const addressText = addressData ? addressData.code_value : "";
        const postCodeText = postCodeData ? postCodeData.code_value : "";
        const companyNameText = companyNameData ? companyNameData.code_value : "";

        // PDF 상단에 세 컬럼 텍스트 배치
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const columnWidth = (pageWidth - 2 * margin) / 3;
        const y = 20;

        doc.text(addressText, margin, y);
        doc.text(postCodeText, margin + columnWidth, y);
        doc.text(companyNameText, margin + 2 * columnWidth, y);

        // PDF 생성 후 Blob URL 반환
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        window.open(url, '_blank');
    };

    return (
        <div>
            <button onClick={handleGeneratePDF}>PDF 생성하기</button>
            {pdfUrl && (
                <p>
                    생성된 PDF 보기: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">다운로드/보기</a>
                </p>
            )}
        </div>
    );
}
