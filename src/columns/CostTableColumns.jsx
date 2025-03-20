import { useMemo } from 'react';
import { applyRightAlignStyles, applyWrapStyles, renderNumberCell } from './cellStyle/AccountCell.jsx';
import { Box, Stack } from '@mui/material'; // ✅ MUI Alert 추가

export const CostTableColumns = [
    {
        accessorKey: 'sp_id',
        header: 'SPID',
        ...applyWrapStyles()
    },
    {
        accessorKey: 'alias',
        header: '요금제',
        ...applyWrapStyles()
    },
    {
        accessorKey: 'serial_number',
        header: '단말기(Subscription ID)',
        minSize: 250,
        ...applyWrapStyles()
    },
    {
        accessorKey: 'd_product',
        header: 'd_product',
        ...applyWrapStyles()
    },
    {
        accessorKey: 'd_product_desc',
        header: 'DESC(Product)',
        ...applyWrapStyles()
    },
    {
        accessorKey: 'quantity',
        header: '수량(Quantity)',
        Cell: renderNumberCell,
        ...applyRightAlignStyles()
    },
    {
        accessorKey: 'amount_fee',
        header: '금액(Amount $US)',
        Cell: renderNumberCell,
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => (
            <Box sx={{ fontWeight: "bold", color: "primary.main" }}>
                그룹 합계: ${cell.getValue()?.toLocaleString()}
            </Box>
        ),
        Footer: ({ table }) => {
            const totalAmountFee = table
                .getPrePaginationRowModel()
                .rows.reduce((sum, row) => sum + (row.original.amount_fee || 0), 0);

            return (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Box>총합:</Box>
                    <Box color="warning.main" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                        ${totalAmountFee.toLocaleString()}
                    </Box>
                </Stack>
            );
        },
        ...applyRightAlignStyles(),
    },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID(Group Profile ID)',
        minSize: 300,
        ...applyWrapStyles()
    },
    {
        accessorKey: 'profile_name',
        header: 'Profile Name(Group Profile Name)',
        minSize: 330,
        ...applyWrapStyles()
    },
    {
        accessorKey: 'activated',
        header: '활성화 날짜(Activated)',
        ...applyWrapStyles()
    },
]
