export const DeviceTableOptions = {
    initialState: {
        sorting: [{ id: "activated", desc: false }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true, // 행 선택 활성화
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
};