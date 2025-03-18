import { applyRightAlignStyles, renderNumberCell } from './cellStyle/BasicCellStyle.jsx';

export const PriceTableColumns = [
    {
        accessorKey: "ppid",
        header: "PPID",
        // enableClickToCopy : true,
    },
    {
        accessorKey: "apply_company",
        header: "고객",
    },
    {
        accessorKey: "basic_fee",
        header: "기본료",
        size: 100,
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        // muiTableHeadCellProps: { align: 'right' },
        // muiTableBodyCellProps: { align: 'right' }
    },
    {
        accessorKey: "subscription_fee",
        header: "가입비",
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        // muiTableHeadCellProps: { align: 'right' },
        // muiTableBodyCellProps: { align: 'right' }
    },
    {
        accessorKey: "free_byte",
        header: "무료 바이트 제공량",
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        // muiTableHeadCellProps: { align: 'right' },
        // muiTableBodyCellProps: { align: 'right' }
    },
    {
        accessorKey: "surcharge_unit",
        header: "추가 사용 과금 단위",
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        // muiTableHeadCellProps: { align: 'right' },
        // muiTableBodyCellProps: { align: 'right' }
    },
    {
        accessorKey: "each_surcharge_fee",
        header: "추가 사용 과금 금액",
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        // muiTableHeadCellProps: { align: 'right' },
        // muiTableBodyCellProps: { align: 'right' }
    },
    {
        accessorKey: "remarks",
        header: "비고",
    },
    {
        accessorKey: "note",
        header: "메모",
    }
];