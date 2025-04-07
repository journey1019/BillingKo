export const FileUploadTableOptions = {
    initialState: {
        sorting: [
            { id: "use_yn", desc: true },
            { id: "sp_id", desc: false },
            // { id: "alias", desc: true }
        ],
        showColumnFilters: true,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true,
    enableFilters: true,
    positionToolbarAlertBanner: "none",
    enableColumnVisibility: false,   // ✅ 컬럼 토글 버튼 제거
    enableSorting: true,

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
        },
    }),
    // ✅ 선택 셀(UI) 숨기기
    // muiTableBodyCellProps: ({ cell }) => {
    //     if (cell.column.id === 'mrt-row-select') {
    //         return {
    //             sx: { display: 'none' },
    //         };
    //     }
    //     return {};
    // },
}