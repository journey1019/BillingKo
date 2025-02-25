import jsPDF from 'jspdf';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal'; // Base64 문자열 형태의 폰트 파일
import nanumGothicBoldFont from '@/assets/fonts/NanumGothic-Bold'; // Base64 문자열 형태의 Bold 폰트 파일
import nanumGothicExtraBoldFont from '@/assets/fonts/NanumGothic-ExtraBold'; // Base64 문자열 형태의 Extra Bold 폰트 파일
import companyLogoBase64 from '@/assets/images/companyLogoBase64'; // Base64 문자열 형태의 회사 로고 이미지

export const generateInvoicePDF = (invoiceBasicData) => {
    const doc = new jsPDF();

    // 한글 지원 폰트 추가
    doc.addFileToVFS("NanumGothic.ttf", nanumGothicFont);
    doc.addFont("NanumGothic.ttf", "NanumGothic", "normal");
    doc.addFileToVFS("NanumGothic-Bold.ttf", nanumGothicBoldFont);
    doc.addFont("NanumGothic-Bold.ttf", "NanumGothic", "bold");
    doc.addFileToVFS("NanumGothic-ExtraBold.ttf", nanumGothicExtraBoldFont);
    doc.addFont("NanumGothic-ExtraBold.ttf", "NanumGothic", "extrabold");
    // 기본 폰트는 일반체로 설정
    doc.setFont("NanumGothic", "normal");
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
    const subjectHeader = invoiceBasicData.find(item => item.code_name === 'ko_subject_header')?.code_value || '';

    // Basic Company Info
    const pageWidth = doc.internal.pageSize.getWidth(); // 전체 너비

    const firstX = 15;
    const firstY = 10;
    const firstHeight = 10;
    const firstGap = 3.5; // 텍스트 사이 약간의 간격

    const secondX = 85;
    const secondY = 45;
    const secondGap = 15;

    const thridY = 105;

    const yCompanyName1 = firstY + firstHeight; // 20
    const yPostAddress1 = yCompanyName1 + firstGap; // 23.5
    const yTelFax1 = yPostAddress1 + firstGap; // 27
    const yHomepage1 = yTelFax1 + firstGap; // 30.5

    const ySubject = secondY;
    const ySendPrecious = ySubject + secondGap;
    const ySendPostCode = ySendPrecious + secondGap;


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

    // 5. 수신처(ko_subject_header)를 오른쪽에서 30px 떨어진 위치에 배치
    // Bold 스타일과 폰트 크기 10 또는 원하는 크기로 설정
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(8);
    doc.setFontSize(10);
    doc.text('부산시 중구 충장대로5번길 63-1 (중앙동4가, 오션빌딩)', secondX, ySubject);

    const sendAliasX = 120;
    doc.text('(주)자운해운', sendAliasX, ySendPrecious);
    // 옵션 { align: 'right' }를 사용하면, 텍스트의 오른쪽 끝이 subjectX에 맞춰집니다.
    const preciousPostcodeX = pageWidth - 25;
    doc.text('귀중', preciousPostcodeX, ySendPrecious, { align: 'right' });

    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(15);
    doc.text('00000', preciousPostcodeX, ySendPostCode, { align: 'right' });


    // TailwindCSS의 클래스에 해당하는 스타일 값 설정
    const paddingX = 60;        // 좌우 패딩 60px
    const paddingY = 10;        // 상하 패딩 10px
    const boxX = paddingX;
    const boxY = 105;           // 원하는 y 좌표
    const boxWidth = pageWidth - paddingX * 2;
    const boxHeight = paddingY; // 텍스트 높이(10px) + 상하 패딩

    // 테두리 색상: Tailwind border-gray-800 (예: #1F2937 → rgb(31,41,55))
    doc.setFillColor(255, 255, 255);      // 배경 흰색
    doc.setDrawColor(31, 41, 55);         // 테두리 색상
    doc.setLineWidth(0.3);                // 테두리 두께

    // 둥근 모서리 사각형 그리기 (jsPDF 1.5.3 이상에서 지원)
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'FD'); // 'FD' = fill & stroke

    // 텍스트 설정: Bold 폰트, 폰트 크기 15
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(10);

    // 텍스트를 중앙 정렬로 배치 (사각형 중앙에 위치)
    // 텍스트의 x 좌표는 페이지 중앙, y 좌표는 사각형 중앙(필요에 따라 보정)
    const textX = pageWidth / 2;
    const textY = boxY + boxHeight / 2 + 1.5; // +5는 baseline 조정 (텍스트 높이에 따라 조정)
    const yearMonthText = `${`2025년 2월`} 통신요금 청구서`
    doc.text(yearMonthText, textX, textY, { align: 'center' });

    return doc;
};
