import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, CircularProgress, Typography, } from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQueryClient, } from '@tanstack/react-query';
import { fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import usePaymentStore from '@/stores/paymentStore.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';


const Example = ({ selectedDate, handleDateChange, yearMonth, monthlyAcctSaveData }) => {
    console.log(monthlyAcctSaveData)
    const { updateConfirmStatus } = usePaymentStore();
    const [validationErrors, setValidationErrors] = useState({});
    const [editedUsers, setEditedUsers] = useState({});

    const [saving, setSaving] = useState(false);
    // 유효성 검사 함수
    const validateRequired = (value) => !!value.length;

    const handleTextFieldProps = ({ cell, row }) => {
        const key = `${row.acct_num}-${cell.column.id}`;
        return {
            type: 'text',
            required: REQUIRED_FIELDS.includes(cell.column.id),
            error: !!validationErrors?.[key],
            helperText: validationErrors?.[key] || '',
            onBlur: (event) => {
                const value = event.target.value?.trim() || '';
                setEditedUsers((prev) => ({
                    ...prev,
                    [row.acct_num]: {
                        ...(prev[row.acct_num] || {}),
                        acct_num: row.acct_num,
                        [cell.column.id]: value,
                    },
                }));
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    [key]: REQUIRED_FIELDS.includes(cell.column.id) && !value ? '필수 항목입니다.' : undefined,
                }));
            },
        };
    };


    const REQUIRED_FIELDS = ['confirm_yn', 'confirm_payment_method', 'confirm_payment_date'];

    const handleSaveUsers = async () => {
        const newValidationErrors = {};
        const formattedUsers = [];

        Object.entries(editedUsers).forEach(([acct_num, user]) => {
            const userData = { acct_num };
            let isValid = true;

            REQUIRED_FIELDS.forEach((field) => {
                const value = user[field];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    newValidationErrors[`${acct_num}-${field}`] = '필수 항목입니다.';
                    isValid = false;
                } else {
                    userData[field] = value;
                }
            });

            if (isValid) {
                // 모든 필수값 외의 수정값도 추가
                const otherFields = Object.entries(user).filter(
                    ([key]) => !['acct_num', ...REQUIRED_FIELDS].includes(key)
                );
                otherFields.forEach(([key, value]) => {
                    userData[key] = value;
                });

                formattedUsers.push(userData);
            }
        });

        // 유효성 오류 있을 경우 UI 표시
        if (Object.keys(newValidationErrors).length > 0) {
            setValidationErrors(newValidationErrors);
            return;
        }

        setSaving(true);
        try {
            await updateConfirmStatus(yearMonth, formattedUsers);
            setEditedUsers({});
            setValidationErrors({});
        } catch (err) {
            console.error('업데이트 실패:', err);
        } finally {
            setSaving(false);
        }
    };


    const handleSelectFieldProps = ({ row, column }) => ({
        select: true,
        onChange: (event) => {
            const { value } = event.target;
            setEditedUsers((prevUsers) => ({
                ...prevUsers,
                [row.acct_num]: {
                    ...(prevUsers[row.acct_num] || {
                        acct_num: row.acct_num,
                        confirm_yn: row.confirm_yn,
                        confirm_payment_method: row.confirm_payment_method,
                    }),
                    [column.id]: value,
                },
            }));
        },
    });

    const columns = useMemo(
        () => [
            { accessorKey: 'acct_num', header: '고객번호', enableEditing: false },
            { accessorKey: 'account_info.acct_name', header: '고객명', enableEditing: false },
            { accessorKey: 'none_pay_fee', header: '미납요금', enableEditing: false },
            { accessorKey: 'confirm_yn', header: '납부현황', editVariant: 'select', editSelectOptions: ['Y', 'N'], muiEditTextFieldProps: handleSelectFieldProps },
            { accessorKey: 'confirm_payment_method', header: '납부방법', editVariant: 'select', editSelectOptions: ['무통장입금', 'Giro'], muiEditTextFieldProps: handleSelectFieldProps },
            { accessorKey: 'confirm_payment_bank', header: '납부은행', editVariant: 'select', editSelectOptions: ['신한은행', '하나은행', '국민은행'], muiEditTextFieldProps: handleSelectFieldProps },
            { accessorKey: 'confirm_payment_desc', header: '납부설명', muiEditTextFieldProps: handleTextFieldProps },
        ],
        [editedUsers, validationErrors]
    );

    const { mutateAsync: updateUsers, isPending: isUpdatingUsers } = useUpdateUsers(yearMonth);

    const table = useMaterialReactTable({
        columns,
        data: monthlyAcctSaveData || [],
        createDisplayMode: 'row',
        editDisplayMode: 'table',
        enableEditing: true,
        enableRowActions: true,
        positionActionsColumn: 'last',
        initialState: { density: 'compact' },
    });

    return (
        <div className="py-4 grid gap-0 grid-cols-1">
            <div className="bg-white rounded-2xl shadow-md col-span-1">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                </div>
                <div className="px-4 pt-4">
                    <span className="text-red-500">납부현황을 체크할 데이터를 클릭해주세요.</span>
                </div>
                <div className="p-4">
                    <MaterialReactTable table={table} />
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', mt: 2 }}>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleSaveUsers}
                            disabled={Object.keys(editedUsers).length === 0 || Object.values(validationErrors).some((error) => !!error)}
                        >
                            {isUpdatingUsers ? <CircularProgress size={25} /> : 'Save Changes'}
                        </Button>
                        {Object.values(validationErrors).some((error) => !!error) && (
                            <Typography color="error">Fix errors before submitting</Typography>
                        )}
                    </Box>
                </div>
            </div>
        </div>
    );
};

// API 호출 및 상태 관리 (React Query)
function useUpdateUsers(yearMonth) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (users) => {
            await fetchPaymentConfirm(yearMonth, users);
        },
        onMutate: (newUsers) => {
            queryClient.setQueryData(['users'], (prev = []) => prev.map(user => newUsers.find(u => u.acct_num === user.acct_num) || user));
        },
    });
}

// React Query 클라이언트 생성
const queryClient = new QueryClient();

export default function NonPaymentStatus({ selectedDate, handleDateChange, yearMonth, monthlyAcctSaveData }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Example selectedDate={selectedDate} handleDateChange={handleDateChange} yearMonth={yearMonth} monthlyAcctSaveData={monthlyAcctSaveData} />
        </QueryClientProvider>
    );
}
