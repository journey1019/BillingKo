import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';

const Example = ({ selectedDate, handleDateChange, yearMonth, monthlyAcctSaveData }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [editedUsers, setEditedUsers] = useState({});

    // 유효성 검사 함수
    const validateRequired = (value) => !!value.length;

    const handleTextFieldProps = ({ cell, row }) => ({
        type: 'text',
        required: true,
        error: !!validationErrors?.[cell.id],
        helperText: validationErrors?.[cell.id] || '',
        onBlur: (event) => {
            const value = event.target.value?.trim() || '';
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [cell.id]: value ? undefined : 'Required',
            }));

            setEditedUsers((prevUsers) => ({
                ...prevUsers,
                [row.acct_num]: {
                    ...(prevUsers[row.acct_num] || {
                        acct_num: row.acct_num,
                        confirm_yn: row.confirm_yn,
                        confirm_payment_method: row.confirm_payment_method,
                    }),
                    [cell.column.id]: value,
                },
            }));
        },
    });

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

    const handleSaveUsers = async () => {
        if (Object.values(validationErrors).some((error) => !!error)) return;

        // API 요청을 위해 필터링된 데이터 생성
        const formattedUsers = Object.values(editedUsers).map((user) => ({
            acct_num: user.acct_num,
            confirm_yn: user.confirm_yn,
            confirm_payment_method: user.confirm_payment_method,
            ...Object.fromEntries(
                Object.entries(user).filter(
                    ([key]) =>
                        key !== 'acct_num' && key !== 'confirm_yn' && key !== 'confirm_payment_method'
                )
            ),
        }));

        await updateUsers(formattedUsers);
        setEditedUsers({});
    };

    const table = useMaterialReactTable({
        columns,
        data: monthlyAcctSaveData || [],
        createDisplayMode: 'row',
        editDisplayMode: 'table',
        enableEditing: true,
        enableRowActions: true,
        positionActionsColumn: 'last',
    });

    return (
        <div className="py-4 grid gap-0 grid-cols-1">
            <div className="bg-white rounded-2xl shadow-md col-span-1">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
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
