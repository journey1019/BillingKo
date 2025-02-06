export const FileUpdateTableColumns = [
    {
        accessorKey: 'file_name',
        header: 'File Name',
    },
    {
        accessorKey: 'update_date',
        header: 'Update Date ',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'user_id',
        header: 'User ID ',
    },
    {
        accessorKey: 'update_index',
        header: 'Update Index ',
    },
    {
        accessorKey: 'file_size',
        header: 'File Size',
    },
];