/** InvoicePage1.js */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal';         // Base64 문자열 형태의 일반 폰트
import nanumGothicBoldFont from '@/assets/fonts/NanumGothic-Bold';          // Base64 문자열 형태의 Bold 폰트
import nanumGothicExtraBoldFont from '@/assets/fonts/NanumGothic-ExtraBold';// Base64 문자열 형태의 Extra Bold 폰트
import companyLogoBase64 from '@/assets/images/companyLogoBase64';          // Base64 문자열 형태의 회사 로고 이미지
import { formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { defaultAccountData, applyDefaultValues } from '@/components/invoice/helpers/dataHelpers.js';

/** ❓: 추후 확인해봐야 할 항목 */
export const generateInvoicePage1 = (yearMonth, invoiceBasicData, accountDetailData) => {
    const year = Math.floor(yearMonth / 100);
    const month = String(yearMonth % 100).padStart(2, '0');
    const formattedYearMonth = `${year}-${month}`; // 2024-12

    const doc = new jsPDF();
    const shadowOffset = 1;
    const pageWidth = doc.internal.pageSize.getWidth();

    /* ----------------------------
       폰트 초기화
    ---------------------------- */
    doc.addFileToVFS("NanumGothic.ttf", nanumGothicFont);
    doc.addFont("NanumGothic.ttf", "NanumGothic", "normal");
    doc.addFileToVFS("NanumGothic-Bold.ttf", nanumGothicBoldFont);
    doc.addFont("NanumGothic-Bold.ttf", "NanumGothic", "bold");
    doc.addFileToVFS("NanumGothic-ExtraBold.ttf", nanumGothicExtraBoldFont);
    doc.addFont("NanumGothic-ExtraBold.ttf", "NanumGothic", "extrabold");
    doc.setFont("NanumGothic", "normal");
    doc.setFontSize(8);

    /* ----------------------------
       삽입 데이터 추출
    ---------------------------- */
    const accountData = applyDefaultValues(accountDetailData?.[0] || {}, defaultAccountData);

    const acct_num = accountData.acct_num; // 없으면 '-'
    const acct_name = accountData.account_info.acct_name;
    const invoice_address = accountData.account_info.invoice_address; // 없으면 '-'
    const invoice_postcode = String(accountData.account_info.invoice_postcode); // 없으면 '00000'
    // Basic Table (First Table)
    const billing_num = formattedYearMonth+"-"+acct_num; // 청구번호
    const create_date = ''; // 작성일자
    const period_of_use = "" // 사용기간
    const due_date_of_payment = "" // 납부기한
    // Current Month Table (Second Table)
    const basic_fee_total = formatNumberWithCommas(accountData.basic_fee_total); // 기본료
    const basic_fee_count = accountData.basic_fee_count+"대";
    const add_use_fee_total = formatNumberWithCommas(accountData.add_use_fee_total); // 통신료
    const account_use_byte_total = formatNumberWithCommas(accountData.account_use_byte_total) + "Byte(s)"; // 사용한 바이트 수
    const modification_fee_total = formatNumberWithCommas(accountData.modification_fee_total); // 부가서비스료
    const subscribe_fee_total = formatNumberWithCommas(accountData.subscribe_fee_total); // 기타사용료
    const total_fee = formatNumberWithCommas(accountData.total_fee); // 공급가액
    const tax_fee = formatNumberWithCommas(accountData.tax_fee); // 부가가치세
    const monthly_final_fee = formatNumberWithCommas(accountData.monthly_final_fee); // 합계금액
    const cut_off_fee = formatNumberWithCommas(accountData.cut_off_fee); // 10원미만 절사금액
    const final_fee = formatNumberWithCommas(accountData.final_fee); // 당월납부액 ❓(당월납부액 == 총 납부액)
    // Details of Unpaid Table (Third Table)
    const one_unpaid_detail = ""; // 미납내역
    const one_unpaid_amount = "" // 미납금액
    const late_surcharge = ""; // 연체가산금
    const none_pay_total = formatNumberWithCommas(accountData.none_pay_fee); // 미납요금계



    /* ----------------------------
       청구서 양식 추출
    ---------------------------- */
    const getData = (code) => invoiceBasicData.find(item => item.code_name === code)?.code_value || "";
    const companyName = getData('ko_company_name');
    const paymentDue = invoiceBasicData.find(item => item.code_name === 'ko_payment_due')?.code_value || '';
    const paymentAccount = invoiceBasicData.find(item => item.code_name === 'ko_payment_account')?.code_value || '';
    const postCode = getData('ko_post_code');
    const address = getData('ko_address');
    const telNumber = getData('ko_tel_number');
    const faxNumber = getData('ko_fax_number');
    const homepage = getData('ko_homepage');
    const subjectHeader = getData('ko_subject_header');
    const customerNumber = getData('ko_customer_number'); // 추가: 고객번호
    // 필요한 다른 데이터
    const ko_regist_number = getData('ko_regist_number');
    const koNonpayNotice = getData('ko_nonpay_notice');

    /* ----------------------------
       헤더 섹션 (회사 로고, 기본 회사 정보, 수신처)
    ---------------------------- */
    // 회사 로고 (페이지 1)
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    // 기본 회사 정보 텍스트 (좌측)
    const firstX = 15, firstY = 10, firstHeight = 10, firstGap = 3.5;
    const yCompanyName1 = firstY + firstHeight;       // 20
    const yPostAddress1 = yCompanyName1 + firstGap;     // 23.5
    const yTelFax1 = yPostAddress1 + firstGap;          // 27
    const yHomepage1 = yTelFax1 + firstGap;             // 30.5

    doc.text(companyName, firstX, yCompanyName1);
    doc.text(`(우)${postCode}  ${address}`, firstX, yPostAddress1);
    doc.text(`고객센터 ${telNumber}, Fax ${faxNumber}`, firstX, yTelFax1);
    doc.text(`홈페이지: ${homepage}`, firstX, yHomepage1);

    // 수신처 정보 (오른쪽 영역)
    const secondX = 85, secondY = 45, secondGap = 15;
    const ySubject = secondY;
    const ySendPrecious = ySubject + secondGap;
    const ySendPostCode = ySendPrecious + secondGap;

    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(10);
    doc.text(invoice_address, secondX, ySubject);
    doc.text(acct_name, 120, ySendPrecious);
    const preciousPostcodeX = pageWidth - 25;
    doc.text('귀중', preciousPostcodeX, ySendPrecious, { align: 'right' });
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(15);
    doc.text(invoice_postcode, preciousPostcodeX, ySendPostCode, { align: 'right' });

    /* ----------------------------
       청구서 헤더 박스
    ---------------------------- */
    const paddingX = 60, paddingY = 10;
    const boxX = paddingX, boxY = 95;
    const boxWidth = pageWidth - paddingX * 2;
    const boxHeight = paddingY;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'FD');
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(10);
    const textX = pageWidth / 2;
    const textY = boxY + boxHeight / 2 + 1.5;
    const yearMonthText = `${year}년 ${month}월 ${subjectHeader}`;
    doc.text(yearMonthText, textX, textY, { align: 'center' });

    /* ----------------------------
   첫 번째 표: 기본 Account 표 (수정됨)
---------------------------- */
    const firstTableY = 110;
    const firstTableMarginLeft = 18, firstTableMarginRight = 18;
    const firstTableWidth = pageWidth - (firstTableMarginLeft + firstTableMarginRight);
    const rowHeight = 7.3;

// 표 데이터: 상단 3행은 4열, 마지막 행은 "납입은행"과 결제금액을 2셀로 처리 (두 번째 셀에 colSpan: 3)
    const firstTableBody = [
        ["청구번호", billing_num, "작성일자", create_date],
        ["고객번호", acct_num, "고객성명", acct_name],
        ["사용기간", period_of_use, "납부기한", due_date_of_payment],
        ["납입은행", { content: paymentAccount, colSpan: 3, styles: { halign: 'left' } }]
    ];

// 전체 표 높이 계산
    const firstTableHeight = rowHeight * firstTableBody.length;

    doc.setFillColor(200, 200, 200);
    doc.rect(firstTableMarginLeft + shadowOffset, firstTableY + shadowOffset, firstTableWidth, firstTableHeight, 'F');

    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    doc.autoTable({
        startY: firstTableY,
        margin: { left: firstTableMarginLeft, right: firstTableMarginRight },
        body: firstTableBody,
        styles: {
            font: "NanumGothic",
            fontStyle: "extrabold",
            fontSize: 8,
            textColor: [0, 0, 0],
            cellPadding: 2,
            overflow: 'linebreak',
            fillColor: [255, 255, 255]  // 모든 셀 배경을 흰색으로 고정
        },
        bodyStyles: {
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
            fillColor: [255, 255, 255]
        },
        // 열 폭을 고정 (전체 4열)
        columnStyles: {
            0: { cellWidth: firstTableWidth / 4 },
            1: { cellWidth: firstTableWidth / 4 },
            2: { cellWidth: firstTableWidth / 4 },
            3: { cellWidth: firstTableWidth / 4 }
        }
    });



    /* ----------------------------
       두 번째 표: 미납 요금 내역 표
    ---------------------------- */
    const secondTableY = 146;
    const secondMarginLeft = 18, secondMarginRight = 18;
    const secondTableWidth = pageWidth - (secondMarginLeft + secondMarginRight);
    const fixedColWidthSecond = secondTableWidth / 3;
    const secondRowHeight = 5.28;
    const totalRows = 12.9;
    const secondTableHeight = secondRowHeight * totalRows;

    doc.setFillColor(200, 200, 200);
    doc.rect(secondMarginLeft + shadowOffset, secondTableY + shadowOffset, secondTableWidth, secondTableHeight, 'F');
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(8);
    doc.text('● 당월 요금내역', secondMarginLeft, secondTableY - 2);

    const feeTableHead = [
        [
            { content: "요금 내역", styles: { halign: 'center' } },
            { content: "금액(원)", styles: { halign: 'center' } },
            { content: "계산내역", styles: { halign: 'center' } }
        ]
    ];
    const feeTableBody = [
        ["기본료", basic_fee_total, basic_fee_count],
        ["통신료", add_use_fee_total, account_use_byte_total],
        ["수수료(변경, 휴지 등)", "-", ""],
        ["부가서비스료", modification_fee_total, ""],
        ["기타사용료", subscribe_fee_total, ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["공급가액", total_fee, ""],
        ["부가가치세", tax_fee, ""],
        ["합계금액", monthly_final_fee, ""],
        ["10원미만 절사금액", cut_off_fee, ""],
        ["당월납부액", final_fee, ""]
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
            lineColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.3,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            lineWidth: 0.3,
            lineColor: [0, 0, 0]
        },
        didParseCell: function (data) {
            if (data.section === 'body') {
                if (data.row.index % 2 === 0) {
                    data.cell.styles.fillColor = [240, 240, 240];
                } else {
                    data.cell.styles.fillColor = [255, 255, 255];
                }
            }
        },
        didDrawCell: function (data) {
            if (data.section === 'body' && data.row.index === 8) {
                const posY = data.cell.y;
                doc.setLineWidth(0.5);
                doc.setDrawColor(0, 0, 0);
                doc.line(secondMarginLeft, posY, secondMarginLeft + secondTableWidth, posY);
            }
        },
        columnStyles: {
            0: { cellWidth: fixedColWidthSecond },
            1: { cellWidth: fixedColWidthSecond },
            2: { cellWidth: fixedColWidthSecond }
        }
    });

    /* ----------------------------
       세 번째 표: 미납 요금 내역 표 (2열 autoTable + 예약된 3열 별도 출력)
    ---------------------------- */
    const thirdTableY = secondTableY + secondTableHeight + 6;
    const thirdMarginLeft = secondMarginLeft;
    const thirdMarginRight = secondMarginRight;
    const thirdTableWidth = pageWidth - (thirdMarginLeft + thirdMarginRight);
    const reservedThirdColWidth = thirdTableWidth / 3;
    const autoTableWidth = thirdTableWidth - reservedThirdColWidth;
    const fixedColWidthForAuto = autoTableWidth / 2;
    const thirdRowHeight = 4.84;
    const thirdTotalRows = 6;
    const thirdTableHeight = thirdRowHeight * thirdTotalRows;

    doc.setFillColor(200, 200, 200);
    doc.rect(thirdMarginLeft + shadowOffset, thirdTableY + shadowOffset, thirdTableWidth, thirdTableHeight, 'F');
    doc.setFontSize(8);
    doc.text('● 미납 요금내역', thirdMarginLeft, thirdTableY - 2);

    const thirdTableHead = [
        [
            { content: "요금 내역", styles: { halign: 'center' } },
            { content: "금액(원)", styles: { halign: 'center' } }
        ]
    ];
    const thirdTableBodyAuto = [
        [one_unpaid_detail, one_unpaid_amount], // ❓추후 데이터 넣어서 test해봐야 함
        ["", ""],
        ["", ""],
        ["연체가산금", late_surcharge],
        ["미납요금계", none_pay_total]
    ];
    const reservedThirdColumnData = [
        koNonpayNotice,
        "",
        "",
        "",
        ""
    ];
    const thirdTableConfig = doc.autoTable({
        startY: thirdTableY,
        margin: { left: thirdMarginLeft, right: thirdMarginRight },
        head: thirdTableHead,
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
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            lineWidth: 0.3,
            lineColor: [0, 0, 0]
        },
        didParseCell: function(data) {
            if (data.section === 'body' && data.column.index < 2) {
                if (data.row.index % 2 === 0) {
                    data.cell.styles.fillColor = [255, 255, 255];
                } else {
                    data.cell.styles.fillColor = [240, 240, 240];
                }
            }
        },
        columnStyles: {
            0: { cellWidth: fixedColWidthForAuto },
            1: { cellWidth: fixedColWidthForAuto }
        }
    });
    // 예약된 3열 영역: autoTable의 오른쪽 1/3 영역을 별도로 그리기
    const reservedColX = thirdMarginLeft + autoTableWidth;
    const reservedPadding = 2;
    const availableReservedWidth = reservedThirdColWidth - reservedPadding * 2;
    const reservedAreaHeight = ((thirdTableConfig.finalY !== undefined) ? thirdTableConfig.finalY : (thirdTableY + thirdTableHeight)) - thirdTableY;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(reservedColX, thirdTableY, reservedThirdColWidth, reservedAreaHeight, 'FD');
    const reservedLines = doc.splitTextToSize(reservedThirdColumnData[0], availableReservedWidth);
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(7);
    doc.text(reservedLines, reservedColX + reservedPadding, thirdTableY + reservedPadding, { baseline: 'top' });

    /* ----------------------------
       네 번째 표: 총 납부액 표 (한 행)
    ---------------------------- */
    const fourthTableY = thirdTableY + thirdTableHeight; // +1 간격
    const fourthMarginLeft = thirdMarginLeft;
    const fourthMarginRight = thirdMarginRight;
    const fourthTableWidth = pageWidth - (fourthMarginLeft + fourthMarginRight);
    const fixedColWidthFourth = fourthTableWidth / 3;
    const fourthRowHeight = 5.3;
    const fourthTableHeight = fourthRowHeight * 1 + 1;

    doc.setFillColor(200, 200, 200);
    doc.rect(fourthMarginLeft + shadowOffset, fourthTableY + shadowOffset, fourthTableWidth, fourthTableHeight, 'F');
    const fourthTableBody = [
        ["총 납부액", final_fee, ""]
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
            fillColor: [255, 255, 255]
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

    /* ----------------------------
       다섯 번째 블록: 공급자 정보
    ---------------------------- */
    const fifthMarginLeft = 36;
    const fifthMarginRight = 36;
    const fifthBlockWidth = pageWidth - (fifthMarginLeft + fifthMarginRight);
    const fifthBlockY = fourthTableY + fourthTableHeight + 5;
    const leftImageWidth = 40;
    const leftImageHeight = 10;
    doc.addImage(companyLogoBase64, 'PNG', fifthMarginLeft, fifthBlockY, leftImageWidth, leftImageHeight);
    const rightBlockX = fifthMarginLeft + leftImageWidth;
    const rightBlockWidth = fifthBlockWidth - leftImageWidth;
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(20);
    doc.text("코리아오브컴 주식회사", rightBlockX, fifthBlockY + 10, { maxWidth: rightBlockWidth - 10 });
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(10);
    doc.text("공급자 등록번호 : " + ko_regist_number, rightBlockX, fifthBlockY + 20, { maxWidth: rightBlockWidth });

    return doc;
};
