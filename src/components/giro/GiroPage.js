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
export const GiroPage = (yearMonth, invoiceBasicData, accountDetailData) => {
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
    // doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    // 기본 회사 정보 텍스트 (좌측)
    const firstX = 10.9, firstY = 39.5, firstHeight = 10, firstGap = 3.7;
    const yCompanyName1 = firstY + firstHeight;       // 20
    const yPostAddress1 = yCompanyName1 + firstGap;     // 23.5
    const yTelFax1 = yPostAddress1 + firstGap;          // 27
    const yHomepage1 = yTelFax1 + firstGap;             // 30.5

    doc.setFontSize(9);
    doc.setFont("NanumGothic", "bold");

    doc.text(address+'(반포동 세영제이타워)', firstX, yCompanyName1);
    doc.text(`고객센터 ${telNumber}, Fax ${faxNumber}`, firstX, yPostAddress1);
    doc.text(`홈페이지: ${homepage}`, firstX, yTelFax1);
    doc.text(`0`, firstX, yHomepage1);
    doc.text(`6`, firstX + 2, yHomepage1);
    doc.text(`536`, firstX + 4, yHomepage1);

    // 수신처 정보 (오른쪽 영역)
    const secondX = 76, secondY = 65.5, secondGap = 20;
    const ySubject = secondY;
    const ySendPrecious = ySubject + secondGap + 2;
    const ySendPostCode = ySendPrecious + secondGap - 12;

    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(12);
    doc.text('부산광역시 영도구 태종로 70, 3층 (대교동 1가)', secondX, ySubject); // 주소
    // doc.text('(사무동 3층 해무과)', secondX, ySubject+13); // 상세주소
    doc.setFontSize(14);
    doc.text('대진해운(주)', 119, ySendPrecious); // 회사명
    const preciousPostcodeX = pageWidth - 35;

    doc.text('49045', preciousPostcodeX, ySendPostCode, { align: 'right' }); // 우편번호


    /* ----------------------------
       다섯 번째 블록: 공급자 정보
    ---------------------------- */
    doc.setFontSize(13);
    const text = "1267040";
    const startY = 225.8; // 시작 Y 좌표
    const spacing = 5.2; // 문자 간격 (픽셀)

// 전체 문자열 너비 계산
    const totalWidth = (text.length - 1) * spacing;

// 오른쪽 끝 정렬을 위한 X 좌표 조정
    const endX = 197 // 기존 우측 정렬 기준 X 좌표
    const startX = endX - totalWidth; // 문자열의 시작점 보정

    for (let i = 0; i < text.length; i++) {
        doc.text(text[i], startX + (i * spacing), startY);
    }



    const fifthMarginLeft = 36;
    const fifthMarginRight = 36;
    const fifthBlockWidth = pageWidth - (fifthMarginLeft + fifthMarginRight);
    const fifthBlockY = 250;
    const leftImageWidth = 40;
    const leftImageHeight = 10;

    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(11);
    doc.text("267,040", 37, 237);

    doc.setFontSize(10);
    doc.text("대진해운(주)", 78, 243);
    doc.text("2025년 02월 청구서", 78, 252.5);

    doc.setFontSize(8);
    doc.text("A_10302", 20, 248);
    doc.text("대진해운(주)", 20, 254.2);
    doc.text("2025년 02월 청구서", 20, 260.7);
    doc.text("2025-02-28", 20, 267);

    doc.setFontSize(10);
    doc.text("A_10302", 138, 243);
    doc.text("2025-02-28", 138, 252.5);

    return doc;
};
