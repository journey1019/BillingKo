// utils/exportHelpers.js
export const getExportDataFromTable = (columns, data) => {
    return data.map((row) => {
        const rowData = {};
        columns.forEach((col) => {
            const header = col.header;
            const accessorFn = col.accessorFn;

            // 1. 우선 Cell 렌더러 우선 사용
            if (col.Cell && typeof col.Cell === 'function') {
                // row는 Material React Table에서 original을 기반으로 넘어오는 형식으로 유지해야 함
                rowData[header] = col.Cell({ row: { original: row } });
            }
            // 2. accessorFn이 있다면 실행
            else if (accessorFn && typeof accessorFn === 'function') {
                rowData[header] = accessorFn(row);
            }
            // 3. accessorKey 처리 (예: 'account_info.acct_name')
            else if (col.accessorKey) {
                const value = col.accessorKey.split('.').reduce((obj, key) => obj?.[key], row);
                rowData[header] = value;
            } else {
                rowData[header] = '';
            }
        });
        return rowData;
    });
};