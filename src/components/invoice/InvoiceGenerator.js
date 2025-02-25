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
    const boxY = 95;           // 원하는 y 좌표
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

    /** 첫 번째 표: 기본 Account 표 */
    const tableY = 110;
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


    // ------------------------------
    // 두 번째 표: 미납 요금 내역 표
    // ------------------------------
    const secondTableY = 146; // 표 시작 Y 좌표
    const secondMarginLeft = 18;
    const secondMarginRight = 18;
    const secondTableWidth = pageWidth - (secondMarginLeft + secondMarginRight);

    // 표 전체 행 수: 헤더 1행 + body 15행 = 16행. (rowHeight 약 7.3로 가정)
    const secondRowHeight = 6.8; // 그림자
    const totalRows = 12.9;
    const secondTableHeight = secondRowHeight * totalRows;

    // 그림자 효과 적용 (표보다 약간 오른쪽, 아래로 오프셋)
    doc.setFillColor(200, 200, 200); // 연한 회색
    doc.rect(secondMarginLeft + shadowOffset, secondTableY + shadowOffset, secondTableWidth, secondTableHeight, 'F');

    // 표 위에 "● 당월 내역" 텍스트(필요 시)
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(8);
    doc.text('● 당월 요금내역', secondMarginLeft, secondTableY - 2);

    // Header 정의
    const feeTableHead = [
        [
            { content: "요금 내역", styles: { halign: 'center' } },
            { content: "금액(원)", styles: { halign: 'center' } },
            { content: "계산내역", styles: { halign: 'center' } },
        ]
    ];

    // Body 데이터 정의
    const feeTableBody = [
        // 1행
        // ["당월 요금내역", "", ""],
        // 2행
        ["기본료", "16,000", "1대"],
        // 3행
        ["통신료", "932.123", "36, 300,360 Byte(s)"],
        // 4행
        ["수수료(변경, 휴지 등)", "0", ""],
        // 5행
        ["부가서비스료", "33,000", ""],
        // 6행
        ["기타사용료", "0", ""],
        // 7행 ~ 10행: 빈 행
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        // 11행
        ["공급가액", "49,000", ""],
        // 12행
        ["부가가치세", "4,900", ""],
        // 13행
        ["합계금액", "53,900", ""],
        // 14행
        ["10원미만 절사금액", "-5", ""],
        // 15행
        ["당월납부액", "53,900", ""],
    ];

    doc.autoTable({
        startY: secondTableY,
        margin: { left: secondMarginLeft, right: secondMarginRight },
        head: feeTableHead,
        body: feeTableBody,
        styles: {
            font: "NanumGothic",
            fontStyle: "bold",
            fontSize: 7,
            cellPadding: { top: 1.5, right: 1.5, bottom: 1.5, left: 3 }, // 왼쪽 패딩 증가
            // cellPadding: 1.5,
            textColor: [0, 0, 0],
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        didDrawCell: function (data) {
            // "공급가액" 행(인덱스 9)의 첫 번째 셀 위쪽에 굵은 선을 그립니다.
            if (data.section === 'body' && data.row.index === 9) {
                // 해당 셀의 상단에 굵은 선을 그립니다.
                const posY = data.cell.y; // 셀 상단 좌표
                doc.setLineWidth(0.5); // 굵은 선을 0.5로 설정
                doc.setDrawColor(0, 0, 0);
                doc.line(secondMarginLeft, posY, secondMarginLeft + secondTableWidth, posY);
            }
        },
    });


    // ------------------------------
    // 세 번째 표: 미납 요금 내역 표
    // ------------------------------
    const thirdTableY = secondTableY + secondTableHeight + 6; // 두 번째 표와 동일 간격(10px) 아래에 시작
    const thirdMarginLeft = secondMarginLeft; // 좌우 패딩 동일
    const thirdMarginRight = secondMarginRight;
    const thirdTableWidth = pageWidth - (thirdMarginLeft + thirdMarginRight);

    // 세 번째 표의 행 높이 및 행 수 (헤더 1행 + body 5행)
    const thirdRowHeight = 4.9;
    const thirdTotalRows = 1 + 5; // 6행
    const thirdTableHeight = thirdRowHeight * thirdTotalRows;

    // 그림자 효과 적용 (표보다 1px 오른쪽, 아래로 오프셋)
    doc.setFillColor(200, 200, 200); // 연한 회색
    doc.rect(thirdMarginLeft + shadowOffset, thirdTableY + shadowOffset, thirdTableWidth, thirdTableHeight, 'F');

    doc.setFontSize(8);
    doc.text('● 미납 요금내역', thirdMarginLeft, thirdTableY - 2);

    // 세 번째 표 Body 데이터 정의
    const koNonpayNotice = invoiceBasicData.find(item => item.code_name === 'ko_nonpay_notice')?.code_value || "";
    const thirdTableBody = [
        // 1행
        ["2024-12-A_10915", "434,020", koNonpayNotice],
        // 2행 (빈)
        ["", "", ""],
        // 3행 (빈)
        ["", "", ""],
        // 4행
        ["연체가산금", "8,680", ""],
        // 5행
        ["미납요금계", "442,700", ""],
    ];

    doc.autoTable({
        startY: thirdTableY,
        margin: { left: thirdMarginLeft, right: thirdMarginRight },
        body: thirdTableBody,
        styles: {
            font: "NanumGothic",
            fontStyle: "bold",
            fontSize: 7,
            cellPadding: { top: 1.5, right: 1.5, bottom: 1.5, left: 3 },
            textColor: [0, 0, 0],
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            overflow: 'linebreak',  // 텍스트 여러 줄 허용
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240], // 홀수 행에 회색 배경 적용 (전체 열)
        },
        columnStyles: {
            // 세 번째 열은 항상 흰색 배경 (배경 스타일 적용하지 않음)
            2: { fillColor: [255, 255, 255] }
        },
        didDrawCell: function (data) {
            // "공급가액" 행(인덱스 9)의 첫 번째 셀 위쪽에 굵은 선을 그립니다.
            if (data.section === 'body' && data.row.index === 4) {
                // 해당 셀의 상단에 굵은 선을 그립니다.
                const posY = data.cell.y; // 셀 상단 좌표
                doc.setLineWidth(0.5); // 굵은 선을 0.5로 설정
                doc.setDrawColor(0, 0, 0);
                doc.line(thirdMarginLeft, posY, thirdMarginLeft + thirdTableWidth, posY);
            }
        },
    });


    // ------------------------------
    // 네 번째 표: 총 납부액 표 (한 행)
    // ------------------------------
    const fourthTableY = thirdTableY + thirdTableHeight + 1; // 세 번째 표 아래 1px 간격
    const fourthMarginLeft = thirdMarginLeft;
    const fourthMarginRight = thirdMarginRight;
    const fourthTableWidth = pageWidth - (fourthMarginLeft + fourthMarginRight);
    const fourthRowHeight = 5.3; // 세 번째 표와 동일한 행 높이
    const fourthTableHeight = fourthRowHeight * 1; // 1행

    // 그림자 효과 적용 (네 번째 표)
    doc.setFillColor(200, 200, 200); // 연한 회색
    doc.rect(fourthMarginLeft + shadowOffset, fourthTableY + shadowOffset + 1, fourthTableWidth, fourthTableHeight, 'F');

    const fourthTableBody = [
        ["총 납부액", "53,900", ""]
    ];

    doc.autoTable({
        startY: fourthTableY,
        margin: { left: fourthMarginLeft, right: fourthMarginRight },
        // 헤더는 없으므로 body만 지정합니다.
        body: fourthTableBody,
        styles: {
            font: "NanumGothic",
            fontStyle: "bold",
            fontSize: 8,
            cellPadding: { top: 1.5, right: 1.5, bottom: 1.5, left: 3 },
            textColor: [0, 0, 0],
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            overflow: 'linebreak',
            fillColor: [255, 255, 255]  // 셀 배경 흰색
        },
        bodyStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            fillColor: [255, 255, 255]  // 셀 배경 흰색
        },
    });


    return doc;
};
