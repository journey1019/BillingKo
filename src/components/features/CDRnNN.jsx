import { useLocation, useNavigate } from "react-router-dom";

import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { CDRTableColumns } from '@/columns/CDRTableColumns.jsx';
import { CDRTableOptions } from '@/options/CDRTableOptions.jsx';
import { NetworkReportTableColumns } from '@/columns/NetworkReportTableColumns.jsx';
import { NetworkReportTableOptions } from '@/options/NetworkReportTableOptions.jsx';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchCDRCostCalc, fetchCDRFileUpdate, fetchNetworkReportFileUpdate } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import { FaExpand } from "react-icons/fa";
import Accordion from '@/components/ui/Accordions/Accordion.jsx';
import { CostTableOptions } from '../../options/CostTableOptions.jsx';
import { CostTableColumns } from '../../columns/CostTableColumns.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import CostSummaryForm from '../form/File/CostSummaryForm.jsx';


const CDRnNN = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: costData, loading: costLoading, error: costError, refetch: costRefetch } = useApiFetch(fetchCDRCostCalc, yearMonth);
    const { data: cdrData, loading: cdrLoading, error: cdrError, refetch: cdrRefetch } = useApiFetch(fetchCDRFileUpdate, yearMonth);
    const { data: nrData, loading: nrLoading, error: nrError, refetch: nrRefetch } = useApiFetch(fetchNetworkReportFileUpdate, yearMonth);

    // console.log('costData : ', costData)
    // console.log('cdrData : ', cdrData)
    // console.log('nrData : ', nrData)

    return(
        <div className="grid col-span-4 2xl:col-span-3 space-y-3 py-6">
            <div className="flex flex-row items-center justify-between border-b pb-4 border-gray-400">
                <h1 className="text-xl font-bold hover:underline hover:cursor-pointer" onClick={() => navigate('/cdr_nn')}>CDR & Network Report 원본 테이블</h1>
                <div className="flex flex-row z-10 items-center space-x-5">
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                    {/*{location.pathname !== "/cdr_nn" && (*/}
                    {/*    <div className="p-2 rounded-full hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/cdr_nn")}>*/}
                    {/*        <FaExpand className="w-7 h-7" />*/}
                    {/*    </div>*/}
                    {/*)}*/}
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

            <div className="bg-white p-4 rounded-md shadow-md">
                <Accordion items={[
                    {
                        title: 'Invoice Detail',
                        content: (
                            <div className="grid grid-col-1">
                                <div className="mx-4 mb-3 border rounded-t-lg">
                                    <CostSummaryForm summary={costData?.summary || {}}/>
                                </div>
                                {costLoading
                                    ? <LoadingSpinner/>
                                    : costError
                                        ? <p className="px-4 pb-2 text-red-500">No Data</p>
                                        : (
                                            <ReusableTable
                                                data={costData.list_data || []}  // 데이터가 없으면 빈 배열 전달
                                                columns={CostTableColumns}
                                                options={{
                                                    ...CostTableOptions,
                                                }}
                                                isLoading={costLoading}
                                                error={costError}
                                            />
                                        )
                                }
                            </div>
                        )
                    }
                ]}
                />
            </div>

        </div>
    )
}

export default CDRnNN;