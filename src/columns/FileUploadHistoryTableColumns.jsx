import { YearMonthCell_Type, UseYorNCell_Type } from '@/columns/cellStyle/FileUpdateCell.jsx';
import { formatDateTime } from '@/utils/formatHelpers.jsx';
import { FormatUseYnToggle } from './cellStyle/AccountCell.jsx';
import { Tooltip } from '@mui/material'; // ✅ MUI Alert 추가


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
    {
        accessorKey: 'isAllUploaded',
        header: '파일 업로드 상태',
        Cell: ({ cell, row }) => {
            const isAllUploaded = cell.getValue();
            const uploadStatus = row.original.uploadStatus;

            if (!uploadStatus) {
                return <span className="text-gray-400">-</span>;
            }

            const cdrStatus = uploadStatus.find((f) => f.fileType.includes('CDR'));
            const networkReportStatus = uploadStatus.find((f) => f.fileType.includes('NetworkReport'));

            return (
                <Tooltip
                    placement="top"
                    arrow
                    title={
                        <div className="text-xs space-y-1 w-full">
                            {uploadStatus.map(({ fileType, isUploaded }) => (
                                <div
                                    key={fileType}
                                    className="grid grid-cols-2 gap-2 items-center py-1 text-sm whitespace-nowrap"
                                >
                                    <span className="col-span-1">{fileType}:</span>
                                    <span className="col-span-1">{isUploaded ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <div className="flex flex-row cursor-pointer text-center justify-evenly">
                        <span>
                            CDR {cdrStatus?.isUploaded ? '✅' : '❌'}
                        </span>
                        <span>
                            NN {networkReportStatus?.isUploaded ? '✅' : '❌'}
                        </span>
                    </div>
                </Tooltip>
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