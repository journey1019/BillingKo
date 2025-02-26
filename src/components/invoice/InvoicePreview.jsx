import React from 'react';
import { generateInvoicePage1 } from './InvoicePage1.js';
import { generateInvoicePage2 } from './InvoicePage2.js';
import companyLogoBase64 from '@/assets/images/companyLogoBase64';
import { FaPrint } from "react-icons/fa";


const InvoicePreview = ({ invoiceBasicData }) => {
    const handleGeneratePdf = () => {
        // 첫 페이지 생성
        let doc = generateInvoicePage1(invoiceBasicData);
        // 두 번째 페이지 생성 (doc 객체를 넘김)
        doc = generateInvoicePage2(doc, {
            ...invoiceBasicData,
            companyLogoBase64,
        })

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
                <FaPrint />
                <span>청구서 출력</span>
            </button>
        </div>
    );
};

export default InvoicePreview;
