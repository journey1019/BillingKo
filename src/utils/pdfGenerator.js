import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateInvoicePDF(invoiceBasicData) {
    // 새 PDF 문서 생성 및 fontkit 등록
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // 페이지 생성 및 사이즈 가져오기
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // 좌측 여백: 48px
    const leftMargin = 48;
    // 상단으로부터의 위치는 절대 좌표 (pdf-lib는 y=0을 페이지 하단으로 함)
    // 따라서 topOffset(px) = height - (원하는 위쪽 간격)
    const imageTopOffset = 37; // 페이지 위쪽에서 37px 아래
    const imageHeight = 26;
    const imageWidth = 104;
    const imageX = leftMargin;
    // 이미지의 y 좌표: 페이지 상단에서 imageTopOffset만큼 내린 위치에서 이미지 높이만큼 빼줌
    const imageY = height - imageTopOffset - imageHeight;

    // 폰트 불러오기 (정적 TTF 파일, 예: NotoSansKR-Regular.ttf)
    const fontUrl = '/assets/fonts/NotoSansKR-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes, { subset: false });

    // 회사 로고 이미지 불러오기 (예: PNG)
    const imageUrl = '/assets/images/company-logo.png';
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(imageBytes);

    // 이미지 그리기
    page.drawImage(logoImage, {
        x: imageX,
        y: imageY,
        width: imageWidth,
        height: imageHeight,
    });

    // 첫 번째 텍스트 라인: ko_company_name (높이 10px)
    const companyNameData = invoiceBasicData.find(item => item.code_name === "ko_company_name");
    const companyNameText = companyNameData ? companyNameData.code_value : "";
    // 이미지 아래 10px 간격
    const companyNameY = imageY - 10;
    page.drawText(companyNameText, {
        x: imageX,
        y: companyNameY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    // 두 번째 라인: ko_post_code와 ko_address (나란히, 높이 10px)
    const postCodeData = invoiceBasicData.find(item => item.code_name === "ko_post_code");
    const addressData = invoiceBasicData.find(item => item.code_name === "ko_address");
    const postCodeText = postCodeData ? postCodeData.code_value : "";
    const addressText = addressData ? addressData.code_value : "";
    const postAddressY = companyNameY - 10;
    // 가로 여백: 전체 사용가능 너비 = page width - (leftMargin*2)
    const availableWidth = width - leftMargin * 2;
    const halfWidth = availableWidth / 2;
    // ko_post_code는 왼쪽 컬럼, ko_address는 오른쪽 컬럼
    page.drawText(postCodeText, {
        x: imageX,
        y: postAddressY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(addressText, {
        x: imageX + halfWidth,
        y: postAddressY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    // 세 번째 라인: "고객센터 ko_tel_number, Fax ko_fax_number" (높이 10px)
    const telData = invoiceBasicData.find(item => item.code_name === "ko_tel_number");
    const faxData = invoiceBasicData.find(item => item.code_name === "ko_fax_number");
    const telText = telData ? "고객센터 " + telData.code_value : "";
    const faxText = faxData ? "Fax " + faxData.code_value : "";
    const telFaxY = postAddressY - 10;
    page.drawText(telText, {
        x: imageX,
        y: telFaxY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(faxText, {
        x: imageX + halfWidth,
        y: telFaxY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    // 네 번째 라인: "홈페이지 ko_homepage" (높이 10px)
    const homepageData = invoiceBasicData.find(item => item.code_name === "ko_homepage");
    const homepageText = homepageData ? "홈페이지 " + homepageData.code_value : "";
    const homepageY = telFaxY - 10;
    page.drawText(homepageText, {
        x: imageX,
        y: homepageY,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    // PDF 저장 및 Blob URL 반환
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}
