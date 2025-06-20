import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { formatNumber } from '@/utils/formatHelpers';
import { formatDateToYMD } from '@/columns/cellStyle/PaymentCell';

const AccountPaymentDetailList = ({ rowId, expandedRowIds, detailData }) => {
    if (!expandedRowIds.includes(rowId)) return null;

    if (detailData === 'LOADING') {
        return (
            <Box sx={{ p: 2 }}>
                <CircularProgress size={20} /> 로딩 중...
            </Box>
        );
    }
    if (!detailData || detailData.length === 0) {
        return (
            <Box sx={{ p: 2, backgroundColor: '#e6e6e6' }}>
                <Typography variant="body2">📌 상세 데이터 없음</Typography>
            </Box>
        );
    }


    return (
        <Box sx={{ p: 2, backgroundColor: '#e6e6e6' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>📌 상세 이력 데이터:</Typography>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>청구금액</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>당월미납산정액</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>당월미납가산</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>당월미납총액</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>당월남은금액</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>회차별 납부금액</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>상태</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>납부일</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>납부방법</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>납부설명</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>확인날짜</th>
                </tr>
                </thead>
                <tbody>
                {detailData.map((detail, idx) => (
                    <tr key={detail.update_index || idx}>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.monthly_final_fee)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.save_none_paid_basic)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.save_late_penalty_fee)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.save_none_paid_fee)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.payment_none_paid_fee)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatNumber(detail.payment_paid_fee)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{detail.confirm_yn}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatDateToYMD(detail.confirm_payment_date)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{detail.confirm_payment_method}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{detail.confirm_payment_desc}</td>
                        <td style={{ border: '1px solid #ccc', padding: 4 }}>{formatDateToYMD(detail.confirm_date)}</td>
                    </tr>
                ))}
                </tbody>
            </Box>
        </Box>
    );
};

export default AccountPaymentDetailList;
