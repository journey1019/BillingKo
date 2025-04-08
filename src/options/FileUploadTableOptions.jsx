export const FileUploadTableOptions = (selectedRowData) => ({
    initialState: {
        sorting: [
            { id: "use_yn", desc: true },
            { id: "sp_id", desc: false }
        ],
        showColumnFilters: true,
    },

    enablePagination: true,
    enableFilters: true,
    enableSorting: true,
    enableColumnVisibility: false,
    positionToolbarAlertBanner: "none",

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: () => {
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: 'pointer',
            backgroundColor:
                selectedRowData?.sp_id === row.original.sp_id ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
            '&:hover': {
                backgroundColor: selectedRowData?.sp_id === row.original.sp_id ? '#cbd5e1' : '#f1f5f9',
            },
        },
    }),
});
