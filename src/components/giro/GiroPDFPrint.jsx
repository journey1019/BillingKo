import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { GiroPage } from './GiroPage.js';
import { IoMdDownload } from "react-icons/io";
import { fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';
import { FaSave } from 'react-icons/fa';


const GiroPDFPrint = ({ yearMonth, invoiceBasicData, accountDetailData, monthlyAcctSaveData }) => {
    const [isOpen, setIsOpen] = useState(false); // 일괄 다운로드 버튼
    const [loading, setLoading] = useState(false);

    const handleGeneratePdf = () => {
        if (!accountDetailData || accountDetailData.length === 0) {
            alert("No data available for giro.");
            return;
        }

        const acctNum = accountDetailData[0]?.acct_num || "Unknown"; // 계정 번호 추출 (첫 번째 데이터 기준)
        const fileName = `Giro_${acctNum}_${yearMonth}.pdf`; // 파일명 설정


        // ✅ jsPDF 문서 생성 (문서 객체를 직접 생성)
        let doc = new jsPDF({
            unit: "mm",
            format: "a4"
        });

        // 첫 페이지 생성
        doc = GiroPage(doc, yearMonth, invoiceBasicData, accountDetailData || []);

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

                // 첫 번째 페이지 생성
                doc = GiroPage(doc, yearMonth, invoiceBasicData, accountDetailData || []);

                // PDF를 Blob으로 변환
                const pdfBlob = doc.output('blob');
                pdfBlobs.push({ acctNum, blob: pdfBlob });
            }

            // PDF 다운로드 실행
            pdfBlobs.forEach(({ acctNum, blob }) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Giro_${acctNum}_${yearMonth}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

        } catch (error) {
            console.error("Error generating batch giros:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="relative inline-block">
                {/* Main Action Button */}
                <div className="flex">
                    <button
                        onClick={handleGeneratePdf}
                        className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300
                    font-medium text-sm px-4 py-2 text-center inline-flex items-center rounded-l-lg border border-2 border-gray-800 space-x-2"
                        type="button"
                    >
                        <IoMdDownload className="w-4 h-4" />
                        <span>고객 지로 저장</span>
                    </button>
                    {/* Dropdown Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300
                    font-medium text-sm px-3 py-2 text-center inline-flex items-center rounded-r-lg border border-2 border-gray-800"
                        type="button"
                    >
                        <svg className={`w-2.5 h-2.5 transform transition ${isOpen ? 'rotate-90' : ''}`}
                             aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 9 4-4-4-4" />
                        </svg>
                    </button>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className="absolute left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg w-44 mt-2 dark:bg-gray-700 shadow-lg">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                                <button
                                    className={`flex flex-row w-full items-center space-x-2 px-4 py-2 ${loading || !monthlyAcctSaveData?.length ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-200 hover:text-gray-900"}`}
                                    onClick={handleDownloadAll}
                                    disabled={loading || !monthlyAcctSaveData?.length}
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
                                        <FaSave />
                                    )}
                                    <span>{loading ? "일괄 저장중..." : "고객 지로 일괄 저장"}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
}

export default GiroPDFPrint;