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
        header: 'Account Number',
    },
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
    },
    {
        accessorKey: 'alias',
        header: 'Alias',
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'activate_date',
        header: 'Activate Date',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deactivate_date',
        header: 'Deactivate Date',
        Cell: ({ cell }) =>
            cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : 'N/A',
    },
    {
        accessorKey: 'free_bytes',
        header: 'Free Bytes',
    },
    {
        accessorKey: 'use_byte_total',
        header: 'Use Byte Total',
    },
    {
        accessorKey: 'use_byte',
        header: 'Use Byte (Detail)',
        Cell: ({ cell }) =>
            Object.entries(cell.getValue() || {}).map(([key, value]) => (
                <div key={key}>
                    <strong>{key}: </strong>
                    {value}
                </div>
            )),
    },
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
        header: 'Use Period',
    },
    {
        accessorKey: 'use_percent_of_month',
        header: 'Use Percent of Month (%)',
        size: 200,
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
