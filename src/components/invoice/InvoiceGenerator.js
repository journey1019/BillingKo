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
    const fixedColWidthSecond = secondTableWidth / 3; // 3열로 고정

    const secondRowHeight = 5.28; // 행 높이
    const totalRows = 12.9;
    const secondTableHeight = secondRowHeight * totalRows;

    doc.setFillColor(200, 200, 200); // 그림자 색
    doc.rect(secondMarginLeft + shadowOffset, secondTableY + shadowOffset, secondTableWidth, secondTableHeight, 'F');

    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(8);
    doc.text('● 당월 요금내역', secondMarginLeft, secondTableY - 2);

    const feeTableHead = [
        [
            { content: "요금 내역", styles: { halign: 'center' } },
            { content: "금액(원)", styles: { halign: 'center' } },
            { content: "계산내역", styles: { halign: 'center' } },
        ]
    ];

    const feeTableBody = [
        ["기본료", "16,000", "1대"],
        ["통신료", "932.123", "36, 300,360 Byte(s)"],
        ["수수료(변경, 휴지 등)", "0", ""],
        ["부가서비스료", "33,000", ""],
        ["기타사용료", "0", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["공급가액", "49,000", ""],
        ["부가가치세", "4,900", ""],
        ["합계금액", "53,900", ""],
        ["10원미만 절사금액", "-5", ""],
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
            cellPadding: { top: 1, right: 1.5, bottom: 1, left: 3 },
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
        didParseCell: function (data) {
            // 반대로 적용: 짝수 행에 배경색 적용 (0-indexed: row.index % 2 === 0)
            if (data.section === 'body') {
                if (data.row.index % 2 === 0) {
                    data.cell.styles.fillColor = [240, 240, 240];
                } else {
                    data.cell.styles.fillColor = [255, 255, 255];
                }
            }
        },
        didDrawCell: function (data) {
            // "공급가액" 행(인덱스 9) 위쪽에 굵은 선을 그립니다.
            if (data.section === 'body' && data.row.index === 8) {
                const posY = data.cell.y;
                doc.setLineWidth(0.5);
                doc.setDrawColor(0, 0, 0);
                doc.line(secondMarginLeft, posY, secondMarginLeft + secondTableWidth, posY);
            }
        },
        // 열 폭을 고정하여 모든 열이 동일하게 나오도록 설정
        columnStyles: {
            0: { cellWidth: fixedColWidthSecond },
            1: { cellWidth: fixedColWidthSecond },
            2: { cellWidth: fixedColWidthSecond }
        }
    });


    // ------------------------------
    // 세 번째 표: 미납 요금 내역 표 (2열 autoTable + 예약된 3열 별도 출력)
    // ------------------------------
    const thirdTableY = secondTableY + secondTableHeight + 6; // 두 번째 표 아래 6px 간격
    const thirdMarginLeft = secondMarginLeft; // 좌우 패딩 동일
    const thirdMarginRight = secondMarginRight;
    const thirdTableWidth = pageWidth - (thirdMarginLeft + thirdMarginRight);

    // 전체 세 번째 표 폭을 3등분
    const reservedThirdColWidth = thirdTableWidth / 3;         // 예약된 3열 영역 (1/3)
    const autoTableWidth = thirdTableWidth - reservedThirdColWidth; // autoTable 영역 (2/3)
    const fixedColWidthForAuto = autoTableWidth / 2;             // autoTable의 두 열 폭

    const thirdRowHeight = 4.1;
    const thirdTotalRows = 6; // 헤더 1행 + body 5행 = 6행
    const thirdTableHeight = thirdRowHeight * thirdTotalRows;

    // 그림자 효과 적용 (표보다 1px 오른쪽/아래 오프셋)
    doc.setFillColor(200, 200, 200);
    doc.rect(thirdMarginLeft + shadowOffset, thirdTableY + shadowOffset, thirdTableWidth, thirdTableHeight, 'F');

    doc.setFontSize(8);
    doc.text('● 미납 요금내역', thirdMarginLeft, thirdTableY - 2);

    // autoTable 헤더 (2열)
    const thirdTableHead = [
        [
            { content: "요금 내역", styles: { halign: 'center' } },
            { content: "금액(원)", styles: { halign: 'center' } }
        ]
    ];

    const koNonpayNotice = invoiceBasicData.find(item => item.code_name === 'ko_nonpay_notice')?.code_value || "";
    // autoTable Body 데이터 (2열)
    const thirdTableBodyAuto = [
        ["2024-12-A_10915", "434,020"],
        ["", ""],
        ["", ""],
        ["연체가산금", "8,680"],
        ["미납요금계", "442,700"],
    ];

    // 예약된 3열 데이터 (koNonpayNotice 등)
    // 여기서는 첫 행에만 값이 있고, 나머지는 빈 문자열로 처리합니다.
    const reservedThirdColumnData = [
        koNonpayNotice, // 첫 행
        "",             // 두 번째 행
        "",             // 세 번째 행
        "",             // 네 번째 행
        "",             // 다섯 번째 행
    ];

    // autoTable 생성 (2열 영역)
    const thirdTableConfig = doc.autoTable({
        startY: thirdTableY,
        margin: { left: thirdMarginLeft, right: thirdMarginRight },
        // head: thirdTableHead,
        body: thirdTableBodyAuto,
        styles: {
            font: "NanumGothic",
            fontStyle: "bold",
            fontSize: 7,
            cellPadding: { top: 1, right: 1.5, bottom: 1, left: 3 },
            textColor: [0, 0, 0],
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            overflow: 'linebreak'
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
        didParseCell: function(data) {
            if (data.section === 'body') {
                // 첫 두 열: alternate 배경 적용 (짝수 행에 회색)
                if (data.column.index < 2) {
                    if (data.row.index % 2 === 0) {
                        data.cell.styles.fillColor = [255, 255, 255];
                    } else {
                        // data.cell.styles.cellPadding = {top: 1, right: 1.5, bottom: thirdRowHeight, left: 3}
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            }
        },
        columnStyles: {
            0: { cellWidth: fixedColWidthForAuto },
            1: { cellWidth: fixedColWidthForAuto }
        }
    });

    // 예약된 3열 영역: autoTable의 오른쪽 1/3 영역에 대해 별도로 텍스트 출력
    const reservedColX = thirdMarginLeft + autoTableWidth; // 예약 영역의 x 좌표
    const reservedPadding = 2; // 예약 영역 내 여백
    const availableReservedWidth = reservedThirdColWidth - reservedPadding * 2;

    // autoTable의 각 행은 autoTableConfig.body[i].y (row의 y 좌표)로 계산할 수 있습니다.
    // 여기서는 첫 행(인덱스 0)에 해당하는 예약 영역만 처리합니다.
    if (thirdTableBodyAuto.length > 0) {
        // 첫 행의 y 좌표: autoTableConfig.body[0].y가 없다면 헤더 높이를 사용
        const firstRowY = (thirdTableConfig.body && thirdTableConfig.body[0] && thirdTableConfig.body[0].y)
            || thirdTableY + (thirdTableConfig.headHeight || 0);
        // 행 높이는 autoTableConfig.body[0].height(존재하면) 아니면 thirdRowHeight 사용
        const cellHeight = (thirdTableConfig.body && thirdTableConfig.body[0] && thirdTableConfig.body[0].height)
            || thirdRowHeight;

        // 예약 영역에 흰색 배경과 테두리를 그려 테이블 셀처럼 만듭니다.
        doc.setFillColor(255, 255, 255);   // 흰색 배경
        doc.setDrawColor(0, 0, 0);         // 검정 테두리
        doc.setLineWidth(0.3);             // 테두리 두께 0.5
        doc.rect(reservedColX, firstRowY, reservedThirdColWidth, cellHeight + 20.1, 'FD');

        // 예약 영역에 koNonpayNotice 텍스트 출력 (여백 적용)
        const lines = doc.splitTextToSize(reservedThirdColumnData[0], availableReservedWidth);
        doc.setFont("NanumGothic", "bold");
        doc.setFontSize(7);
        doc.text(lines, reservedColX + reservedPadding, firstRowY + reservedPadding, { baseline: 'top' });
    }



    // ------------------------------
    // 네 번째 표: 총 납부액 표 (한 행)
    // ------------------------------
    const fourthTableY = thirdTableY + thirdTableHeight + 1;
    const fourthMarginLeft = thirdMarginLeft;
    const fourthMarginRight = thirdMarginRight;
    const fourthTableWidth = pageWidth - (fourthMarginLeft + fourthMarginRight);
    const fixedColWidthFourth = fourthTableWidth / 3;
    const fourthRowHeight = 5.3;
    const fourthTableHeight = fourthRowHeight * 1;

    doc.setFillColor(200, 200, 200);
    doc.rect(fourthMarginLeft + shadowOffset, fourthTableY + shadowOffset, fourthTableWidth, fourthTableHeight, 'F');

    const fourthTableBody = [
        ["총 납부액", "53,900", ""]
    ];

    doc.autoTable({
        startY: fourthTableY,
        margin: { left: fourthMarginLeft, right: fourthMarginRight },
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
            fillColor: [255, 255, 255]
        },
        columnStyles: {
            0: { cellWidth: fixedColWidthFourth },
            1: { cellWidth: fixedColWidthFourth },
            2: { cellWidth: fixedColWidthFourth }
        }
    });


    /** ----- 다섯 번째 블록: 공급자 정보 ----- */
    const fifthMarginLeft = 36;
    const fifthMarginRight = 36;
    const fifthBlockWidth = pageWidth - (fifthMarginLeft + fifthMarginRight);
    const fifthBlockY = fourthTableY + fourthTableHeight + 10; // 네 번째 표 아래 5px 간격

    // 왼쪽 영역: 이미지 (크기 및 위치 고정)
    const leftImageWidth = 40;  // 원하는 너비
    const leftImageHeight = 10; // 원하는 높이
    doc.addImage(companyLogoBase64, 'PNG', fifthMarginLeft, fifthBlockY, leftImageWidth, leftImageHeight);

    // 오른쪽 영역: 텍스트
    const rightBlockX = fifthMarginLeft + leftImageWidth; // 이미지 오른쪽 시작
    const rightBlockWidth = fifthBlockWidth - leftImageWidth;

    // 공급자 등록번호 추출
    const ko_regist_number = invoiceBasicData.find(item => item.code_name === 'ko_regist_number')?.code_value || "";

    // "코리아오브컴 주식회사" 텍스트: 큰 글씨, 좌우 간격을 위해 maxWidth를 약간 줄임
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(20);
    doc.text("코리아오브컴 주식회사", rightBlockX, fifthBlockY + 10, { maxWidth: rightBlockWidth - 10 });

    // "공급자 등록번호 : {ko_regist_number}" 텍스트: extrabold 스타일
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(10);
    doc.text("공급자 등록번호 : " + ko_regist_number, rightBlockX, fifthBlockY + 20, { maxWidth: rightBlockWidth });


    return doc;
};
