import DateStampCell from '@/columns/cellStyle/DateStampCell.jsx';

export const NetworkReportTableColumns = [
    {
        accessorKey: 'sp_id',
        header: 'SP ID',
    },
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        enableClickToCopy: true,  // 클릭 시 복사 가능
    },
    {
        accessorKey: 'terminal_id',
        header: 'Terminal ID',
    },
    {
        accessorKey: 'activated',
        header: 'Activated',
        Cell: DateStampCell,
    },
    {
        accessorKey: 'sid',
        header: 'SID',
    },
    {
        accessorKey: 'psn',
        header: 'PSN',
    },
    {
        accessorKey: 'mode',
        header: 'Mode',
    },
    {
        accessorKey: 'feature_options',
        header: 'Feature Options',
    },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID',
    },
    {
        accessorKey: 'profile_name',
        header: 'Profile Name',
    },
    {
        accessorKey: 'profiles',
        header: 'Profiles',
    },
    {
        accessorKey: 'ip_service_address',
        header: 'IP Service Addr',
    }
]