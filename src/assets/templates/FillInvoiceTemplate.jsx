import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function fillInvoiceTemplate(apiData) {
    // 템플릿 PDF 파일을 불러옵니다. (예: public/assets/templates/invoice_template.pdf)
    const existingPdfBytes = await fetch('/assets/templates/invoice_template.pdf')
        .then(res => res.arrayBuffer());

    // 템플릿 PDF를 로드
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // 내장 폰트를 임베딩 (필요한 경우 커스텀 폰트도 임베딩 가능)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 예시: 고객 이름을 (100, 500) 위치에 삽입
    firstPage.drawText(apiData.customerName, {
        x: 100,
        y: 500,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    // 예시: 청구 금액을 (100, 480) 위치에 삽입
    firstPage.drawText(`금액: ${apiData.amount}`, {
        x: 100,
        y: 480,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    // 필요한 다른 데이터도 좌표를 지정하여 삽입
    // 예: 날짜, 도형, 이미지 등

    // 새 PDF 생성 후 저장
    const pdfBytes = await pdfDoc.save();

    // 예를 들어, 브라우저에서 다운로드 링크를 생성하거나 Blob으로 처리
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

// API에서 받아온 데이터를 예시로 전달
const sampleApiData = {
    customerName: '홍길동',
    amount: '100,000원'
};

fillInvoiceTemplate(sampleApiData);
