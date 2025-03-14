import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { CDRTableColumns } from '@/columns/CDRTableColumns.jsx';
import { CDRTableOptions } from '@/options/CDRTableOptions.jsx';
import { NetworkReportTableColumns } from '@/columns/NetworkReportTableColumns.jsx';
import { NetworkReportTableOptions } from '@/options/NetworkReportTableOptions.jsx';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchCDRFileUpdate, fetchNetworkReportFileUpdate } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';

const CDRnNN = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: cdrData, loading: cdrLoading, error: cdrError, refetch: cdrRefetch } = useApiFetch(fetchCDRFileUpdate, yearMonth);
    const { data: nrData, loading: nrLoading, error: nrError, refetch: nrRefetch } = useApiFetch(fetchNetworkReportFileUpdate, yearMonth);


    return(
        <div className="grid col-span-4 2xl:col-span-3 space-y-3 py-6">
            <div className="flex flex-row items-center justify-between border-b pb-4 border-gray-400">
                <h1 className="text-xl font-bold">CDR & Network Report 원본 테이블</h1>
                {/*<h1 className="text-lg font-bold">*/}
                {/*    Selected Month:{' '}*/}
                {/*    {selectedDate.toLocaleDateString('en-US', {*/}
                {/*        year: 'numeric',*/}
                {/*        month: 'long',*/}
                {/*    })}*/}
                {/*</h1>*/}
                <div className="flex flex-row z-10">
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                </div>
            </div>

            <h1 className="text-xl font-semibold">CDR Table</h1>
            {/* CDR Table */}
            {/* 로딩 상태 */}
            <ReusableTable
                data={cdrData || []}  // 데이터가 없으면 빈 배열 전달
                columns={CDRTableColumns}
                options={{
                    ...CDRTableOptions,
                }}
                isLoading={cdrLoading}
                error={cdrError}
            />

            <h1 className="text-xl font-semibold">Network Report Table</h1>
            <ReusableTable
                data={nrData || []}  // 데이터가 없으면 빈 배열 전달
                columns={NetworkReportTableColumns}
                options={{
                    ...NetworkReportTableOptions,
                }}
                isLoading={nrLoading}
                error={nrError}
            />
        </div>
    )
}

export default CDRnNN;