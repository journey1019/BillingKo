import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchCDRFileUpdate, fetchNetworkReportFileUpdate } from '@/service/fileService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import { FileUpdateTableColumns } from '@/columns/FileUpdateTableColumns.jsx';
import { FileTableOptions } from '@/options/FileTableOptions.jsx';
import { CDRTableColumns } from '@/columns/CDRTableColumns.jsx';
import { CDRTableOptions } from '@/options/CDRTableOptions.jsx';
import { NetworkReportTableColumns } from '@/columns/NetworkReportTableColumns.jsx';
import { NetworkReportTableOptions } from '@/options/NetworkReportTableOptions.jsx';
import FileStatusForm from '@/components/form/FileStatusForm.jsx'
import Modal from '@/components/common/Modal.jsx';
import UploadFileModal from '@/components/layout/File/UploadFileModal.jsx';
import FileDeviceForm from '@/components/form/FileDeviceForm.jsx';
import FileUpload from '@/components/form/File/FileUpload.jsx';
import FileUploadStatus from '@/components/form/File/FileUploadStatue.jsx';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import CDRnNN from '@/components/features/CDRnNN.jsx';

const FilePage = () => {
    const navigate = useNavigate();

    // 기본값: 현재 날짜 기준 한 달 전
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [selectedDate, setSelectedDate] = useState(oneMonthAgo);
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "") // YYYYMM 형식

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const { data: cdrData, loading: cdrLoading, error: cdrError, refetch: cdrRefetch } = useApiFetch(fetchCDRFileUpdate, yearMonth);
    const { data: nrData, loading: nrLoading, error: nrError, refetch: nrRefetch } = useApiFetch(fetchNetworkReportFileUpdate, yearMonth);


    // file update history data
    // const [fileHistory, setFileHistory] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');
    //
    // useEffect(() => {
    //     const getFileHistory = async () => {
    //         try {
    //             const data = await fetchFileUpdateHistory();
    //             setFileHistory(data);
    //         } catch (err) {
    //             setError('파일 이력을 가져오는 중 오류가 발생했습니다.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     getFileHistory();
    // }, []);

    return(
        <div className="grid grid-cols-4 2xl:grid-cols-3">

            {/* File Uploaded Table */}
            {/*<div className="grid col-span-1">*/}
            {/*    <h1 className="py-1 text-lg font-bold">File Updated History</h1>*/}
            {/*    <ReusableTable*/}
            {/*        data={fileHistoryData || []}*/}
            {/*        columns={FileUpdateTableColumns}*/}
            {/*        options={{*/}
            {/*            ...FileTableOptions,*/}
            {/*        }}*/}
            {/*        isLoading={fileHistoryLoading}*/}
            {/*        error={fileHistoryError}*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="grid col-span-2 2xl:col-span-1">
                <FileStatusForm />
            </div>
            <div className="grid col-span-2 2xl:col-span-1">
                <FileUploadStatus />
            </div>

            <div className="grid col-span-4 py-5">
                <FileUpload />
            </div>
            {/*<div className="grid col-span-2 2xl:col-span-1">*/}
            {/*    <FileDeviceForm/>*/}
            {/*</div>*/}


            {/* 'CDR' & 'Network Report' Table */}
            <CDRnNN />
        </div>
    )
}

export default FilePage;