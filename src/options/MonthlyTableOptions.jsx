export const MonthlyTableOptions = {
    initialState: {
        sorting: [{ id: "profile_id", desc: false }], // 기본 정렬 설정
        showColumnFilters: true // 렌더링시 각 컬럼의 필터가 보여지도록 설정
    },
    enableRowSelection: true, // 행 선택 활성화
    enableMultiRowSelection: false, // 체크박스 -> 라디오 버튼
    enablePagination: true, // 페이지네이션 활성화
    // enableClickToCopy: true, // 모든 셀에 대해 복사 활성화
    enableFilters: true, // 전체 테이블에 필터링을 활성화
    positionToolbarAlertBanner: 'none',

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            console.log('Row clicked', row.original);

            row.getToggleSelectedHandler()(event);

            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor:' pointer',
        }
    }),

    renderDetailPanel: ({ row }) => (
        <div>
            {/* Use Byte Details */}
            <h2 className="font-bold">Use Byte Details</h2>
            <ul>
                {(row.original.use_byte_detail || []).map((detail) => (
                    <li key={detail.con_type}>
                        ConType: {detail.con_type}, FreeByteCode: {detail.free_byte_code}, Use
                        Byte: {detail.use_byte}
                    </li>
                ))}
                {/* No Data Fallback */}
                {!(row.original.use_byte_detail?.length) && (
                    <p className="text-gray-500">No use byte details available.</p>
                )}
            </ul>

            {/* Use Period Details */}
            <h2 className="font-bold mt-4">Use Period Details</h2>
            <ul>
                {(row.original.use_period_detail || []).map((detail) => (
                    <li key={detail.deact_profile_id}>
                        DeactProfileId: {detail.deact_profile_id}, AccountNo: {detail.account_no},
                        ActDate: {detail.act_date},
                        DeactDate: {detail.deact_date}, UsePeriod: {detail.use_period},
                        UsePercentOfMonth: {detail.use_percent_of_month}%
                    </li>
                ))}
                {/* No Data Fallback */}
                {!(row.original.use_period_detail?.length) && (
                    <p className="text-gray-500">No use period details available.</p>
                )}
            </ul>

            {/* Payment */}
            <h2 className="font-bold mt-4">Payment</h2>
            <ul>
                <li>BasicFee: {row.original.payment?.basic_fee ?? 'N/A'}</li>
                <li>SubscribeFee: {row.original.payment?.subscribe_fee ?? 'N/A'}</li>
                <li>AddUseFee: {row.original.payment?.add_use_fee ?? 'N/A'}</li>
                <li>TaxFee: {row.original.payment?.tax_fee ?? 'N/A'}</li>
                <li>TotalFee: {row.original.payment?.total_fee ?? 'N/A'}</li>
                <li>CutOffFee: {row.original.payment?.cut_off_fee ?? 'N/A'}</li>
                <li>FinalFee: {row.original.payment?.final_fee ?? 'N/A'}</li>
            </ul>

            {/* Payment Details */}
            <h2 className="font-bold mt-4">Payment Details</h2>
            <ul>
                {(row.original.payment?.fee_detail || []).map((fee, index) => (
                    <li key={index}>
                        Classification: {fee.classfication}, ActDatePeriod: {fee.act_date_period},
                        DefaultBye: {fee.default_byte}, UseByte: {fee.use_byte}, billing_fee: {fee.billing_fee},
                        ApplyCompany: {fee.apply_company}, Note: {fee.note}
                    </li>
                ))}
                {/* No Data Fallback */}
                {!(row.original.payment?.fee_detail?.length) && (
                    <p className="text-gray-500">No payment details available.</p>
                )}
            </ul>

            {/* MMF */}
            <h2 className="font-bold mt-4">Use Period Details</h2>
            <ul>
                {(row.original.use_period_detail || []).map((detail) => (
                    <li key={detail.deact_profile_id}>
                        DeactProfileId: {detail.deact_profile_id}, AccountNo: {detail.account_no},
                        ActDate: {detail.act_date},
                        DeactDate: {detail.deact_date}, UsePeriod: {detail.use_period},
                        UsePercentOfMonth: {detail.use_percent_of_month}%
                    </li>
                ))}
                {/* No Data Fallback */}
                {!(row.original.use_period_detail?.length) && (
                    <p className="text-gray-500">No use period details available.</p>
                )}
            </ul>
        </div>
    ),
};