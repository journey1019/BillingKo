import companyLogoBase64 from '@/assets/images/companyLogoBase64';
import { formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { defaultAccountData, applyDefaultValues } from '@/components/invoice/helpers/dataHelpers.js';

import nanumGothicFont from '@/assets/fonts/NanumGothic-normal';         // Base64 문자열 형태의 일반 폰트
import nanumGothicBoldFont from '@/assets/fonts/NanumGothic-Bold';          // Base64 문자열 형태의 Bold 폰트
import nanumGothicExtraBoldFont from '@/assets/fonts/NanumGothic-ExtraBold';// Base64 문자열 형태의 Extra Bold 폰트
import notoSansBoldFont from '@/assets/fonts/notoSansKR-Bold';

export const generateInvoicePage2 = (doc, yearMonth, invoiceData, accountDetailData) => {
    // console.log(accountDetailData)
    if (!doc) {
        console.error("❌ Error: doc is undefined in generateInvoicePage2");
        return;
    }

    const year = Math.floor(yearMonth / 100);
    const month = String(yearMonth % 100).padStart(2, '0');
    const formattedYearMonth = `${year}-${month}`;

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


    // 기본 데이터 설정
    const data = applyDefaultValues(accountDetailData?.[0] || {}, defaultAccountData);
    const deviceDetails = Array.isArray(data.device_detail) ? data.device_detail : [];
    // ✅ alias 오름차순 정렬 (한글 정렬까지 고려)
    // deviceDetails.sort((a, b) => a.alias.localeCompare(b.alias, 'ko-KR'));
    // ✅ alias 오름차순 정렬 (자연 정렬 적용)
    deviceDetails.sort((a, b) => {
        const aNum = parseInt(a.alias.replace(/[^0-9]/g, ''), 10);
        const bNum = parseInt(b.alias.replace(/[^0-9]/g, ''), 10);

        const aPrefix = a.alias.replace(/[0-9]/g, '');
        const bPrefix = b.alias.replace(/[0-9]/g, '');

        // 1. 접두사가 다르면 문자열 기준 비교
        if (aPrefix !== bPrefix) {
            return aPrefix.localeCompare(bPrefix, 'ko-KR');
        }

        // 2. 접두사가 같으면 숫자 크기 기준으로 정렬
        return aNum - bNum;
    });

    // console.log(deviceDetails);

    if (deviceDetails.length === 0) {
        // console.log("❌ device_detail이 비어 있어 2페이지를 생성하지 않습니다.");
        return doc;
    }

    // console.log("✅ device_detail이 존재하므로 2페이지를 생성합니다.");
    doc.addPage();
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - leftMargin - rightMargin;
    let currentY = 25; // 초기 Y 위치
    const bottomMargin = 15; // 페이지 하단 마진


    const yearMonthAccount = `${formattedYearMonth}-${data.acct_num || "-"}`;

    // 루프 밖에서 한 번만 정의
    const drawYearMonthAccountAtBottom = () => {
        doc.setFont("NanumGothic", "bold");
        doc.setFontSize(7);
        doc.text(yearMonthAccount, pageWidth - rightMargin, pageHeight - bottomMargin, { align: 'right' });
    };

    deviceDetails.forEach((device, index) => {
        // ✅ firstRowData 동적 생성
        const firstRowData = [
            { label: "●", value: device.alias || "-" },
            { label: "S/N", value: device.serial_number || "-" },
            { label: "Bytes", value: formatNumberWithCommas(device.use_byte_total || 0) },
            { label: "합계", value: formatNumberWithCommas(device.total_fee || 0) }
        ];

        // ✅ `firstRowData` 예상 높이 (테두리 포함)
        const cellHeight = 6;
        const estimatedFirstRowHeight = cellHeight;

        // ✅ 테이블 데이터 준비
        const modificationDetails = Array.isArray(device.modification_detail) ? device.modification_detail : [];
        const hasModification = modificationDetails.length > 0;

        // ✅ `modification_detail` 객체가 존재하면 컬럼 추가
        const dynamicHeaders = hasModification
            ? modificationDetails.map(detail => detail.adjustment_desc || "-")
            : [];

        const tableHeaders = ["기본료", "통신료", "수수료", ...dynamicHeaders];

        const dynamicValues = hasModification
            ? modificationDetails.map(detail => formatNumberWithCommas(detail.mount_value || 0))
            : [];

        const tableBody = [
            [
                formatNumberWithCommas(device.basic_fee || 0),
                formatNumberWithCommas(device.add_use_fee || 0),
                "0",
                ...dynamicValues
            ]
        ];

        // ✅ `autoTable` 예상 높이
        const estimatedTableHeight = 10 + (tableBody.length * 5);

        // ✅ 전체 블록(FirstRowData + autoTable)의 예상 높이 계산
        const totalBlockHeight = estimatedFirstRowHeight + estimatedTableHeight;

        // ✅ 블록이 페이지를 넘는다면, 다음 페이지에서 시작
        if (currentY + totalBlockHeight > pageHeight - bottomMargin) {
            drawYearMonthAccountAtBottom();  // 페이지 추가 전
            doc.addPage();
            doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);
            currentY = 25;
        }

        // ✅ firstRowData 출력 (세로선 제거)
        doc.setFont("NanumGothic", "extrabold");
        doc.setFontSize(8);
        const cellWidth = availableWidth / firstRowData.length;

        // ✅ 가로선만 그리기 (세로선 없음)
        doc.setLineWidth(0.1);
        doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY); // 상단 선
        firstRowData.forEach((item, idx) => {
            const xPosition = leftMargin + idx * cellWidth;
            if (item.label === "●") {
                doc.text(`${item.label} ${item.value}`, xPosition + 2, currentY + 4);
            } else {
                doc.text(`${item.label}: ${item.value}`, xPosition + 2, currentY + 4);
            }
        });
        doc.line(leftMargin, currentY + cellHeight, pageWidth - rightMargin, currentY + cellHeight); // 하단 선

        // ✅ 맨 왼쪽 세로선 추가
        doc.line(leftMargin, currentY, leftMargin, currentY + cellHeight);

        // ✅ 맨 오른쪽 세로선 추가
        doc.line(pageWidth - rightMargin, currentY, pageWidth - rightMargin, currentY + cellHeight);

        currentY += cellHeight; // ✅ 테이블과 바로 붙이기

        // ✅ 테이블 생성 (라인 두께 0.1로 설정)
        doc.autoTable({
            startY: currentY,
            margin: { left: leftMargin, right: rightMargin },
            head: [tableHeaders],
            body: tableBody,
            theme: 'grid',
            styles: {
                font: "NanumGothic",
                fontStyle: "bold",
                fontSize: 7,
                cellPadding: 1,
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [66, 66, 66],
                lineWidth: 0.1,  // ✅ 모든 선 두께 0.1로 설정
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.1,
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                halign: 'center',
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255],
            },
        });

        currentY = doc.autoTable.previous.finalY; // ✅ 테이블 바로 아래 붙이기

        // ✅ deviceDetails 간격을 벌려 가독성 확보
        currentY += 5;
    });

    drawYearMonthAccountAtBottom();

    return doc;
};
