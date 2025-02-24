import { useState } from 'react';
import { fillInvoiceTemplate } from "@/utils/pdfFilter.js";

export default function InvoiceTemplateFiller() {
    const [pdfUrl, setPdfUrl] = useState(null);

    // 예시 API 데이터 (실제 사용 시 API 호출하여 데이터를 받아오면 됩니다.)
    const sampleApiData = {
        customerName: '홍길동',
        amount: '100,000원',
        date: '2025-03-01'
    };

    const handleGeneratePDF = async () => {
        try {
            const generatedUrl = await fillInvoiceTemplate(sampleApiData);
            setPdfUrl(generatedUrl);
            // 새 창에서 PDF 열기
            window.open(generatedUrl, '_blank');
        } catch (error) {
            console.error('PDF 생성 중 오류 발생:', error);
        }
    };

    return (
        <div>
            <h1>청구서 PDF 생성</h1>
            <button onClick={handleGeneratePDF}>PDF 생성하기</button>
            {pdfUrl && (
                <p>
                    PDF가 생성되었습니다. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">여기서 보기</a>
                </p>
            )}
        </div>
    );
}
