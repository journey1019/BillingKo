export const AccountTableOptions = (selectedAccountId) => ({
    initialState: {
        sorting: [{ id: 'acct_num', desc: true }],
        showColumnFilters: true,
    },
    enableMultiRowSelection: false,
    enablePagination: true,
    enableFilters: true,
    enableColumnVisibility: false,
    positionToolbarAlertBanner: 'none',


    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            console.log('Row clicked:', row.original);

            // 선택 상태를 토글
            row.getToggleSelectedHandler()(event);

            // 추가 동작: 메타 속성을 통한 이벤트 전달 (예: Drawer 열기)
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: 'pointer',
            backgroundColor:
                selectedAccountId?.acct_num === row.original.acct_num ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
            '&:hover': {
                backgroundColor: selectedAccountId?.acct_num === row.original.acct_num ? '#cbd5e1' : '#f1f5f9',
            },
        },
    }),
});