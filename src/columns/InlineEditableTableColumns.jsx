import { useMemo } from 'react';
import { formatDateTime, formatDateKSTTime } from '@/columns/cellStyle/AccountCell.jsx';
import { applyRightDivisionStyles, renderDivisionCell, getFormatDateTimeUTCtoKST, renderNumberCell, applyRightAlignStyles } from '@/columns/cellStyle/PaymentCell.jsx';
import { applyCenterAlignStyles } from './cellStyle/PaymentCell.jsx';
import { Switch, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { convertUTCToKST, convertKSTToUTC } from '@/utils/time';


const useInlineEditableColumns = ({ editedUsers, setEditedUsers, validationErrors }) => {
    return useMemo(() => [
        { accessorKey: 'acct_num', header: '고객번호', enableEditing: false, size: 50 },
        { accessorKey: 'confirm_user_id', header: '확인자', enableEditing: false, size: 50 },
        {
            accessorKey: 'confirm_date',
            header: '확인일시(KST)',
            enableEditing: false,
            Cell: formatDateKSTTime,
            size: 100
        },
        { accessorKey: 'none_pay_fee', header: '미납료', enableEditing: false, Cell: renderNumberCell, ...applyRightAlignStyles(), size: 150 },
        {
            accessorKey: 'confirm_yn',
            header: '납부여부',
            Header: <div style={{ color: 'red' }}>납부여부</div>,
            Cell: ({ cell, row }) => {
                const acct_num = row.original.acct_num;
                const editedValue = editedUsers?.[acct_num]?.confirm_yn;
                const value = editedValue ?? cell.getValue(); // ✅ 우선 editedUsers 값 사용

                return (
                    <div className="text-center font-bold pr-3">
                        <Switch
                            checked={value === 'Y'}
                            disabled
                            color="primary"
                            size="small"
                        />
                    </div>
                );
            },
            ...applyCenterAlignStyles(),


            // ✅ 편집 컴포넌트 (Switch)
            Edit: ({ cell, row }) => {
                const acct_num = row.original.acct_num;

                // ✅ 최신 값 계산 (editedUsers → row → fallback)
                const confirm_yn =
                    editedUsers[acct_num]?.confirm_yn ?? row.original.confirm_yn;

                const isChecked = confirm_yn === 'Y';

                const handleChange = (e) => {
                    const value = e.target.checked ? 'Y' : 'N';
                    setEditedUsers((prev) => ({
                        ...prev,
                        [acct_num]: {
                            ...(prev[acct_num] || {}),
                            acct_num,
                            confirm_yn: value,
                        },
                    }));
                };

                return (
                    <FormControlLabel
                        control={<Switch checked={isChecked} onChange={handleChange} />}
                        label={isChecked ? '납부' : '미납'}
                    />
                );
            },
        },
        {
            accessorKey: 'confirm_payment_method',
            header: '납부방법',
            editVariant: 'select',
            editSelectOptions: ['지로', '계좌'],
            Header: <div style={{ color: 'red' }}>납부방법</div>,
            muiEditTextFieldProps: ({ row }) => ({
                select: true,
                error: !!validationErrors[`${row.original.acct_num}-confirm_payment_method`],
                helperText: validationErrors[`${row.original.acct_num}-confirm_payment_method`] || '',
                onChange: (e) => {
                    const value = e.target.value;
                    const acct_num = row.original.acct_num;
                    setEditedUsers((prev) => ({
                        ...prev,
                        [acct_num]: {
                            ...(prev[acct_num] || {}),
                            acct_num,
                            confirm_payment_method: value,
                        },
                    }));
                },
            }),
        },
        {
            accessorKey: 'confirm_payment_bank',
            header: '납부은행',
            editVariant: 'select',
            editSelectOptions: ['국민은행', '기업은행', '신한은행', '우리은행', '하나은행', '농협은행', '카카오뱅크'],
            Header: <div style={{ color: 'red' }}>납부은행</div>,
            muiEditTextFieldProps: ({ row }) => ({
                select: true,
                onChange: (e) => {
                    const value = e.target.value;
                    const acct_num = row.original.acct_num;
                    setEditedUsers((prev) => ({
                        ...prev,
                        [acct_num]: {
                            ...(prev[acct_num] || {}),
                            acct_num,
                            confirm_payment_bank: value,
                        },
                    }));
                },
            }),
        },
        {
            accessorKey: 'confirm_payment_date',
            header: '납부일자',
            Cell: getFormatDateTimeUTCtoKST(editedUsers),
            // muiEditTextFieldProps: undefined, // 사용 안 함
            Header: <div style={{ color: 'red' }}>납부일자(KST)</div>,
            Edit: ({ row }) => {
                const acct_num = row.original.acct_num;
                const rawValue =
                    editedUsers[acct_num]?.confirm_payment_date ?? row.original.confirm_payment_date;

                const kstValue = rawValue ? dayjs(rawValue).add(9, 'hour') : null;

                return (
                    <DateTimePicker
                        ampm={false}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={kstValue}
                        onChange={(newValue) => {
                            const utcFormatted = convertKSTToUTC(
                                newValue.format('YYYY-MM-DD HH:mm:ss')
                            );
                            setEditedUsers((prev) => ({
                                ...prev,
                                [acct_num]: {
                                    ...(prev[acct_num] || {}),
                                    acct_num,
                                    confirm_payment_date: utcFormatted,
                                },
                            }));
                        }}
                        slotProps={{
                            textField: {
                                size: 'small',
                                error: !!validationErrors[`${acct_num}-confirm_payment_date`],
                                helperText:
                                    validationErrors[`${acct_num}-confirm_payment_date`] || '',
                            },
                        }}
                    />
                );
            },
        },
        {
            accessorKey: 'confirm_payment_desc',
            header: '납부설명',
            muiEditTextFieldProps: ({ row }) => ({
                onBlur: (e) => {
                    const value = e.target.value?.trim();
                    const acct_num = row.original.acct_num;
                    setEditedUsers((prev) => ({
                        ...prev,
                        [acct_num]: {
                            ...(prev[acct_num] || {}),
                            acct_num,
                            confirm_payment_desc: value,
                        },
                    }));
                },
            }),
        }
    ], [editedUsers, validationErrors]);
}
export default useInlineEditableColumns
;