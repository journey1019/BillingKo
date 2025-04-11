import { formatNumber } from "@/utils/formatHelpers"; // 숫자 포맷 함수

const numericColumnProps = {
    muiTableHeadCellProps: {
        // align: "right",
        // sx: {
        //     alignItems: "right",
        //     align: "right",
        //     textAlign: "right",
        // },
    },
    muiTableBodyCellProps: {
        sx: { textAlign: "right" },
    },
};

const KOMonthlyAccountTableColumns = [
    {
        accessorKey: "acct_num",
        header: "계정 번호",
        size: 100,
    },
    {
        accessorKey: "account_info.acct_name",
        header: "기관명",
        size: 200,
        Cell: ({ row }) => row.original.account_info?.acct_name || "-",
    },
    {
        accessorKey: "basic_fee_total",
        header: "기본료",
        size: 100,
        ...numericColumnProps, // 공통 정렬 적용
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "add_use_fee_total",
        header: "통신료",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "modification_fee_total",
        header: "부가서비스료",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "subscribe_fee_total",
        header: "기타사용료",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "total_fee",
        header: "공급가액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "tax_fee",
        header: "부가세",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "cut_off_fee",
        header: "절사 금액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "monthly_final_fee",
        header: "당월 납부액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "modification_tax_free_total",
        header: "조정 금액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "late_payment_penalty_fee",
        header: "연체 금액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "none_pay_fee",
        header: "미납 금액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: "final_fee",
        header: "최종 납부액",
        size: 100,
        ...numericColumnProps,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
        muiTableHeadCellProps: { align: 'right' },
    },
];

export default KOMonthlyAccountTableColumns;