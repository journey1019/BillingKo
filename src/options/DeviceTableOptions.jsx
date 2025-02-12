export const DeviceTableOptions = {
    initialState: {
        sorting: [{ id: "activated", desc: false }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true, // 행 선택 활성화
    enableMultiRowSelection: false,
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    positionToolbarAlertBanner: 'none',
    // positionToolbarAlertBanner: 'head-overlay',
    // enableClickToCopy: true, // 열 달 각 셀 데이터 값 복사

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