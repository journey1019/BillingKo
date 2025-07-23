import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { Autocomplete } from '@mui/material';

// 사용자가 Enter/Tab 누를 때 기본값을 자동으로 setEditCellValue로 반영 (DatePicker는 onChange 발생하지 않으면 값 적용 x)
const renderDateEditCell = (params) => {
    const defaultDayjs = params.value ? dayjs(params.value) : null; // 기본값: 오늘

    const handleCommit = (newValue) => {
        params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue ? newValue.toDate() : null,
        }, { debounceMs: 200 });
    };

    return (
        <DatePicker
            format="YYYY-MM-DD"
            clearable
            value={defaultDayjs}
            onChange={(newValue) => {
                handleCommit(newValue);
            }}
            onAccept={(newValue) => {
                handleCommit(newValue || defaultDayjs);
            }}
            onClose={() => {
                // 사용자가 picker를 닫을 때 기본값이라도 반영
                handleCommit(defaultDayjs);
            }}
            autoFocus
            reduceAnimations
            disableOpenPicker={false}
            slotProps={{
                textField: {
                    variant: 'standard',
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'YYYY-MM-DD',
                    onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === 'Tab') {
                            e.stopPropagation();
                            e.preventDefault();
                            handleCommit(defaultDayjs);
                            params.api.stopCellEditMode({ id: params.id, field: params.field });
                        }
                    },
                },
            }}
        />
    );
};


const PaymentTableColumns = ({ onFinalFeeClick }) => [
    {
        field: 'acct_num',
        headerName: '고객번호',
        width: 100,
        editable: false,
        cellClassName: 'bg-[#dedede]',
    },
    {
        field: 'acct_name',
        headerName: '고객명',
        width: 130,
        editable: false,
        cellClassName: 'bg-[#dedede]',
    },
    {
        field: 'monthly_final_fee',
        headerName: '청구금',
        width: 100,
        editable: false,
        cellClassName: 'bg-[#dedede]',
        type: 'number',
    },
    {
        field: 'none_pay_fee_basic',
        headerName: '미납금',
        width: 100,
        editable: true,
        type: 'number',
    },
    {
        field: 'late_payment_penalty_fee',
        headerName: '연체 가산금',
        width: 100,
        editable: true,
        type: 'number',
        cellClassName: 'cursor-text' // ✅ 강조
    },
    {
        field: 'final_fee',
        headerName: '총 납부 금액',
        width: 130,
        editable: false,
        cellClassName: 'bg-[#dedede]',
        type: 'number',
        headerClassName: 'bold-header', // 커스텀 클래스 추가
        renderCell: (params) => {
            return (
                <span
                    style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                    onClick={() => onFinalFeeClick(params)}
                >
            {params.value?.toLocaleString() || 0}
        </span>
            );
        }

    },
    {
        field: 'payment_amount_fee',
        headerName: '고객 납부금',
        width: 110,
        editable: true,
        type: 'number',
        cellClassName: 'cursor-text' // ✅ 강조
    },
    {
        field: 'unpaid_balance_fee',
        headerName: '미납 잔액',
        width: 120,
        editable: false,
        cellClassName: 'bg-[#dedede]',
        type: 'number',
    },
    {
        field: 'confirm_yn',
        headerName: '상태',
        width: 100,
        editable: false,
        align: 'center',
        cellClassName: 'bg-[#dedede]',
        headerAlign: 'center',
        renderCell: (params) => {
            const status = params.value;
            const label = status === 'Y' ? '완납' : status === 'P' ? '부분납' : '미납';
            const color = status === 'Y' ? '#53d571' : status === 'P' ? '#ffd147' : '#e46774';
            return (
                <span
                    style={{
                        color: color,
                        backgroundColor: 'white',
                        padding: '4px 8px',
                        borderWidth: 0.5,
                        borderColor: color,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                    }}
                >
                    {label}
                </span>
            );
        },
    },
    {
        field: 'confirm_payment_date',
        headerName: '납부일',
        width: 130,
        editable: true,
        cellClassName: 'cursor-text', // ✅ 강조
        type: 'date',
        valueGetter: (params) => {
            const raw = params?.row?.confirm_payment_date;

            // 1. undefined/null 방지
            if (!raw) return null;

            // 2. 이미 Date면 그대로 반환
            if (raw instanceof Date) return raw;

            // 3. 문자열이면 dayjs로 파싱해서 Date로 변환
            const parsed = dayjs(raw);
            return parsed.isValid() ? parsed.toDate() : null;
        },
        renderEditCell: renderDateEditCell,
        renderCell: (params) => {
            const raw = params.row.confirm_payment_date;
            return raw ? dayjs(raw).format('YYYY-MM-DD') : '';
        }
    },
    {
        field: 'confirm_payment_method',
        headerName: '납부 방법',
        width: 120,
        editable: true,
        cellClassName: 'cursor-text',
        renderCell: (params) => {
            const method = params.value;
            const label = params.value === 'giro' ? '지로' : params.value === 'account' ? '은행' : '';
            const color = method === 'giro' ? '#5a2eea' : method === 'account' ? '#ea9f2e' : '#8e8e8e';
            return (
                <span
                    style={{
                        color: color,
                        backgroundColor: 'white',
                        padding: '4px 8px',
                        borderWidth: 0.5,
                        borderColor: color,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                    }}
                >
                    {label}
                </span>
            )
        },
        renderEditCell: (params) => {
            const options = [
                { label: '지로', value: 'giro' },
                { label: '은행', value: 'account' },
            ];

            const selected = options.find((opt) => opt.value === params.value) || null;

            return (
                <Autocomplete
                    autoHighlight
                    options={options}
                    getOptionLabel={(option) => option.label}
                    value={selected}
                    onChange={(_, newValue) => {
                        params.api.setEditCellValue({
                            id: params.id,
                            field: params.field,
                            value: newValue?.value || '',
                        });
                    }}
                    renderInput={(paramsInput) => (
                        <TextField
                            {...paramsInput}
                            variant="standard"
                            autoFocus
                        />
                    )}
                    fullWidth
                />
            );
        },
    },
    {
        field: 'confirm_payment_desc',
        headerName: '설명',
        flex: 1.2,
        minWidth: 200,
        editable: true,
        cellClassName: 'cursor-text' // ✅ 강조
    }
]

export default PaymentTableColumns;