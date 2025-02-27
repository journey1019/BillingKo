import companyLogoBase64 from '@/assets/images/companyLogoBase64';
import { formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { defaultAccountData, applyDefaultValues } from '@/components/invoice/helpers/dataHelpers.js';

export const generateInvoicePage2 = (doc, formattedYearMonth, invoiceData, accountDetailData) => {
    // 📌 기본 데이터 설정
    const data = applyDefaultValues(accountDetailData?.[0] || {}, defaultAccountData);
    const deviceDetails = Array.isArray(data.device_detail) ? data.device_detail : [];

    // 📌 `device_detail`이 없으면 2페이지 생성하지 않음
    if (deviceDetails.length === 0) {
        console.log("❌ device_detail이 비어 있어 2페이지를 생성하지 않습니다.");
        return doc;
    }

    console.log("✅ device_detail이 존재하므로 2페이지를 생성합니다.");
    doc.addPage();

    // 2페이지의 상단 이미지 삽입
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    /* ----------------------------
       🔹 `device_detail` 별 반복하여 firstRowData & 표 & 마지막 행 생성
    ---------------------------- */
    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const availableWidth = pageWidth - leftMargin - rightMargin;
    let currentY = 25; // 초기 Y 위치

    deviceDetails.forEach((device, index) => {
        // ✅ `firstRowData` 동적 생성
        const firstRowData = [
            { label: "●", value: device.alias || "-" },
            { label: "S/N", value: device.serial_number || "-" },
            { label: "Bytes", value: formatNumberWithCommas(device.use_byte_total || 0) },
            { label: "합계", value: formatNumberWithCommas(device.total_fee || 0) }
        ];

        // ✅ `firstRowData`를 줄 단위로 배치
        doc.setFont("NanumGothic", "extrabold");
        doc.setFontSize(8);
        const gap = availableWidth / (firstRowData.length - 0.3);
        firstRowData.forEach((item, idx) => {
            const xPosition = leftMargin + idx * gap;
            doc.text(`${item.label}: ${item.value}`, xPosition, currentY);
        });

        // 📌 `firstRowData` 아래 간격 조정
        currentY += 2;

        /* ----------------------------
           🔹 테이블 (각 device의 modification_detail 포함)
        ---------------------------- */
        const modificationDetails = Array.isArray(device.modification_detail) ? device.modification_detail : [];
        const hasModification = modificationDetails.length > 0; // 수정 항목이 존재하는지 확인

        // ✅ `modification_detail`의 헤더 컬럼 동적 생성
        const dynamicHeaders = hasModification
            ? modificationDetails.map(detail => detail.adjustment_desc || "-")
            : [];

        // ✅ 기본 헤더 + modification_detail 헤더
        const tableHeaders = ["기본료", "통신료", "수수료", ...dynamicHeaders];

        // ✅ `modification_detail`의 데이터 동적 생성
        const dynamicValues = hasModification
            ? modificationDetails.map(detail => formatNumberWithCommas(detail.adjustment_fee || 0))
            : [];

        const tableBody = [
            [
                formatNumberWithCommas(device.basic_fee || 0),
                formatNumberWithCommas(device.subscribe_fee || 0),
                "0", // 수수료 (고정값)
                ...dynamicValues
            ]
        ];

        // ✅ 테이블 생성
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
                lineColor: [0, 0, 0],
                lineWidth: 0.3,
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255],
            },
        });

        // 📌 테이블과 마지막 행 사이 간격 조정
        currentY = doc.autoTable.previous.finalY + 4;

        /* ----------------------------
           🔹 마지막 행 (각 device_detail 별)
        ---------------------------- */
        doc.setFont("NanumGothic", "bold");
        doc.setFontSize(7);

        const yearMonthAccount = `${formattedYearMonth}-${data.acct_num || "-"}`;
        doc.text(yearMonthAccount, pageWidth - rightMargin, currentY, { align: 'right' });

        // ✅ `device_detail` 간격 조정 (다음 device와 구분)
        currentY += 5;
    });

    return doc;
};
