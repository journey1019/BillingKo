// src/components/InvoicePDFGenerator.jsx
import React, { useState } from 'react';

// 기본 vfs_fonts에는 Roboto 폰트만 포함되어 있습니다.
// 커스텀 빌드를 통해 한글 폰트를 추가해야 합니다.
// 아래 코드는 예시이므로, 실제 프로젝트에서는 커스텀 VFS 파일을 생성해야 합니다.
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export default function InvoicePDFGenerator({ invoiceBasicData }) {
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleGeneratePDF = () => {
        // invoiceBasicData에서 값 추출
        const addressData = invoiceBasicData.find(item => item.code_name === "ko_address");
        const postCodeData = invoiceBasicData.find(item => item.code_name === "ko_post_code");
        const companyNameData = invoiceBasicData.find(item => item.code_name === "ko_company_name");

        const addressText = addressData ? addressData.code_value : "";
        const postCodeText = postCodeData ? postCodeData.code_value : "";
        const companyNameText = companyNameData ? companyNameData.code_value : "";

        const docDefinition = {
            content: [
                {
                    columns: [
                        { text: addressText, fontSize: 12 },
                        { text: postCodeText, fontSize: 12 },
                        { text: companyNameText, fontSize: 12 }
                    ]
                }
            ],
            defaultStyle: {
                // 여기서 커스텀 폰트를 사용하도록 설정할 수 있습니다.
                // 예를 들어, 'NotoSansKR' 폰트를 사용하려면 해당 폰트가 VFS에 포함되어 있어야 합니다.
                font: 'Roboto'
            }
        };

        pdfMake.createPdf(docDefinition).getBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            window.open(url, '_blank');
        });
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
