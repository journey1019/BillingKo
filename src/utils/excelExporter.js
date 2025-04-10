import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, filename = 'export.xlsx') => {
    if (!data || !data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
};

// inside your component with table ref
export const exportVisibleToExcel = (table, filename = 'export.xlsx') => {
    const columns = table.getVisibleFlatColumns();
    const rows = table.getFilteredRowModel().rows;

    const exportData = rows.map(row => {
        const rowData = {};
        columns.forEach(col => {
            const label = col.columnDef.header;
            rowData[label] = col.accessorFn(row.original);
        });
        return rowData;
    });

    exportToExcel(exportData, filename);
};
