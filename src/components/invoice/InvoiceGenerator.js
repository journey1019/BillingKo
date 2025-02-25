// src/components/Invoice/InvoiceGenerator.js
import jsPDF from 'jspdf';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal';

// 각 코드명에 해당하는 PDF 상의 위치를 미리 정의합니다.
const positionConfig = {
    ko_address: { x: 20, y: 30 },
    ko_post_code: { x: 20, y: 40 },
    ko_company_name: { x: 20, y: 50 },
    ko_tel_number: { x: 20, y: 60 },
    ko_fax_number: { x: 20, y: 70 },
    // 추가 항목들은 필요에 따라 추가
};

export const generateInvoicePDF = (invoiceBasicData) => {
    const doc = new jsPDF();

    // 한글 지원을 위한 커스텀 폰트 추가
    doc.addFileToVFS("NanumGothic.ttf", nanumGothicFont);
    doc.addFont("NanumGothic.ttf", "NanumGothic", "normal");
    doc.setFont("NanumGothic");

    // invoiceBasicData를 순회하며, 정의된 좌표에 텍스트를 삽입합니다.
    invoiceBasicData.forEach(item => {
        const { code_name, code_value } = item;
        const pos = positionConfig[code_name];
        if (pos) {
            doc.text(code_value, pos.x, pos.y);
        }
    });

    return doc;
};
