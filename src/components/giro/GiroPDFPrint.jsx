import React from 'react';
import { GiroPage } from './GiroPage.js';
import { IoMdDownload } from "react-icons/io";


const GiroPDFPrint = ({ yearMonth, invoiceBasicData, accountDetailData }) => {

    const year = Math.floor(yearMonth / 100);
    const month = (yearMonth % 100).toString().padStart(2, '0'); // 01~09월일 경우 앞에 0 추가
    const formattedYearMonth = `${year}-${month}`; // 2024-12

    const handleGeneratePdf = () => {
        if (!accountDetailData || accountDetailData.length === 0) {
            alert("No data available for invoice.");
            return;
        }

        const acctNum = accountDetailData[0]?.acct_num || "Unknown"; // 계정 번호 추출 (첫 번째 데이터 기준)
        const fileName = `Invoice_${acctNum}_${yearMonth}.pdf`; // 파일명 설정

        // 첫 페이지 생성
        let doc = GiroPage(yearMonth, invoiceBasicData, accountDetailData || []);

        // PDF를 Blob으로 변환
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        // 파일 자동 다운로드 처리
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button
                className="flex flex-row items-center p-2 rounded-md border-gray-700 border-2 space-x-2 transition duration-200 ease-in-out hover:bg-gray-200 hover:border-gray-900 hover:text-gray-900"
                onClick={handleGeneratePdf}
            >
                <IoMdDownload />
                <span>Download PDF</span>
            </button>
        </div>
    );
}

export default GiroPDFPrint;