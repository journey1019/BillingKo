import React, { useState } from 'react';
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';
import { jsPDF } from "jspdf";
import { fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';
import { FaDownload } from "react-icons/fa";

/**
 * @param yearMonth = '202501' 선택한 Year Month
 * @param invoiceBasicData = 청구서 양식을 위한 데이터
 * @param monthlyAcctSaveData = 청구서에 포함될 모든 계정 데이터 배열
 */
const InvoicePDFMergedPrint = ({ yearMonth, invoiceBasicData, monthlyAcctSaveData }) => {
    const [loading, setLoading] = useState(false);

    const handleDownloadAll = async () => {
        if (!monthlyAcctSaveData || monthlyAcctSaveData.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        setLoading(true);
        try {
            let doc = new jsPDF({ unit: "mm", format: "a4" });

            for (let i = 0; i < monthlyAcctSaveData.length; i++) {
                const account = monthlyAcctSaveData[i];
                const acctNum = account.acct_num;

                console.log(`📌 Processing account: ${acctNum}`);

                const accountDetailData = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, acctNum);

                if (!accountDetailData || accountDetailData.length === 0) {
                    console.warn(`⚠️ No data found for account: ${acctNum}`);
                    continue;
                }

                // ✅ 기존 doc을 수정하도록 변경 (재할당 없이 직접 수정)
                generateInvoicePage1(doc, yearMonth, invoiceBasicData, accountDetailData);
                generateInvoicePage2(doc, yearMonth, invoiceBasicData, accountDetailData);

                if (i !== monthlyAcctSaveData.length - 1) {
                    console.log(`📌 Adding new page for next account (${i + 1})`);
                    doc.addPage();
                }
            }

            // ✅ PDF 저장 및 다운로드
            doc.save(`Invoice_All_${yearMonth}.pdf`);
        } catch (error) {
            console.error("PDF 생성 오류:", error);
            alert("PDF 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <button
            className={`flex flex-row items-center p-2 rounded-md border-gray-700 border-2 space-x-2 transition duration-200 ease-in-out 
                        ${loading || !monthlyAcctSaveData?.length ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-gray-200 hover:border-gray-900 hover:text-gray-900"}`}
            onClick={handleDownloadAll}
            disabled={loading || !monthlyAcctSaveData?.length} // 데이터가 없거나 로딩 중이면 비활성화
        >
            <FaDownload />
            <span>{loading ? "Downloading..." : "Download Merge PDFs"}</span>
        </button>
    );
}

export default InvoicePDFMergedPrint;
