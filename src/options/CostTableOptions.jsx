export const CostTableOptions = {
    initialState: {
        sorting: [{ id: 'sp_id', desc: false }],
        showColumnFilters: true,

        density: 'compact',
        // expanded: true,
        // grouping: ['profile_id'], // 기본 그룹핑
        pagination: { pageIndex: 0, pageSize: 10 },
    },
    enableGrouping: true,  // ✅ 그룹핑 활성화
    enableColumnReordering: true, // ✅ 컬럼 이동 활성화
    enablePagination: true,
    enableFilters: true,


    // enableColumnResizing: true,
    // enableStickyHeader: true,
    // enableStickyFooter: true,
    // muiToolbarAlertBannerChipProps: { color: 'primary' },
    // muiTableContainerProps: { sx: { maxHeight: 700 } },
};
