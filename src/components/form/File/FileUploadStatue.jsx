import { fetchUploadHistoryAllFiles, fetchUploadFileMonthly } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import { MdEdit } from "react-icons/md";


const FileUploadStatus = () => {
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
    console.log('uploadMonthlyData : ', uploadMonthlyData)

    return(
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">File Upload Status for</h2>
                    <h2 className="text-xl font-bold text-gray-700">{selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    })}</h2>
                </div>
                <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
            </div>

            <div>
                <div className="flex flex-row justify-between pb-2">
                    <h3 className="text-base font-semibold text-blue-600">List of files to upload</h3>
                    <button className="p-1 border-2 border-gray-800 rounded-md hover:bg-gray-200"
                            onClick={() => console.log('service provider 수정 페이지로 이동')}><MdEdit/>
                    </button>
                </div>
                <div className="">
                    {filteredData?.map((uploadData) => (
                        <div className="flex flex-row bg-gray-300 rounded-md p-2 text-sm mb-2 justify-between">
                            <div className="grid grid-cols-2 space-x-4">
                                <span className="col-span-1">{uploadData.alias}</span>
                                <span className="col-span-1">{uploadData.sp_id}</span>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="space-x-4"><span>CDR</span> ✅</div>
                                <div className="space-x-4"><span>Network Report</span> ☑️</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default FileUploadStatus;