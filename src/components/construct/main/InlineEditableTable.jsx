import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, CircularProgress, Typography, Tooltip } from '@mui/material';
import usePaymentStore from '@/stores/paymentStore.js';
import MonthPicker from '@/components/time/MonthPicker';
import MonthPickerArrow from '../../time/MonthPickerArrow.jsx';
import { formatDateTime, formatDateKSTTime } from '@/columns/cellStyle/AccountCell.jsx';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { convertUTCToKST, convertKSTToUTC } from '@/utils/time';
// import { formatDateTimeUTCtoKST } from '@/columns/cellStyle/PaymentCell.jsx';
import { Switch, FormControlLabel, FormHelperText } from '@mui/material';
import { applyRightDivisionStyles, renderDivisionCell, getFormatDateTimeUTCtoKST, renderNumberCell, applyRightAlignStyles } from '@/columns/cellStyle/PaymentCell.jsx';
import AlertBox from '@/components/common/AlertBox';
import { applyCenterAlignStyles } from '../../../columns/cellStyle/PaymentCell.jsx';

import AccountPayment from '@/components/form/Homepage/AccountPayment.jsx';


const REQUIRED_FIELDS = ['confirm_yn', 'confirm_payment_method', 'confirm_payment_date'];

const InlineEditableTable = ({ yearMonth, selectedDate, handleDateChange, monthlyAcctSaveData }) => {
    const { updateConfirmStatus } = usePaymentStore();
    const [editedUsers, setEditedUsers] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [alert, setAlert] = useState(null); // { type, title, message } or null

    const handleSaveUsers = async () => {
        const errors = {};
        const formatted = [];

        Object.entries(editedUsers).forEach(([acct_num, user]) => {
            const original = monthlyAcctSaveData.find((row) => row.acct_num === acct_num);
            const payload = { acct_num };
            let isValid = true;

            REQUIRED_FIELDS.forEach((key) => {
                const value = user[key] ?? original?.[key];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    errors[`${acct_num}-${key}`] = '필수 항목입니다';
                    isValid = false;
                } else {
                    payload[key] = value;
                }
            });

            if (isValid) {
                // 선택적으로 수정한 필드 추가 (필수값 제외)
                Object.entries(user).forEach(([key, val]) => {
                    if (!REQUIRED_FIELDS.includes(key)) {
                        payload[key] = val;
                    }
                });

                formatted.push(payload);
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setAlert({
                type: 'warning',
                title: 'Warning alert!',
                message: 'Double-check your input values.',
            });
            setTimeout(() => setAlert(null), 3000);
            return;
        }

        console.log('📦 API Payload:', formatted); // 🔍 확인용
        setSaving(true);
        try {
            await updateConfirmStatus(yearMonth, formatted);
            setEditedUsers({});
            setValidationErrors({});
            setAlert({
                type: 'success',
                title: 'Success alert!',
                message: 'Your changes have been saved!',
            });
        } catch (err) {
            console.error('❌ API 요청 실패:', err);
            setAlert({
                type: 'warning',
                title: 'Warning alert!',
                message: 'Double-check your input values.',
            });
        } finally {
            setSaving(false);
            setTimeout(() => setAlert(null), 3000);
        }
    };


    const columns = useMemo(() => [
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

    const table = useMaterialReactTable({
        columns,
        data: monthlyAcctSaveData || [],
        enableEditing: true,
        enableSorting: true,
        editDisplayMode: 'cell',
        positionActionsColumn: 'last',
        initialState: {
            sorting: [{ id: 'confirm_yn', desc: false }],
            density: 'compact'
        },
    });
    console.log(monthlyAcctSaveData)

    return (
        <div className="py-4 grid gap-0 grid-cols-1">
            <div className="bg-white rounded-2xl shadow-md col-span-1">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="px-4 pt-4 text-red-500">납부 데이터를 셀에서 직접 수정할 수 있습니다.</div>
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', mt: 2, pr: 2 }}>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleSaveUsers}
                            disabled={Object.keys(editedUsers).length === 0}
                        >
                            {saving ? <CircularProgress size={25} /> : '저장'}
                        </Button>
                        {Object.values(validationErrors).some(Boolean) && (
                            <Typography color="error">필수 항목을 모두 입력하세요.</Typography>
                        )}
                        <AccountPayment/>
                    </Box>
                </div>
                <div className="p-4">
                    <MaterialReactTable table={table} />
                </div>
            </div>
            {alert && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 9999,
                }}>
                    <AlertBox
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                    />
                </div>
            )}

        </div>
    );
};

export default InlineEditableTable;
