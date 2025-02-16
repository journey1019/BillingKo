import { formatNumber } from "@/utils/formatHelpers"; // 숫자 포맷 함수

const KOMonthlyAccountTableColumns = [
    {
        accessorKey: "acct_num",
        header: "계정 번호",
        size: 120,
    },
    {
        accessorKey: "account_info.acct_name",
        header: "기관명",
        size: 200,
        Cell: ({ row }) => row.original.account_info?.acct_name || "-",
    },
    {
        accessorKey: "total_fee",
        header: "기본 청구액",
        size: 150,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
    },
    {
        accessorKey: "monthly_final_fee",
        header: "최종 청구액",
        size: 150,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
    },
    {
        accessorKey: "final_fee",
        header: "최종 납부액",
        size: 150,
        Cell: ({ cell }) => formatNumber(cell.getValue()),
    },
];

export default KOMonthlyAccountTableColumns;
