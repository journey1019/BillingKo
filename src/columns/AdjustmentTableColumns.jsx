import {
    AdjustmentCell_Category,
    AdjustmentCell_Code, AdjustmentCell_Cycle, AdjustmentCell_Mount_Value, AdjustmentCell_Type,
    AdjustmentCell_Use, AdjustmentCell_Amount
} from '@/columns/cellStyle/AdjustmentCell.jsx';
import {
    formatDateIndex,
    formatDateTime,
    renderNumberCell,
    applyRightAlignStyles,
    FormatUseYnToggle,
} from './cellStyle/AccountCell.jsx';
import { applyCenterAlignStyles } from './cellStyle/BasicCellStyle.jsx';

export const AdjustmentTableColumns = [
    {
        accessorKey: 'adjustment_index',
        header: '번호',
        size: 50,
    },
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: FormatUseYnToggle,
        ...applyCenterAlignStyles(),
    },
    {
        accessorKey: 'tax_free_yn',
        header: '부가세 계산 시점',
        Cell: FormatUseYnToggle,
        ...applyCenterAlignStyles(),
    },
    {
        accessorKey: 'adjustment_code',
        header: '조정 대상 구분',
        Cell: AdjustmentCell_Code,
    },
    {
        accessorKey: 'adjustment_code_value',
        header: '조정 대상',
    },
    {
        accessorKey: 'adjustment_category',
        header: '조정 항목',
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: '할인/가산 구분',
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: '요금 적용 기준',
        Cell: AdjustmentCell_Amount
    },
    {
        accessorKey: 'adjustment_cycle',
        header: '조정 적용 주기',
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: '요금 적용 금액',
        Cell: renderNumberCell,
        // ...applyRightAlignStyles()
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: 'description',
        header: '설명',
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
        Cell: formatDateIndex,
    }
]

/**
 * @desc: AccountForm_Transaction Table Columns
 * */
export const AdjustmentReferencesTableColumns = [
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
        Cell: formatDateIndex,
    },
    {
        accessorKey: 'adjustment_category',
        header: '조정 항목',
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: '할인/가산 구분',
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: '요금 적용 기준',
        Cell: AdjustmentCell_Amount,
    },
    {
        accessorKey: 'adjustment_cycle',
        header: '조정 적용 주기',
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: '요금 적용 금액',
        Cell: renderNumberCell,
        ...applyRightAlignStyles()
    },
    {
        accessorKey: 'description',
        header: '설명',
    }
]

export const AdjustmentHistoryTableColumns = [
    // {
    //     accessorKey: 'adjustment_index',
    //     header: 'Index',
    //     size: 50,
    // },
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
        Cell: formatDateIndex,
    },
    // {
    //     accessorKey: 'adjustment_code',
    //     header: '조정 대상 구분',
    //     Cell: AdjustmentCell_Code,
    // },
    // {
    //     accessorKey: 'adjustment_code_value',
    //     header: '조정 대상',
    // },
    {
        accessorKey: 'adjustment_category',
        header: '조정 항목',
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: '할인/가산 구분',
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: '요금 적용 기준',
        Cell: AdjustmentCell_Amount,
    },
    {
        accessorKey: 'adjustment_cycle',
        header: '조정 적용 주기',
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: '요금 적용 금액',
        Cell: renderNumberCell,
        ...applyRightAlignStyles()
    },
    {
        accessorKey: 'description',
        header: '설명',
    },
    {
        accessorKey: 'user_id',
        header: 'User ID',
    },
    {
        accessorKey: 'update_date',
        header: 'Update Date',
        Cell: formatDateTime
    }
]