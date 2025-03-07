import { useEffect, useState } from "react";
import {
    fetchKOMonthlyData,
    fetchKOMonthlyDetailIndexData,
    fetchKOMonthlyDetailVersionIndexData,
} from "@/service/monthlyService.js";
import useApiFetch from "@/hooks/useApiFetch.js";
import ReusableTable from "@/components/table/ReusableTable.jsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import { MonthlyTableColumns } from "@/columns/MonthlyTableColumns.jsx";
import MonthPicker from "@/components/time/MonthPicker.jsx";
import { KOMonthlyTableOptions } from "@/options/KOMonthlyTableOptions.jsx";
import KOMonthlyForm from "@/components/form/Monthly/KOMonthlyForm.jsx";
import { MdModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import useYearMonth from '@/hooks/useYearMonth.js';

/**
 * @desc: 단말별 데이터 페이지
 * */
const KOMonthlyPage = () => {
    const navigate = useNavigate();
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();


    const { data, loading, error } = useApiFetch(fetchKOMonthlyData, yearMonth);
    const [selectedMonthlyIndex, setSelectedMonthlyIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Detail Data
    const [version, setVersion] = useState(0);
    const [latestVersion, setLatestVersion] = useState(0); // 최신 버전 저장

    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    // Detail Version Data
    const [detailVersionData, setDetailVersionData] = useState(null);
    const [detailVersionLoading, setDetailVersionLoading] = useState(false);
    const [detailVersionError, setDetailVersionError] = useState(null);


    useEffect(() => {
        const fetchMonthlyDetail = async () => {
            if (!selectedMonthlyIndex) return;

            setDetailLoading(true);
            setDetailError(null);
            try {
                const response = await fetchKOMonthlyDetailIndexData(selectedMonthlyIndex.data_index);
                setDetailData(response);
                setVersion(response.update_version || 0);
                setLatestVersion(response.update_version || 0); // 최신 버전 저장
            } catch (error) {
                setDetailError(error.message || "Failed to fetch detail data");
            } finally {
                setDetailLoading(false);
            }
        };

        fetchMonthlyDetail();
    }, [selectedMonthlyIndex]);

    const fetchVersionData = async (serial_number, version_index) => {
        setDetailVersionLoading(true);
        setDetailVersionError(null);
        try {
            const response = await fetchKOMonthlyDetailVersionIndexData(serial_number, version_index);
            setDetailVersionData(response);
            setVersion(version_index);
        } catch (error) {
            setDetailVersionError(error.message || "Failed to fetch version detail data");
        } finally {
            setDetailVersionLoading(false);
        }
    };

    console.log(detailData)
    useEffect(() => {
        console.log("Fetched Data:", data);
    }, [data]); // ✅ data가 변경될 때마다 실행
    console.log(selectedMonthlyIndex)

    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">KO Monthly Data</h1>
            </div>

            <div className={`p-2 ${isExpanded ? "col-span-2" : "col-span-6"}`}>
                <div>
                    <div className="flex flex-row items-center justify-between mb-3 relative z-10">
                        <h1 className="text-lg font-bold">
                            Selected Month:{" "}
                            {selectedDate.toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "short", // '1월' 대신 '01월'을 원하면 "2-digit" 사용
                            })}
                            {/*{selectedDate.toLocaleDateString("en-US", {*/}
                            {/*    year: "numeric",*/}
                            {/*    month: "long",*/}
                            {/*})}*/}
                        </h1>
                        <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ReusableTable
                            data={data || []}
                            exportFileName="KO_Monthly_Report"
                            showExportButton={true} // ✅ 이 테이블에서는 CSV 버튼 활성화
                            columns={[{ accessorKey: "data_index", header: "Data Index" }, ...MonthlyTableColumns]}
                            options={{
                                ...KOMonthlyTableOptions,
                                meta: {
                                    onRowSelect: (selectedRow) => {
                                        if (selectedMonthlyIndex?.data_index === selectedRow.data_index) {
                                            setSelectedMonthlyIndex(null);
                                            setIsExpanded(false);
                                        } else {
                                            setSelectedMonthlyIndex(selectedRow);
                                            setIsExpanded(true);
                                        }
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            </div>

            {isExpanded && selectedMonthlyIndex && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <span className="text-black font-semibold pr-3">Data Index:</span>
                                <h2 className="py-1 text-lg font-bold text-red-600">{selectedMonthlyIndex.data_index}</h2>
                            </div>
                            <button type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                                    onClick={() => navigate(`/ko_monthly/edit`, {state: {detailData: detailData} })}
                            >
                                <MdModeEditOutline className="mr-3" />
                                Edit
                            </button>
                        </div>
                        <div>
                            {detailLoading || detailVersionLoading ? (
                                <LoadingSpinner />
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailError}</p>
                            ) : (
                                <KOMonthlyForm
                                    detailData={detailVersionData || detailData}
                                    version={version}
                                    latestVersion={latestVersion}
                                    setVersion={setVersion}
                                    fetchVersionData={fetchVersionData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KOMonthlyPage;
