export const AccountTableOptions = {
    initialState: {
        sorting: [{ id: 'acct_num', desc: false }],
        showColumnFilters: true,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true,
    enableFilters: true,
    positionToolbarAlertBanner: 'head-overlay', // 경고를 표시하되, Column 제목 가림


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
            // backgroundColor: row.getIsSelected() ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            // '&:hover': {
            //     backgroundColor: 'rgba(59, 130, 246, 0.2)',
            // },
        },
    }),
};
