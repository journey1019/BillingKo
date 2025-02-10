import {
    AdjustmentCell_Category,
    AdjustmentCell_Code, AdjustmentCell_Cycle, AdjustmentCell_Mount_Value, AdjustmentCell_Type,
    AdjustmentCell_Use,
} from '@/columns/cellStyle/AdjustmentCell.jsx';

export const AdjustmentTableColumns = [
    {
        accessorKey: 'adjustment_index',
        header: 'Index',
    },
    {
        accessorKey: 'adjustment_code',
        header: '조정 대상 종류',
        Cell: AdjustmentCell_Code,
    },
    {
        accessorKey: 'adjustment_code_value',
        header: '조정 대상',
    },
    {
        accessorKey: 'adjustment_category',
        header: '조정 종류',
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: '조정 타입',
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: '요금 적용 기준',
    },
    {
        accessorKey: 'mount_value',
        header: '요금 적용 금액',
        Cell: AdjustmentCell_Mount_Value
    },
    {
        accessorKey: 'description',
        header: '설명',
    },
    {
        accessorKey: 'adjustment_cycle',
        header: '조정 적용 주기',
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: AdjustmentCell_Use,
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
    }
]