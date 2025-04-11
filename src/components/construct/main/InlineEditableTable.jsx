import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, CircularProgress, Typography, Tooltip } from '@mui/material';
import usePaymentStore from '@/stores/paymentStore.js';
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
import { formatDateIndex } from '../../../utils/formatHelpers.jsx';
import useInlineEditableColumns from '@/columns/InlineEditableTableColumns.jsx';

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

        // console.log('📦 API Payload:', formatted); // 🔍 확인용
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
            // console.error('❌ API 요청 실패:', err);
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

    const columns = useInlineEditableColumns({
        editedUsers,
        setEditedUsers,
        validationErrors
    });

    const table = useMaterialReactTable({
        columns,
        data: monthlyAcctSaveData || [],
        enableEditing: true,
        enableSorting: true,
        editDisplayMode: 'cell',
        positionActionsColumn: 'last',
        enablePagination: false,
        initialState: {
            sorting: [{ id: 'confirm_yn', desc: false }],
            density: 'compact',
            pagination: { pageSize: 30, pageIndex: 0 }
        },
    });
    // console.log(monthlyAcctSaveData)

    return (
        <div className="py-4 grid gap-0 grid-cols-1">
            <div className="bg-white rounded-2xl shadow-md col-span-1">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">{formatDateIndex(yearMonth)} 납부 현황</h1>
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="px-4 pt-4 text-red-500">수정하고 싶은 셀을 <span className="font-bold underline">더블클릭</span>하여 수정할 수 있습니다.</div>
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
