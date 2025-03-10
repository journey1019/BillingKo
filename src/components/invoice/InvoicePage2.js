import companyLogoBase64 from '@/assets/images/companyLogoBase64';
import { formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { defaultAccountData, applyDefaultValues } from '@/components/invoice/helpers/dataHelpers.js';

export const generateInvoicePage2 = (doc, yearMonth, invoiceData, accountDetailData) => {
    const year = Math.floor(yearMonth / 100);
    const month = String(yearMonth % 100).padStart(2, '0');
    const formattedYearMonth = `${year}-${month}`;

    // 기본 데이터 설정
    const data = applyDefaultValues(accountDetailData?.[0] || {}, defaultAccountData);
    const deviceDetails = Array.isArray(data.device_detail) ? data.device_detail : [];

    if (deviceDetails.length === 0) {
        console.log("❌ device_detail이 비어 있어 2페이지를 생성하지 않습니다.");
        return doc;
    }

    console.log("✅ device_detail이 존재하므로 2페이지를 생성합니다.");
    doc.addPage();
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - leftMargin - rightMargin;
    let currentY = 25; // 초기 Y 위치
    const bottomMargin = 15; // 페이지 하단 마진

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

        const dynamicHeaders = hasModification
            ? modificationDetails.map(detail => detail.adjustment_desc || "-")
            : [];

        const tableHeaders = ["기본료", "통신료", "수수료", ...dynamicHeaders];

        const dynamicValues = hasModification
            ? modificationDetails.map(detail => formatNumberWithCommas(detail.adjustment_fee || 0))
            : [];

        const tableBody = [
            [
                formatNumberWithCommas(device.basic_fee || 0),
                formatNumberWithCommas(device.subscribe_fee || 0),
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
            doc.addPage();
            currentY = 25;
        }

        // ✅ firstRowData 출력
        doc.setFont("NanumGothic", "extrabold");
        doc.setFontSize(8);
        const cellWidth = availableWidth / firstRowData.length;

        firstRowData.forEach((item, idx) => {
            const xPosition = leftMargin + idx * cellWidth;

            // ✅ 테두리 추가
            doc.setLineWidth(0.1);
            doc.rect(xPosition, currentY, cellWidth, cellHeight);

            if (item.label === "●") {
                doc.text(`${item.label} ${item.value}`, xPosition + 2, currentY + 4);
            } else {
                doc.text(`${item.label}: ${item.value}`, xPosition + 2, currentY + 4);
            }
        });

        currentY += cellHeight; // ✅ 테이블과 바로 붙이기

        // ✅ 테이블 생성 (라인 두께 0.2로 설정)
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
                lineWidth: 0.1,  // ✅ 모든 선 두께 0.2로 설정
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
        currentY += 8;
    });

    // ✅ `yearMonthAccount`을 마지막 한 번만 표시
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(7);
    const yearMonthAccount = `${formattedYearMonth}-${data.acct_num || "-"}`;
    doc.text(yearMonthAccount, pageWidth - rightMargin, currentY, { align: 'right' });

    return doc;
};
