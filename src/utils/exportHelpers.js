// ✅ exportHelpers.js
export const prepareExportData = (columns, data) => {
    return data.map(row => {
        const rowData = {};
        columns.forEach(col => {
            const field = col.field;
            const headerName = col.headerName || field;
            rowData[headerName] = row[field];
        });
        return rowData;
    });
};


export const getExportDataFromTable = (columns, data) => {
    return data.map((row) => {
        const rowData = {};
        columns.forEach((col) => {
            console.log(col)
            const header = col.header;
            let value = '';

            // 1️⃣ accessorKey가 있으면 값 추출
            if (col.accessorKey) {
                value = col.accessorKey.split('.').reduce((obj, key) => obj?.[key], row);
            }

            // 2️⃣ accessorFn 이 있으면
            else if (typeof col.accessorFn === 'function') {
                value = col.accessorFn(row);
            }

            // ✅ Cell 함수는 export에서 렌더링 X → 실제 값(value)만 export

            // 3️⃣ 값이 객체/배열인 경우 JSON 문자열화
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }

            // 4️⃣ 숫자 값은 문자열로 깔끔히 변환
            if (typeof value === 'number') {
                value = value.toLocaleString();  // 원하는 경우 ,(콤마) 포함
            }

            rowData[header] = value ?? '';
        });
        return rowData;
    });
};
