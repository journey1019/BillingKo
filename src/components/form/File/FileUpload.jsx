import { fetchUploadHistoryAllFiles, fetchUploadFileMonthly } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { FileUploadHistoryTableColumns } from '@/columns/FileUploadHistoryTableColumns.jsx';
import { FileUploadTableOptions } from '@/options/FileUploadTableOptions.jsx';

const FileUpload = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: uploadHistoryAllData, loading: uploadHistoryAllLoading, error: uploadHistoryAllError } = useApiFetch(fetchUploadHistoryAllFiles);
    const { data: uploadMonthlyData, loading: uploadMonthlyLoading, error: uploadMonthlyError } = useApiFetch(fetchUploadFileMonthly, '202412');

    // 조건을 만족하는 데이터 필터링
    const filteredData = uploadHistoryAllData?.filter(item => {
        if (item.use_yn !== 'Y') return false; // use_yn이 'Y'인 데이터만 포함

        const activeIndex = Number(item.active_index); // 활성화 시작일
        const deactiveIndex = item.deactive_index ? Number(item.deactive_index) : Infinity; // 비활성화일이 없으면 무한대 처리

        const currentYearMonth = Number(yearMonth); // 현재 선택된 연월

        return activeIndex <= currentYearMonth && currentYearMonth <= deactiveIndex;
    }) || [];
    console.log('filteredData : ', filteredData)


    // 숫자 부분 추출 후 중복 제거하여 배열로 변환
    const uniqueFileSPID = Array.from(
        new Set(uploadMonthlyData?.map(item => item.file_name.split('_')[0])) // `_` 앞의 숫자 추출 후 Set으로 중복 제거
    );
    console.log(uniqueFileSPID);

    // 조건을 만족하는 새로운 배열 생성 (use_yn === 'Y' && sp_id가 uniqueFileSPID에 포함)
    const filteredUploadHistoryData = uploadHistoryAllData?.filter(
        (item) => item.use_yn === 'Y' && uniqueFileSPID.includes(item.sp_id)
    ) || [];
    // `use_yn === 'N'`인 행을 제거
    const filteredUseData = uploadHistoryAllData?.filter(item => item.use_yn !== 'N') || [];
    console.log('filteredUploadHistoryData : ', filteredUploadHistoryData)
    console.log('filteredUseData : ', filteredUseData)

    console.log('uploadHistoryAllData : ', uploadHistoryAllData)
    console.log('uploadMonthlyData : ', uploadMonthlyData)

    return(
        <div className="grid gap-0 ">
            <ReusableTable
                data={uploadHistoryAllData || []}
                columns={FileUploadHistoryTableColumns}
                isLoading={uploadHistoryAllLoading}
                error={uploadHistoryAllError}
                options={{
                    ...FileUploadTableOptions,
                    meta: {
                        onRowSelect: (selectedRow) => {
                            console.log(selectedRow)
                        }
                    }
                }}
            />
        </div>
    )
}


export default FileUpload;