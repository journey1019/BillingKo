/** GiroPage.js */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal';         // Base64 문자열 형태의 일반 폰트
import nanumGothicBoldFont from '@/assets/fonts/NanumGothic-Bold';          // Base64 문자열 형태의 Bold 폰트
import nanumGothicExtraBoldFont from '@/assets/fonts/NanumGothic-ExtraBold';// Base64 문자열 형태의 Extra Bold 폰트
import notoSansBoldFont from '@/assets/fonts/notoSansKR-Bold';
import { formatNumberWithCommas, formatDateIndex } from '@/utils/formatHelpers.jsx';
import { defaultAccountData, applyDefaultValues } from '@/components/invoice/helpers/dataHelpers.js';

/** ❓: 추후 확인해봐야 할 항목 */
export const GiroPage = (doc, yearMonth, invoiceBasicData, accountDetailData) => {
    if (!doc) {
        // console.error("❌ Error: doc is undefined in generateInvoicePage2");
        return;
    }

    // console.log(accountDetailData)
    // console.log(invoiceBasicData)
    const year = Math.floor(yearMonth / 100);
    const month = String(yearMonth % 100).padStart(2, '0');

    // 청구서 출력 다음달
    const nextMonth = Number(month) + 1;
    const nextYear = nextMonth > 12 ? year + 1 : year;
    const formattedNextMonth = nextMonth > 12 ? 1 : nextMonth;
    // 말일 계산 (for 'due_date_of_payment')
    const lastDayOfMonth = new Date(nextYear, formattedNextMonth, 0).getDate();

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

    doc.addFileToVFS("NotoSansKR-VariableFont_wght.ttf", notoSansBoldFont);
    doc.addFont("NotoSansKR-VariableFont_wght.ttf", "NotoSansKR", "bold");

    /* ----------------------------
       삽입 데이터 추출
    ---------------------------- */
    const accountData = applyDefaultValues(accountDetailData?.[0] || {}, defaultAccountData);

    const acct_num = accountData.acct_num; // 없으면 '-'
    const acct_name = accountData.account_info.acct_name;
    const utf8_acct_name = decodeURIComponent(encodeURIComponent(acct_name)); // `unescape()` 대체
    const invoice_address = accountData.account_info.invoice_address; // 없으면 '-'
    const invoice_address2 = accountData.account_info.invoice_address2 || ""; // 없으면 '-'
    const invoice_postcode = String(accountData.account_info.invoice_postcode); // 없으면 '00000'
    const due_date_of_payment = `${nextYear}-${String(formattedNextMonth).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`; // 납부기한
    const monthly_final_fee = accountData.monthly_final_fee; // 합계금액
    const billingMonth = `${nextYear}년 ${String(formattedNextMonth).padStart(2, '0')}월 청구서`


    /* ----------------------------
       청구서 양식 추출
    ---------------------------- */
    const getData = (code) => invoiceBasicData.find(item => item.code_name === code)?.code_value || "";
    const postCode = getData('ko_post_code');
    const address = getData('ko_address');
    const telNumber = getData('ko_tel_number');
    const faxNumber = getData('ko_fax_number');
    const homepage = getData('ko_homepage');

    /* ----------------------------
        헤더 섹션 1 (기본 회사 정보)
    ---------------------------- */
    // 기본 회사 정보 텍스트 (좌측)
    const firstX = 10.9, firstY = 39.5, firstHeight = 10, firstGap = 3.7;
    const yCompanyName1 = firstY + firstHeight;       // 20
    const yPostAddress1 = yCompanyName1 + firstGap;     // 23.5
    const yTelFax1 = yPostAddress1 + firstGap;          // 27
    const yHomepage1 = yTelFax1 + firstGap;             // 30.5

    doc.setFontSize(9);
    doc.setFont("NanumGothic", "bold");

    doc.text(address+'(반포동 세영제이타워)', firstX, yCompanyName1); // '서울시 서초구 강남대로 525, 세영제이타워 15층(반포동 세영제이타워)'
    doc.text(`고객센터: ${telNumber}, Fax ${faxNumber}`, firstX, yPostAddress1); // 고객센터: (02)344-7311, Fax(02)3444-7312
    doc.text(`홈페이지: ${homepage}`, firstX, yTelFax1); // 홈페이지: https:www.orbcomm.co.kr
    doc.text(postCode, firstX, yHomepage1); // 06536

    /* ----------------------------
        헤더 섹션 2 (수신처)
    ---------------------------- */
    const secondX = 76, secondY = 65.5, secondGap = 20;
    const ySubject = secondY;
    const ySendPrecious = ySubject + secondGap + 2;
    const ySendPostCode = ySendPrecious + secondGap - 12;

    // 주소
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(12);
    doc.text(invoice_address, secondX, ySubject); // 주소
    doc.text(invoice_address2, secondX, ySubject+13); // 상세주소
    // 고객
    doc.setFont("NotoSansKR", "bold");
    doc.setFontSize(14);
    doc.text(utf8_acct_name, 119, ySendPrecious); // 회사명
    // 우편번호
    doc.setFont("NanumGothic", "extrabold");
    doc.text(invoice_postcode, pageWidth - 35, ySendPostCode, { align: 'right' }); // 우편번호


    /* ----------------------------
        지로 통지서 블록 (금액, 고객 정보 등)
    ---------------------------- */
    doc.setFontSize(13);
    const text = String(monthly_final_fee);
    const startY = 226; // 시작 Y 좌표
    const spacing = 5.2; // 문자 간격 (픽셀)

    // 전체 문자열 너비 계산
    const totalWidth = (text.length - 1) * spacing;

    // 오른쪽 끝 정렬을 위한 X 좌표 조정
    const endX = 196 // 기존 우측 정렬 기준 X 좌표
    const startX = endX - totalWidth; // 문자열의 시작점 보정

    // 금액 (오른쪽 정렬)
    for (let i = 0; i < text.length; i++) {
        doc.text(text[i], startX + (i * spacing), startY);
    }


    // 금액(요금)
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(11);
    // doc.text(formatNumberWithCommas(monthly_final_fee), 37, 237);
    doc.text(formatNumberWithCommas(monthly_final_fee), pageWidth - 158, 238, { align: 'right' });

    // 첫 번째 열 (고객 번호, 고객, YYYY년 MM월 청구서, 납부기한)
    doc.setFontSize(10);
    doc.setFont("NotoSansKR", "bold");
    doc.text(utf8_acct_name, 78, 243.5);
    doc.setFont("NanumGothic", "bold");
    doc.text(billingMonth, 78, 253);

    // 두 번째 열 (고객, YYYY년 MM월 청구서)
    doc.setFontSize(8);
    doc.text(acct_num, 20, 249);
    doc.setFont("NotoSansKR", "bold");
    doc.text(utf8_acct_name, 20, 255.2);
    doc.setFont("NanumGothic", "bold");
    doc.text(billingMonth, 20, 261.7);
    doc.text(due_date_of_payment, 20, 268);

    // 세 번째 열 (고객 번호, 납부기한)
    doc.setFontSize(10);
    doc.text(acct_num, 138, 243.5);
    doc.text(due_date_of_payment, 138, 253);

    return doc;
};
