import React, { useState } from 'react';
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';
import { jsPDF } from "jspdf";
import { FaPrint } from 'react-icons/fa';
import { fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';

/**
 * @param yearMonth = '202501' 선택한 Year Month
 * @param invoiceBasicData = 청구서 양식을 위한 데이터
 * @param monthlyAcctSaveData = 청구서에 포함될 모든 계정 데이터 배열
 */
const InvoicePDFMergedPrintDirect = ({ yearMonth, invoiceBasicData, monthlyAcctSaveData }) => {
    const [loading, setLoading] = useState(false);

    const handlePrintAll = async () => {
        if (!monthlyAcctSaveData || monthlyAcctSaveData.length === 0) {
            alert("출력할 데이터가 없습니다.");
            return;
        }

        setLoading(true);
        try {
            let doc = new jsPDF({ unit: "mm", format: "a4" });

            for (let i = 0; i < monthlyAcctSaveData.length; i++) {
                const account = monthlyAcctSaveData[i];
                const acctNum = account.acct_num;

                console.log(`📌 Processing account for print: ${acctNum}`);

                const accountDetailData = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, acctNum);

                if (!accountDetailData || accountDetailData.length === 0) {
                    console.warn(`⚠️ No data found for account: ${acctNum}`);
                    continue;
                }

                // ✅ PDF 페이지 생성
                generateInvoicePage1(doc, yearMonth, invoiceBasicData, accountDetailData);
                generateInvoicePage2(doc, yearMonth, invoiceBasicData, accountDetailData);

                if (i !== monthlyAcctSaveData.length - 1) {
                    doc.addPage();
                }
            }

            // ✅ PDF 자동 프린트 실행
            doc.autoPrint();
            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const printWindow = window.open(pdfUrl);
            if (printWindow) {
                printWindow.onload = () => printWindow.print();
            }

        } catch (error) {
            console.error("PDF 출력 오류:", error);
            alert("PDF 출력 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`flex flex-row items-center p-2 rounded-md border-gray-700 border-2 space-x-2 transition duration-200 ease-in-out 
                        ${loading || !monthlyAcctSaveData?.length ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-gray-200 hover:border-gray-900 hover:text-gray-900"}`}
            onClick={handlePrintAll}
            disabled={loading || !monthlyAcctSaveData?.length} // 데이터가 없거나 로딩 중이면 비활성화
        >
            {loading ? (
                <svg className="w-5 h-5 animate-spin text-gray-600"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            ) : (
                <FaPrint />
            )}
            <span>{loading ? "일괄 출력중..." : "청구서 일괄 출력"}</span>
        </button>
    );
};

export default InvoicePDFMergedPrintDirect;
