import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';
import { fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';
import { FaDownload } from "react-icons/fa";

const InvoicePDFBatchDownload = ({ yearMonth, invoiceBasicData, monthlyAcctSaveData }) => {
    const [loading, setLoading] = useState(false);

    const handleDownloadAll = async () => {
        if (!monthlyAcctSaveData || monthlyAcctSaveData.length === 0) return; // 데이터가 없으면 실행 X

        setLoading(true);
        try {
            const pdfBlobs = [];

            // 각 계정(acct_num)에 대해 PDF를 생성
            for (const account of monthlyAcctSaveData) {
                const acctNum = account.acct_num;

                // 계정 상세 데이터 요청
                const accountDetailData = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, acctNum);

                // ✅ jsPDF 문서 생성 (문서 객체를 직접 생성)
                let doc = new jsPDF({
                    unit: "mm",
                    format: "a4"
                });

                // ✅ 기존 doc을 넘겨서 첫 번째 페이지 생성
                doc = generateInvoicePage1(doc, yearMonth, invoiceBasicData, accountDetailData || []);

                // ✅ 기존 doc을 넘겨서 두 번째 페이지 생성
                doc = generateInvoicePage2(doc, yearMonth, invoiceBasicData, accountDetailData || []);

                // PDF를 Blob으로 변환
                const pdfBlob = doc.output('blob');
                pdfBlobs.push({ acctNum, blob: pdfBlob });
            }

            // PDF 다운로드 실행
            pdfBlobs.forEach(({ acctNum, blob }) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Invoice_${acctNum}_${yearMonth}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

        } catch (error) {
            console.error("Error generating batch invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className={`flex flex-row items-center p-2 rounded-md border-gray-700 border-2 space-x-2 transition duration-200 ease-in-out 
                        ${loading || !monthlyAcctSaveData?.length ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-gray-200 hover:border-gray-900 hover:text-gray-900"}`}
                onClick={handleDownloadAll}
                disabled={loading || !monthlyAcctSaveData?.length} // monthlyAcctSaveData가 없거나 빈 배열이면 비활성화
            >
                <FaDownload />
                <span>{loading ? "Downloading..." : "Download All PDFs"}</span>
            </button>
        </>
    );
};

export default InvoicePDFBatchDownload;
