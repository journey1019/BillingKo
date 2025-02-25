import jsPDF from 'jspdf';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal'; // Base64 문자열 형태의 폰트 파일
import companyLogoBase64 from '@/assets/images/companyLogoBase64'; // Base64 문자열 형태의 회사 로고 이미지

export const generateInvoicePDF = (invoiceBasicData) => {
    const doc = new jsPDF();

    // 한글 지원 폰트 추가
    doc.addFileToVFS("NanumGothic.ttf", nanumGothicFont);
    doc.addFont("NanumGothic.ttf", "NanumGothic", "normal");
    doc.setFont("NanumGothic");
    doc.setFontSize(8);

    // 회사 로고 이미지: 위치 (48,37), 크기 (104 x 26)
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);
    // doc.addImage(companyLogoBase64, 'PNG', 48, 37, 104, 26);

    // invoiceBasicData에서 각 항목 추출
    const companyName = invoiceBasicData.find(item => item.code_name === 'ko_company_name')?.code_value || '';
    const postCode = invoiceBasicData.find(item => item.code_name === 'ko_post_code')?.code_value || '';
    const address = invoiceBasicData.find(item => item.code_name === 'ko_address')?.code_value || '';
    const telNumber = invoiceBasicData.find(item => item.code_name === 'ko_tel_number')?.code_value || '';
    const faxNumber = invoiceBasicData.find(item => item.code_name === 'ko_fax_number')?.code_value || '';
    const homepage = invoiceBasicData.find(item => item.code_name === 'ko_homepage')?.code_value || '';

    // Basic Company Info
    const firstX = 15;
    const firstY = 10;
    const firstHeight = 10;
    const firstGap = 3.5; // 텍스트 사이 약간의 간격

    const yCompanyName1 = firstY + firstHeight;
    const yPostAddress1 = yCompanyName1 + firstGap;
    const yTelFax1 = yPostAddress1 + firstGap;
    const yHomepage1 = yTelFax1 + firstGap;


    // 좌표 계산
    const imageX = 48;
    const imageY = 27;
    const imageHeight = 26;
    const gap = 2; // 이미지와 텍스트 사이 약간의 간격

    const yCompanyName = imageY + imageHeight + gap;     // 37 + 26 + 2 = 65
    const yPostAddress = yCompanyName + 10;                // 65 + 10 = 75
    const yTelFax = yPostAddress + 10;                     // 75 + 10 = 85
    const yHomepage = yTelFax + 10;                        // 85 + 10 = 95

    // 출력할 텍스트 배치
    // 1. ko_company_name (전체 너비 사용, x:48)
    doc.text(companyName, firstX, yCompanyName1);

    // 2. ko_post_code와 ko_address를 한 줄에 배치
    //    왼쪽에는 postCode, 오른쪽은 address (예: postCode at x:48, address at x:48+50)
    const postAddressText = `(우)${postCode}  ${address}`;
    doc.text(postAddressText, firstX, yPostAddress1);

    // 3. 고객센터 및 Fax 정보를 한 줄에 배치
    const telFaxText = `고객센터 ${telNumber}, Fax ${faxNumber}`;
    doc.text(telFaxText, firstX, yTelFax1);

    // 4. 홈페이지 정보 한 줄에 배치
    doc.text(`홈페이지: ${homepage}`, firstX, yHomepage1);

    return doc;
};
