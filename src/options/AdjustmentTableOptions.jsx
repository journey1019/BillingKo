export const AdjustmentTableOptions = {
    initialState: {
        sorting: [{ id: 'adjustment_index', desc: true }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true, // 행 선택 활성화
    enableMultiRowSelection: false,
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    positionToolbarAlertBanner: 'none', // 경고를 표시하되, Column 제목 가림

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            console.log("Row Click:", row.original);

            event.stopPropagation(); // 이벤트 전파 차단
            row.getToggleSelectedHandler()(event); // 선택 핸들러 호출
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: "pointer",
        },
    }),

};


export const AdjustmentHistoryTableOptions = {
    initialState: {
        sorting: [{ id: 'update_date', desc: true }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    positionToolbarAlertBanner: 'none', // 경고를 표시하되, Column 제목 가림
};