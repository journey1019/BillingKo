export const AdjustmentTableOptions = (selectedAdjustId) => ({
    initialState: {
        sorting: [{ id: 'adjustment_index', desc: true }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    // enableRowSelection: true, // 행 선택 활성화
    enableMultiRowSelection: false,
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    enableColumnVisibility: false,
    positionToolbarAlertBanner: 'none', // 경고를 표시하되, Column 제목 가림

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {

            event.stopPropagation(); // 이벤트 전파 차단
            row.getToggleSelectedHandler()(event); // 선택 핸들러 호출
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: 'pointer',
            backgroundColor:
                selectedAdjustId?.adjustment_index === row.original.adjustment_index ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
            '&:hover': {
                backgroundColor: selectedAdjustId?.adjustment_index === row.original.adjustment_index ? '#cbd5e1' : '#f1f5f9',
            },
        },
    }),
});

export const AdjustmentValueTableOptions = {
    initialState: {
        sorting: [{ id: 'date_index', desc: true }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    positionToolbarAlertBanner: 'none', // 경고를 표시하되, Column 제목 가림


    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            // 선택 상태를 토글
            row.getToggleSelectedHandler()(event);

            // 추가 동작: 메타 속성을 통한 이벤트 전달 (예: Drawer 열기)
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: 'pointer',
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