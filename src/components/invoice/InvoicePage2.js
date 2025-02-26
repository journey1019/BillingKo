import companyLogoBase64 from '@/assets/images/companyLogoBase64';

export const generateInvoicePage2 = (doc, formattedYearMonth, invoiceData, accountDetailData) => {
    // 2페이지 추가
    doc.addPage();

    // 2페이지의 상단 이미지 삽입 (첫 페이지와 동일하게)
    // 예시: 회사 로고 삽입
    doc.addImage(companyLogoBase64, 'PNG', 15, 10, 30, 7);

    // 첫 번째 데이터 가져오기 (없으면 빈 객체)
    const getSafeValue = (value) => value ?? '-';
    const data = Array.isArray(accountDetailData) && accountDetailData.length > 0
        ? accountDetailData[0]
        : {};


    /* ----------------------------
       2페이지의 나머지 내용 작성
    ---------------------------- */
    // 좌우 여백 설정
    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const availableWidth = pageWidth - leftMargin - rightMargin;

// 첫 번째 줄: 표 외부 상단 데이터 배치
    const firstRowY = 25;
    doc.setFont("NanumGothic", "extrabold");
    doc.setFontSize(8);
    const firstRowData = ["● ZIRCON1", `S/N: ${getSafeValue(data.serial_number)}`, "Bytes: 180", "합계: 1,213,549,000"];

// gap 계산: 아이템 사이 간격 = availableWidth / (아이템 개수 - 1)
    const gap = availableWidth / (firstRowData.length - 0.3);
    firstRowData.forEach((text, index) => {
        const xPosition = leftMargin + index * gap;
        doc.text(text, xPosition, firstRowY);
    });


    // 표 데이터 정의
    const tableStartY = firstRowY + 2;
    const tableHeaders = ["기본료", "통신료", "수수료", "VMS-Commtrace", "VMS 서비스"];
    const tableBody = [
        // [[getSafeValue(data.total_fee), getSafeValue(data.tax_fee), getSafeValue(data.none_pay_fee), getSafeValue(data.monthly_final_fee)]]
        ["16,000", "0", "0", "33,000", "10,000"],
        ["", "", "", "", ""], // 빈 행
    ];

    // 표 생성
    doc.autoTable({
        startY: tableStartY,
        margin: { left: leftMargin, right: rightMargin },
        head: [tableHeaders],
        body: tableBody,
        theme: 'grid',
        styles: {
            font: "NanumGothic",
            fontStyle: "bold",
            fontSize: 7,
            cellPadding: 1,
            fillColor: [255, 255, 255], // 배경색 흰색
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
        },
        headStyles: {
            fillColor: [240, 240, 240], // 헤더 배경색
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fillColor: [245, 245, 245], // 교차 행 색상 (회색)
            textColor: [0, 0, 0],
            halign: 'center',
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255], // 본문 배경 흰색
        },
        columnStyles: {
            0: { cellWidth: availableWidth / 5 },
            1: { cellWidth: availableWidth / 5 },
            2: { cellWidth: availableWidth / 5 },
            3: { cellWidth: availableWidth / 5 },
            4: { cellWidth: availableWidth / 5 },
        },
    });

// 마지막 행 이후 여백과 최종 텍스트
    const finalY = doc.autoTable.previous.finalY + 3;
    doc.setFont("NanumGothic", "bold");
    doc.setFontSize(7);

    const yearMonthAccount = `${formattedYearMonth}-A_10915`
    doc.text(yearMonthAccount, pageWidth - rightMargin, finalY, { align: 'right' });


    return doc;
};
