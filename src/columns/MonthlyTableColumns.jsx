import { formatNumber } from '@/utils/formatHelpers.jsx';

/** MonthlyTableColumns.jsx */
export const MonthlyTableColumns = [
    // {
    //     accessorKey: 'data_index',
    //     header: 'Profile ID',
    // },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID',
    },
    {
        accessorKey: 'acct_num',
        header: '고객 번호',
    },
    {
        accessorKey: 'serial_number',
        header: '단말기',
    },
    {
        accessorKey: 'alias',
        header: '별칭',
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'activate_date',
        header: '활성화 날짜',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deactivate_date',
        header: '비활성화 날짜',
        Cell: ({ cell }) =>
            cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-',
    },
    {
        accessorKey: 'update_date',
        header: '수정 날짜',
        Cell: ({ cell }) =>
            cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-',
    },
    {
        accessorKey: 'free_bytes',
        header: '무료 바이트 제공량',
        Cell: ({ cell }) => (
            <div className="text-right">{formatNumber(cell.getValue())}</div>
        ),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: 'use_byte_total',
        header: '총 사용 바이트(b)',
        Cell: ({ cell }) => (
            <div className="text-right">{formatNumber(cell.getValue())}</div>
        ),
        muiTableHeadCellProps: { align: 'right' },
    },
    // {
    //     accessorKey: 'use_byte',
    //     header: 'Use Byte (Detail)',
    //     Cell: ({ cell }) =>
    //         Object.entries(cell.getValue() || {}).map(([key, value]) => (
    //             <div key={key}>
    //                 <strong>{key}: </strong>
    //                 {value}
    //             </div>
    //         )),
    // },
    // {
    //     accessorKey: 'use_byte_detail',
    //     header: 'Use Byte Detail',
    //     Cell: ({ cell }) =>
    //         (cell.getValue() || []).map((item, index) => (
    //             <div key={index}>
    //                 {Object.entries(item).map(([key, value]) => (
    //                     <div key={key}>
    //                         <strong>{key}: </strong>
    //                         {value}
    //                     </div>
    //                 ))}
    //             </div>
    //         )),
    // },
    {
        accessorKey: 'use_period',
        header: '사용 기간',
        Cell: ({ cell }) => (
            <div className="text-right">{cell.getValue()}</div>
        ),
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: 'use_percent_of_month',
        header: '월 사용 비율(%)',
        size: 200,
        Cell: ({ cell }) => (
            <div className="text-left">{cell.getValue()}%</div>
        ),
    },
    // {
    //     accessorKey: 'payment',
    //     header: 'Payment',
    //     Cell: ({ cell }) =>
    //         Object.entries(cell.getValue() || {}).map(([key, value]) => {
    //             if (Array.isArray(value)) {
    //                 // If the value is an array (e.g., fee_detail or adjustment_info)
    //                 return (
    //                     <ul key={key}>
    //                         <strong>{key}:</strong>
    //                         {value.map((item, index) => (
    //                             <li key={index}>
    //                                 {Object.entries(item).map(([subKey, subValue]) => (
    //                                     <div key={subKey}>
    //                                         <strong>{subKey}: </strong>
    //                                         {subValue}
    //                                     </div>
    //                                 ))}
    //                             </li>
    //                         ))}
    //                     </ul>
    //                 );
    //             }
    //             // If the value is a simple key-value pair
    //             return (
    //                 <div key={key}>
    //                     <strong>{key}: </strong>
    //                     {value}
    //                 </div>
    //             );
    //         }),
    // },
    // {
    //     accessorKey: 'mmf',
    //     header: 'MMF',
    //     Cell: ({ cell }) =>
    //         (cell.getValue() || []).map((item, index) => (
    //             <div key={index}>
    //                 {Object.entries(item).map(([key, value]) => (
    //                     <div key={key}>
    //                         <strong>{key}: </strong>
    //                         {value}
    //                     </div>
    //                 ))}
    //             </div>
    //         )),
    // },
    // {
    //     accessorKey: 'dat',
    //     header: 'DAT',
    //     Cell: ({ cell }) =>
    //         (cell.getValue() || []).map((item, index) => (
    //             <div key={index}>
    //                 {Object.entries(item).map(([key, value]) => (
    //                     <div key={key}>
    //                         <strong>{key}: </strong>
    //                         {value}
    //                     </div>
    //                 ))}
    //             </div>
    //         )),
    // },
    // {
    //     accessorKey: 'act',
    //     header: 'ACT',
    //     Cell: ({ cell }) =>
    //         (cell.getValue() || []).map((item, index) => (
    //             <div key={index}>
    //                 {Object.entries(item).map(([key, value]) => (
    //                     <div key={key}>
    //                         <strong>{key}: </strong>
    //                         {value}
    //                     </div>
    //                 ))}
    //             </div>
    //         )),
    // },
];
