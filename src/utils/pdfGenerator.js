import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateInvoicePDF(invoiceBasicData) {
    // 새 PDF 문서 생성 및 fontkit 등록
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const margin = 50;
    const topY = height - margin;
    const columnWidth = (width - 2 * margin) / 3;

    let customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // try {
    //     // 정적 TTF 파일 사용: 반드시 변수형이 아닌 정적 버전을 사용해야 합니다.
    //     const fontBytes = await fetch('@/assets/fonts/NotoSansKR-VariableFont_wght.ttf').then(res => res.arrayBuffer());
    //     customFont = await pdfDoc.embedFont(fontBytes);
    // } catch (error) {
    //     console.error("Custom font embedding failed, falling back to Helvetica", error);
    //     // 폰트 임베딩에 실패하면 내장 Helvetica 폰트로 대체
    //     customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // }

    // invoiceBasicData에서 필요한 값 추출
    const addressData = invoiceBasicData.find(item => item.code_name === "ko_address");
    const postCodeData = invoiceBasicData.find(item => item.code_name === "ko_post_code");
    const companyNameData = invoiceBasicData.find(item => item.code_name === "ko_company_name");

    const addressText = addressData ? addressData.code_value : "";
    const postCodeText = postCodeData ? postCodeData.code_value : "";
    const companyNameText = companyNameData ? companyNameData.code_value : "";

    // PDF 상단에 세 컬럼으로 텍스트 삽입 (커스텀 폰트 또는 fallback 폰트 사용)
    page.drawText(addressText, {
        x: margin,
        y: topY,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0)
    });
    page.drawText(postCodeText, {
        x: margin + columnWidth,
        y: topY,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0)
    });
    page.drawText(companyNameText, {
        x: margin + 2 * columnWidth,
        y: topY,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0)
    });

    // PDF 저장 및 Blob URL 반환
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}
