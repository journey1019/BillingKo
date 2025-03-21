import { YearMonthCell_Type, UseYorNCell_Type } from '@/columns/cellStyle/FileUpdateCell.jsx';
import { formatDateTime } from '@/utils/formatHelpers.jsx';
import { FormatUseYnToggle } from './cellStyle/AccountCell.jsx';
import { Tooltip } from '@mui/material'; // ✅ MUI Alert 추가
import PortalTooltip from '@/components/ui/PortalTooltip'

export const FileUploadHistoryTableColumns = [
    {
        accessorKey: 'sp_id',
        header: 'SPID',
        enableClickToCopy : true,
    },
    {
        accessorKey: 'alias',
        header: '요금제',
    },
    // {
    //     accessorKey: 'isAllUploaded',
    //     header: '파일 업로드 상태',
    //     Cell: ({ cell, row }) => {
    //         const isAllUploaded = cell.getValue();
    //         const uploadStatus = row.original.uploadStatus;
    //
    //         if (!uploadStatus) {
    //             return <span className="text-gray-400">-</span>;
    //         }
    //
    //         const cdrStatus = uploadStatus.find((f) => f.fileType.includes('CDR'));
    //         const networkReportStatus = uploadStatus.find((f) => f.fileType.includes('NetworkReport'));
    //
    //         return (
    //             <Tooltip
    //                 placement="top"
    //                 arrow
    //                 title={
    //                     <div className="text-xs space-y-1 w-full">
    //                         {uploadStatus.map(({ fileType, isUploaded }) => (
    //                             <div
    //                                 key={fileType}
    //                                 className="grid grid-cols-2 gap-2 items-center py-1 text-sm whitespace-nowrap"
    //                             >
    //                                 <span className="col-span-1">{fileType}:</span>
    //                                 <span className="col-span-1">{isUploaded ? '✅ Uploaded' : '❌ Not uploaded'}</span>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 }
    //             >
    //                 <div className="flex flex-row cursor-pointer text-center justify-evenly">
    //                     <span>
    //                         CDR {cdrStatus?.isUploaded ? '✅' : '❌'}
    //                     </span>
    //                     <span>
    //                         NN {networkReportStatus?.isUploaded ? '✅' : '❌'}
    //                     </span>
    //                 </div>
    //             </Tooltip>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'isAllUploaded',
    //     header: '파일 업로드 상태',
    //     Cell: ({ row }) => {
    //         const uploadStatus = row.original.uploadStatus;
    //
    //         if (!uploadStatus) {
    //             return <span className="text-gray-400">-</span>;
    //         }
    //
    //         const renderStatusWithPopup = (status, label) => {
    //             if (!status) return null;
    //
    //             return (
    //                 <div className="relative group cursor-pointer z-100">
    //                     <span className="text-sm whitespace-nowrap px-1 py-0.5 rounded">
    //                         {label} {status.isUploaded ? '✅' : '❌'}
    //                     </span>
    //                     {status.isUploaded && (
    //                         <div className="absolute left-0 top-full mt-1 w-72 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-500 z-100">
    //                             <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
    //                                 <p className="font-semibold text-gray-900 truncate">
    //                                 {status.fileType}
    //                                 </p>
    //                             </div>
    //                             <div className="p-3 break-words whitespace-nowrap">
    //                                 <p>
    //                                     <strong>Update Date:</strong>{' '}
    //                                     {new Date(status.file_update_date).toLocaleString()}
    //                                 </p>
    //                                 <p>
    //                                     <strong>User ID:</strong> {status.file_user_id}
    //                                 </p>
    //                                 <p>
    //                                     <strong>File Size:</strong> {status.file_size} bytes
    //                                 </p>
    //                             </div>
    //                         </div>
    //                     )}
    //                 </div>
    //             );
    //         };
    //
    //         const cdrStatus = uploadStatus.find((f) => f.fileType.includes('CDR'));
    //         const networkReportStatus = uploadStatus.find((f) => f.fileType.includes('NetworkReport'));
    //
    //         return (
    //             <div className="flex flex-row justify-evenly">
    //                 {renderStatusWithPopup(cdrStatus, 'CDR')}
    //                 {renderStatusWithPopup(networkReportStatus, 'NN')}
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'isAllUploaded',
    //     header: '파일 업로드 상태',
    //     Cell: ({ row }) => {
    //         const uploadStatus = row.original.uploadStatus;
    //
    //         if (!uploadStatus) {
    //             return <span className="text-gray-400">-</span>;
    //         }
    //
    //         const renderPopupContent = (status) => (
    //             <div>
    //                 <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
    //                     <p className="font-semibold text-gray-900 truncate">
    //                         {status.fileType}
    //                     </p>
    //                 </div>
    //                 <div className="p-3 break-words whitespace-nowrap">
    //                     <p>
    //                         <strong>Update Date:</strong>{' '}
    //                         {new Date(status.file_update_date).toLocaleString()}
    //                     </p>
    //                     <p>
    //                         <strong>User ID:</strong> {status.file_user_id}
    //                     </p>
    //                     <p>
    //                         <strong>File Size:</strong> {status.file_size} bytes
    //                     </p>
    //                 </div>
    //             </div>
    //         );
    //
    //         const cdrStatus = uploadStatus.find((f) => f.fileType.includes('CDR'));
    //         const networkReportStatus = uploadStatus.find((f) =>
    //             f.fileType.includes('NetworkReport')
    //         );
    //
    //         return (
    //             <div className="flex flex-row justify-evenly">
    //                 {cdrStatus && (
    //                     cdrStatus.isUploaded ? (
    //                         <PortalTooltip content={renderPopupContent(cdrStatus)}>
    //                         <span className="text-sm whitespace-nowrap px-1 py-0.5 rounded cursor-pointer">
    //                             CDR ✅
    //                         </span>
    //                         </PortalTooltip>
    //                     ) : (
    //                         <span className="text-sm whitespace-nowrap px-1 py-0.5 rounded">
    //                         CDR ❌
    //                     </span>
    //                     )
    //                 )}
    //                 {networkReportStatus && (
    //                     networkReportStatus.isUploaded ? (
    //                         <PortalTooltip content={renderPopupContent(networkReportStatus)}>
    //                         <span className="text-sm whitespace-nowrap px-1 py-0.5 rounded cursor-pointer">
    //                             NN ✅
    //                         </span>
    //                         </PortalTooltip>
    //                     ) : (
    //                         <span className="text-sm whitespace-nowrap px-1 py-0.5 rounded">
    //                         NN ❌
    //                     </span>
    //                     )
    //                 )}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: 'isAllUploaded',
        header: '파일 업로드 상태',
        Cell: ({ cell, row }) => {
            const uploadStatus = row.original.uploadStatus;

            if (!uploadStatus) {
                return <span className="text-gray-400">-</span>;
            }

            const renderPopupContent = (status) => (
                <div className="text-xs space-y-1">
                    <div className="font-semibold border-b pb-1">
                        {status.fileType}
                    </div>
                    <div>
                        <strong>Update Date: </strong>
                        {status.file_update_date
                            ? new Date(status.file_update_date).toLocaleString()
                            : '-'}
                    </div>
                    <div>
                        <strong>User ID: </strong>
                        {status.file_user_id || '-'}
                    </div>
                    <div>
                        <strong>File Size: </strong>
                        {status.file_size ? `${status.file_size} bytes` : '-'}
                    </div>
                </div>
            );

            const cdrStatus = uploadStatus.find((f) => f.fileType.includes('CDR'));
            const networkReportStatus = uploadStatus.find((f) =>
                f.fileType.includes('NetworkReport')
            );

            return (
                <div className="flex flex-row justify-evenly">
                    {cdrStatus && (
                        <Tooltip
                            placement="top"
                            arrow
                            title={cdrStatus.isUploaded ? renderPopupContent(cdrStatus) : '업로드되지 않았습니다.'}
                        >
                        <span className="text-sm cursor-pointer whitespace-nowrap px-1 py-0.5 rounded">
                            CDR {cdrStatus.isUploaded ? '✅' : '❌'}
                        </span>
                        </Tooltip>
                    )}
                    {networkReportStatus && (
                        <Tooltip
                            placement="top"
                            arrow
                            title={networkReportStatus.isUploaded ? renderPopupContent(networkReportStatus) : '업로드되지 않았습니다.'}
                        >
                        <span className="text-sm cursor-pointer whitespace-nowrap px-1 py-0.5 rounded">
                            NN {networkReportStatus.isUploaded ? '✅' : '❌'}
                        </span>
                        </Tooltip>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'active_index',
        header: '활성화 날짜',
        Cell: YearMonthCell_Type,
    },
    {
        accessorKey: 'deactive_index',
        header: '비활성화 날짜',
        Cell: YearMonthCell_Type,
    },
    {
        accessorKey: 'use_yn',
        header: '사용 여부',
        Cell: FormatUseYnToggle,
        // Cell: UseYorNCell_Type,
    },
    {
        accessorKey: 'update_date',
        header: '업데이트 날짜',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
    {
        accessorKey: 'update_user_id',
        header: '업데이트 계정',
    },
    {
        accessorKey: 'regist_date',
        header: '등록 날짜',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
    {
        accessorKey: 'regist_user_id',
        header: '등록 계정',
    },
    // {
    //     accessorKey: 'uploadStatus',
    //     header: 'Upload Status',
    //     Cell: ({ cell }) => {
    //         const statuses = cell.getValue();
    //         return statuses.map(({ fileType, isUploaded }) => (
    //             <div key={fileType} className="flex items-center space-x-1">
    //                 <span>{fileType}</span>
    //                 <span>{isUploaded ? '✅' : '❌'}</span>
    //             </div>
    //         ));
    //     },
    // },
    // {
    //     accessorKey: 'isAllUploaded',
    //     header: 'All Uploaded',
    //     Cell: ({ cell }) => (cell.getValue() ? '✅' : '❌'),
    // }
];