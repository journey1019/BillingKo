export const AccountTableOptions = {
    initialState: {
        sorting: [{ id: 'acct_num', desc: false }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true, // 행 선택 활성화
    enableMultiRowSelection: false, // 체크박스 대신 라디오 버튼 사용
    enablePagination: true, // 페이지네이션 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    muiTableBodyRowProps: ({ row }) => ({
        //add onClick to row to select upon clicking anywhere in the row
        onClick: row.getToggleSelectedHandler(),
        sx: { cursor: 'pointer' },
    }),
};