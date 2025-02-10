import { useEffect, useState } from 'react';
import { fetchKOMonthlyData, fetchKOMonthlyDetailIndexData } from '@/service/monthlyService.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { MonthlyTableColumns } from '@/columns/MonthlyTableColumns.jsx';
import { MonthlyTableOptions } from '@/options/MonthlyTableOptions.jsx';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import { KOMonthlyTableOptions } from '@/options/KOMonthlyTableOptions.jsx';

const KOMonthlyPage = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [selectedDate, setSelectedDate] = useState(oneMonthAgo);
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "") // YYYYMM 형식

    const { data, loading, error, fetch } = useApiFetch(fetchKOMonthlyData, yearMonth);
    const [selectedMonthlyIndex, setSelectedMonthlyIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장

    // Detail Data
    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // data_index Column 추가
    const dynamicColumns = [
        {
            accessorKey: 'data_index',
            header: 'Data Index',
        }
    ]
    const combinedColumns = [...dynamicColumns, ...MonthlyTableColumns];

    useEffect(() => {
        const fetchMonthlyDetail = async () => {
            if(!selectedMonthlyIndex) return; // 선택된 값이 없다면 호출 X

            setDetailLoading(true);
            setDetailError(null);
            try {
                const response = await fetchKOMonthlyDetailIndexData(selectedMonthlyIndex.data_index);
                setDetailData(response);
            } catch (error) {
                setDetailError(error.message || 'Failed to fetch detail data');
            } finally {
                setDetailLoading(false);
            }
        }
        fetchMonthlyDetail();
    }, [selectedMonthlyIndex])

    console.log(detailData)


    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">KO Monthly Data</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                <div>
                    <div className="flex flex-row items-center justify-between mb-3">
                        <h1 className="text-lg font-bold">
                            Selected Month:{" "}
                            {selectedDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                            })}
                        </h1>
                        <div className="flex flex-row z-10">
                            <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                        </div>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                        ) :
                            <ReusableTable
                                data={data}
                                columns={combinedColumns}
                                options={{
                                    ...KOMonthlyTableOptions,
                                    meta: {
                                        onRowSelect: (selectedRow) => {
                                            console.log('onRowSelect called with id:', selectedRow);

                                            if(selectedMonthlyIndex && selectedMonthlyIndex.data_index === selectedRow.data_index) {
                                                setSelectedMonthlyIndex(null);
                                                setIsExpanded(false);
                                            } else {
                                                setSelectedMonthlyIndex(selectedRow);
                                                setIsExpanded(true);
                                            }
                                        }
                                    },
                            }}
                            />
                    }
                </div>
            </div>

            {isExpanded && selectedMonthlyIndex && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        {/* Handle */}
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <span className="text-black font-semibold pr-3">Data Index:</span><h2 className="py-1 text-lg font-bold text-red-600">{selectedMonthlyIndex.data_index}</h2>
                            </div>
                        </div>
                        <div>
                            {detailLoading ? (
                                <LoadingSpinner/>
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailLoading}</p>
                            ): (
                                <ReusableTable
                                    data={detailData ? [detailData] : []}
                                    columns={combinedColumns}
                                    options={{
                                        ...MonthlyTableOptions
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}




        </div>
    )
}

export default KOMonthlyPage;