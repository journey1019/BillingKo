import React from 'react';
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';
import { LuScreenShare } from "react-icons/lu";


/**
 * @param yearMonth = '202501' 선택한 Year Month
 * @param invoiceBasicData = 청구서 양식을 위한 데이터
 * @param accountDetailData = 양식 기반 삽입될 데이터
 * */
const InvoicePDFPrintView = ({ yearMonth, invoiceBasicData, accountDetailData }) => {
    // 2024 | 12
    const year = Math.floor(yearMonth / 100);
    const month = (yearMonth % 100).toString().padStart(2, '0'); // 01~09월일 경우 앞에 0 추가
    // 2024-12
    const formattedYearMonth = `${year}-${month}`; // 2024-12

    const handleGeneratePdf = () => {
        // 첫 페이지 생성
        let doc = generateInvoicePage1(yearMonth, invoiceBasicData, accountDetailData || []);

        // 두 번째 페이지 생성 (doc 객체를 넘김)
        doc = generateInvoicePage2(doc, formattedYearMonth, invoiceBasicData, accountDetailData || [])

        // jsPDF에서는 output('blob')을 이용해 Blob 생성
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    };

    return (
        <div>
            <button
                className="flex flex-row items-center p-2 rounded-md border-gray-700 border-2 space-x-2 transition duration-200 ease-in-out hover:bg-gray-200 hover:border-gray-900 hover:text-gray-900"
                onClick={handleGeneratePdf}
            >
                <LuScreenShare/>
            </button>
        </div>
    );
};

export default InvoicePDFPrintView;
