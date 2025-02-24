// src/utils/pdfFiller.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * API 데이터(apiData)를 받아 미리 디자인된 PDF 템플릿에 데이터를 채워 넣고,
 * 완성된 PDF를 브라우저에서 열 수 있도록 URL을 반환합니다.
 */
export async function fillInvoiceTemplate(apiData) {
    // 템플릿 PDF 파일을 public 폴더 내 assets/templates 경로에서 불러옵니다.
    const templateUrl = '/assets/templates/invoice_template.pdf';
    const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

    // 템플릿 PDF 로드
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // 내장 Helvetica 폰트 임베딩 (필요시 커스텀 폰트 임베딩 가능)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 예시: 고객 이름을 (100, 500) 좌표에 삽입
    firstPage.drawText(apiData.customerName, {
        x: 100,
        y: 500,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    // 예시: 청구 금액을 (100, 480) 좌표에 삽입
    firstPage.drawText(`금액: ${apiData.amount}`, {
        x: 100,
        y: 480,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    // 추가 데이터 삽입 (예: 날짜, 주소 등 필요한 요소들을 같은 방식으로 채워 넣습니다.)
    firstPage.drawText(`날짜: ${apiData.date}`, {
        x: 100,
        y: 460,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    // PDF 문서를 저장하고 Blob URL 생성
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
}
