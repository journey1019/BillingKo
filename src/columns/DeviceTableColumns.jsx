export const DeviceTableColumns = [
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        enableClickToCopy : true,
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
        accessorKey: 'activated',
        header: 'Activate',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deactivated',
        header: 'Deactivate',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'model_name',
        header: 'Model Name',
    },
    {
        accessorKey: 'internet_mail_id',
        header: 'Mail',
    },
    {
        accessorKey: 'alias',
        header: 'Alias',
    },
    {
        accessorKey: 'remarks',
        header: 'Remarks',
    },
];