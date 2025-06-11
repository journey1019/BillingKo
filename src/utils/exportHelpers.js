export const getExportDataFromTable = (columns, data) => {
    return data.map((row) => {
        const rowData = {};
        columns.forEach((col) => {
            const header = col.header;

            // 1. Cell 함수에서 cell.getValue()를 사용하는 경우 → 직접 accessorKey를 통해 값 추출 후 넘겨줌
            if (typeof col.Cell === 'function') {
                const value = col.accessorKey
                    ? col.accessorKey.split('.').reduce((obj, key) => obj?.[key], row)
                    : undefined;

                const rendered = col.Cell({
                    row: { original: row },
                    cell: { getValue: () => value }, // getValue() 제공
                });

                rowData[header] = String(rendered);
            }

            // 2. accessorFn 사용 가능 시
            else if (typeof col.accessorFn === 'function') {
                rowData[header] = col.accessorFn(row);
            }

            // 3. 기본 accessorKey 사용
            else if (col.accessorKey) {
                const value = col.accessorKey.split('.').reduce((obj, key) => obj?.[key], row);
                rowData[header] = value;
            }

            else {
                rowData[header] = '';
            }
        });
        return rowData;
    });
};
