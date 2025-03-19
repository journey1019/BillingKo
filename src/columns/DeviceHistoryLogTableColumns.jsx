import { formatDateIndex } from './cellStyle/AccountCell.jsx';

export const DeviceHistoryLogTableColumns = [
    // {
    //     accessorKey: 'row_number',
    //     header: '번호',
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
        // enableClickToCopy : true,
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'act_date',
        header: '활성화 날짜',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deact_date',
        header: '비활성화 날짜',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
        Cell: formatDateIndex,
    },
    // {
    //     accessorKey: 'row_index',
    //     header: 'Row Index',
    // }
];