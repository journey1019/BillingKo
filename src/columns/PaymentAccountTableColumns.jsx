import { applyRightDivisionStyles, renderDivisionCell, getFormatDateTimeUTCtoKST, renderNumberCell, applyRightAlignStyles } from '@/columns/cellStyle/PaymentCell.jsx';
import { applyCenterAlignStyles, useYNSwitch } from './cellStyle/PaymentCell.jsx';
import { formatDateIndex, formatDateTime } from './cellStyle/AccountCell.jsx';

export const PaymentAccountTableColumns = [
    {
        header: "납부 날짜",
        accessorKey: "date_index",
        filterVariant: 'range',
        Cell: formatDateIndex,
        muiFilterTextFieldProps: ({ column, rangeFilterIndex }) => ({
            placeholder: rangeFilterIndex === 0 ? 'YYYYMM (최소)' : 'YYYYMM (최대)',
            inputProps: {
                maxLength: 6,
            },
            sx: {
                '& input::placeholder': {
                    fontSize: '0.85rem', // 예: 12px
                    color: '#000000',
                },
            },
        }),
    },
    {
        accessorKey: "confirm_user_id",
        header : "확인자",
    },
    {
        accessorKey: "confirm_date",
        header : "확인일자",
        Cell: formatDateTime,
    },
    {
        accessorKey: 'none_pay_fee',
        header: '미납료',
        enableEditing: false,
        Cell: renderNumberCell,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: "confirm_yn",
        header : "납부여부",
        Cell: useYNSwitch,
        ...applyCenterAlignStyles(),
    },
    {
        accessorKey: "confirm_payment_method",
        header : "납부방법",
    },
    {
        accessorKey: "confirm_payment_bank",
        header : "납부은행",
    },
    {
        accessorKey : "confirm_payment_date",
        header : "납부일자",
        Cell: formatDateTime,
    },
    {
        accessorKey : "confirm_payment_desc",
        header : "납부설명",
    },
]