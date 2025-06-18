import {
    applyCenterAlignStyles,
    renderNumberCellNotBold,
    formatDateToYMD,
    applyRightDivisionStyles,
    renderDivisionCell,
    getFormatDateTimeUTCtoKST,
    renderNumberCell,
    renderNumberCellUnder,
    applyRightAlignStyles,
    renderUseConfirmYN,
    renderPaymentMethod
} from '@/columns/cellStyle/PaymentCell.jsx';
import { formatDateIndex, formatDateTime } from './cellStyle/AccountCell.jsx';
import { formatUntilDate } from '../utils/formatHelpers.jsx';

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
        accessorKey: 'monthly_final_fee',
        header: '청구금',
        enableEditing: false,
        Cell: renderNumberCellNotBold,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'none_pay_fee_basic',
        header: '미납금',
        enableEditing: false,
        Cell: renderNumberCellNotBold,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'late_payment_penalty_fee',
        header: '연체 가산금',
        enableEditing: false,
        Cell: renderNumberCellNotBold,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'final_fee',
        header: '총 납부 금액',
        enableEditing: false,
        Cell: renderNumberCellUnder,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'payment_amount_fee',
        header: '고객 납부금',
        enableEditing: false,
        Cell: renderNumberCellNotBold,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'unpaid_balance_fee',
        header: '미납 잔액',
        enableEditing: false,
        Cell: renderNumberCellNotBold,
        ...applyRightAlignStyles(),
        size: 150
    },
    {
        accessorKey: 'confirm_yn',
        header: '상태',
        enableEditing: false,
        Cell: renderUseConfirmYN,
        ...applyCenterAlignStyles(),
        size: 130
    },
    {
        accessorKey: 'confirm_payment_date',
        header: '납부일',
        enableEditing: false,
        Cell: ({ cell }) => formatDateToYMD(cell.getValue()),
        size: 150
    },
    {
        accessorKey: 'confirm_payment_method',
        header: '방법',
        enableEditing: false,
        Cell: renderPaymentMethod,
        ...applyCenterAlignStyles(),
        size: 130
    },
    {
        accessorKey: 'confirm_payment_desc ',
        header: '설명',
        enableEditing: false,
        size: 150
    },
]