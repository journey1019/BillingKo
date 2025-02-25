import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(10);

    // 텍스트를 중앙 정렬로 배치 (사각형 중앙에 위치)
    // 텍스트의 x 좌표는 페이지 중앙, y 좌표는 사각형 중앙(필요에 따라 보정)
    const textX = pageWidth / 2;
    const textY = boxY + boxHeight / 2 + 1.5; // +5는 baseline 조정 (텍스트 높이에 따라 조정)
    const yearMonthText = `${`2025년 2월`} 통신요금 청구서`
    doc.text(yearMonthText, textX, textY, { align: 'center' });

    /** [표 생성 시작] */
    // // 표는 헤더 영역 아래 10px 떨어진 위치에 생성
    // const tableY = 120;
    // const tableX = 36; // 좌우 패딩 72px
    // const tableWidth = pageWidth - 72; // 전체 너비 - (72*2)
    // const rowHeight = 10;
    // const numRows = 4;
    // const tableHeight = rowHeight * numRows;
    //
    // // 표에 들어갈 내용 (예시 값; 실제 값은 invoiceBasicData에서 추출하거나 API에서 받아옴)
    // const billingNumber = "2025-01-A_10915";
    // const writeDate = "2025-02-05";
    // const customerNumber = "A_10915";
    // const customerName = "(주)태화산업";
    // const usagePeriod = "2025-01-01 ~ 2025-01-31";
    // const paymentDue = "2025-02-28 까지";
    // const paymentAccount = invoiceBasicData.find(item => item.code_name === 'ko_payment_account')?.code_value || '';
    //
    // // 표 셀 배치를 위한 계산
    // const leftHalfWidth = tableWidth / 2;
    // const rightHalfWidth = tableWidth / 2;
    // const leftLabelWidth = leftHalfWidth * 0.3;
    // const leftValueWidth = leftHalfWidth * 0.7;
    // const rightLabelWidth = rightHalfWidth * 0.3;
    // const rightValueWidth = rightHalfWidth * 0.7;
    //
    // doc.setFontSize(8);
    //
    // // 표 외곽선 그리기
    // doc.setLineWidth(0.3);
    // doc.setDrawColor(31, 41, 55);
    // doc.rect(tableX, tableY, tableWidth, tableHeight);
    //
    // // 행 구분 선 그리기 (수평선)
    // for (let i = 1; i < numRows; i++) {
    //     doc.line(tableX, tableY + i * rowHeight, tableX + tableWidth, tableY + i * rowHeight);
    // }
    //
    // // 열 구분 선 그리기 (수직선)
    // // 왼쪽 그룹과 오른쪽 그룹을 구분하는 선
    // doc.line(tableX + leftHalfWidth, tableY, tableX + leftHalfWidth, tableY + tableHeight);
    // // 왼쪽 그룹 내: 라벨과 값 구분 선 (행 1~3)
    // doc.line(tableX + leftLabelWidth, tableY, tableX + leftLabelWidth, tableY + rowHeight * 3);
    // // 오른쪽 그룹 내: 라벨과 값 구분 선 (행 1~3)
    // doc.line(tableX + leftHalfWidth + rightLabelWidth, tableY, tableX + leftHalfWidth + rightLabelWidth, tableY + rowHeight * 3);
    //
    // // 표 내부 텍스트 출력: 텍스트 여백
    // const cellMarginX = 2;
    // const cellTextYOffset = rowHeight / 2 + 1; // 텍스트의 수직 위치 보정
    //
    // let currentRowY = tableY + cellTextYOffset;
    // // 행 1: 청구번호 | billingNumber || 작성일자 | writeDate
    // doc.text("청구번호", tableX + cellMarginX, currentRowY);
    // doc.text(billingNumber, tableX + leftLabelWidth + cellMarginX, currentRowY);
    // doc.text("작성일자", tableX + leftHalfWidth + cellMarginX, currentRowY);
    // doc.text(writeDate, tableX + leftHalfWidth + rightLabelWidth + cellMarginX, currentRowY);
    //
    // // 행 2: 고객번호 | customerNumber || 고객성명 | customerName
    // currentRowY += rowHeight;
    // doc.text("고객번호", tableX + cellMarginX, currentRowY);
    // doc.text(customerNumber, tableX + leftLabelWidth + cellMarginX, currentRowY);
    // doc.text("고객성명", tableX + leftHalfWidth + cellMarginX, currentRowY);
    // doc.text(customerName, tableX + leftHalfWidth + rightLabelWidth + cellMarginX, currentRowY);
    //
    // // 행 3: 사용기간 | usagePeriod || 납부기한 | paymentDue
    // currentRowY += rowHeight;
    // doc.text("사용기간", tableX + cellMarginX, currentRowY);
    // doc.text(usagePeriod, tableX + leftLabelWidth + cellMarginX, currentRowY);
    // doc.text("납부기한", tableX + leftHalfWidth + cellMarginX, currentRowY);
    // doc.text(paymentDue, tableX + leftHalfWidth + rightLabelWidth + cellMarginX, currentRowY);
    //
    // // 행 4: 납입은행 | paymentAccount (오른쪽 그룹은 비워둠)
    // currentRowY += rowHeight;
    // doc.text("납입은행", tableX + cellMarginX, currentRowY);
    // doc.text(paymentAccount, tableX + leftLabelWidth + cellMarginX, currentRowY);


    /** 표 시작 Y 좌표 및 좌우 패딩 설정 */
    const tableY = 120;
    const marginLeft = 18;
    const marginRight = 18;
    const tableWidth = pageWidth - (marginLeft + marginRight);
    const rowHeight = 7.3; // Shadow Height
    const numRows = 4;
    const tableHeight = rowHeight * numRows;

    // 표에 들어갈 내용 (실제 값은 invoiceBasicData 또는 API에서 추출)
    const billingNumber = "2025-01-A_10915";
    const writeDate = "2025-02-05";
    const customerNumber = "A_10915";
    const customerName = "(주)태화산업";
    const usagePeriod = "2025-01-01 ~ 2025-01-31";
    const paymentDue = "2025-02-28 까지";
    const paymentAccount = invoiceBasicData.find(item => item.code_name === 'ko_payment_account')?.code_value || '';

    // [그림자 효과 적용]
    // 그림자는 표보다 약간 오른쪽과 아래로 오프셋된 사각형으로 그립니다.
    const shadowOffset = 1;
    doc.setFillColor(200, 200, 200); // 연한 회색
    doc.rect(marginLeft + shadowOffset, tableY + shadowOffset, tableWidth, tableHeight, 'F');

    // 표 테두리 선 스타일 지정 (그리기 전에 전역 설정)
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);

    // jspdf-autotable을 사용하여 표 생성
    doc.autoTable({
        startY: tableY,
        margin: { left: marginLeft, right: marginRight },
        theme: 'grid', // grid 테마를 사용하면 테두리와 내부 선이 자동으로 그려집니다.
        head: [
            [
                { content: "청구번호", styles: { halign: 'center' } },
                { content: billingNumber, styles: { halign: 'left' } },
                { content: "작성일자", styles: { halign: 'center' } },
                { content: writeDate, styles: { halign: 'left' } }
            ]
        ],
        body: [
            [
                { content: "고객번호", styles: { halign: 'center' } },
                { content: customerNumber, styles: { halign: 'left' } },
                { content: "고객성명", styles: { halign: 'center' } },
                { content: customerName, styles: { halign: 'left' } }
            ],
            [
                { content: "사용기간", styles: { halign: 'center' } },
                { content: usagePeriod, styles: { halign: 'left' } },
                { content: "납부기한", styles: { halign: 'center' } },
                { content: paymentDue, styles: { halign: 'left' } }
            ],
            [
                { content: "납입은행", styles: { halign: 'center' } },
                { content: paymentAccount, colSpan: 3, styles: { halign: 'left' } }
            ]
        ],
        styles: {
            font: "NanumGothic",
            fontStyle: "extrabold",      // 모든 텍스트 Bold
            fontSize: 8,
            textColor: [0, 0, 0],   // 텍스트 색상: 검정
            cellPadding: 2,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'extrabold',
            lineWidth: 0.3, // Line Weight
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            lineWidth: 0.3, // Line Weight
            lineColor: [0, 0, 0]
        },
    });


    return doc;
};
