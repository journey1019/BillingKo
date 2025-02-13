export const DeviceHistoryLogTableColumns = [
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        enableClickToCopy : true,
    },
    {
        accessorKey: 'row_number',
        header: 'Row Number',
    },
    {
        accessorKey: 'act_date',
        header: 'Activate',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deact_date',
        header: 'Deactivate',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'acct_num',
        header: 'Account Number',
    },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID',
    },
    {
        accessorKey: 'date_index',
        header: 'Date Index',
    },
    {
        accessorKey: 'row_index',
        header: 'Row Index',
    }
];