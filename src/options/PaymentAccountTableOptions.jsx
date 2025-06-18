import { Button, Box, Typography } from '@mui/material';
export const PaymentAccountTableOptions = (selectedAcctNum) => ({
    initialState: {
        sorting: [{ id: 'date_index', desc: true }],
        showColumnFilters: true,
        pagination: { pageSize: 25, pageIndex: 0 }
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
                selectedAcctNum?.acct_num === row.original.acct_num ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
            '&:hover': {
                backgroundColor: selectedAcctNum?.acct_num === row.original.acct_num ? '#cbd5e1' : '#f1f5f9',
            },
        },
    }),

});
