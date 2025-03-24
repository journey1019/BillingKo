import { useEffect, useState, useMemo } from "react";
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
import DeviceMonthlyFormBefo from "@/components/form/Monthly/DeviceMonthlyFormBefo.jsx";
import { MdModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import DeviceMonthlyForm from '@/components/form/Monthly/DeviceMonthlyForm.jsx';
import { useSearchParams } from "react-router-dom";
import { IoMdClose } from 'react-icons/io';


/**
 * @desc: 단말기별 청구서 수정 페이지
 * */
const KOMonthlyPage = () => {
    const [searchParams] = useSearchParams();

    const urlYearMonth = searchParams.get("yearMonth"); // ex) '202402'
    const urlSerial = searchParams.get("serial");

    // '고객별 청구' 페이지에서 단말기 상세 정보 보려고 할때
    // 필터 초기값 구성
    const [columnFilters, setColumnFilters] = useState(() => {
        return urlSerial
            ? [{ id: "serial_number", value: urlSerial }]
            : [];
    });

    const initialDate = useMemo(() => {
        if (!urlYearMonth || urlYearMonth.length !== 6) return null;
        const year = Number(urlYearMonth.slice(0, 4));
        const month = Number(urlYearMonth.slice(4, 6)) - 1;
        return new Date(year, month);
    }, [urlYearMonth]);


    /** API 데이터 호출 */
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth(initialDate);
    const [selectedMonthlyIndex, setSelectedMonthlyIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const { data, loading, error } = useApiFetch(fetchKOMonthlyData, yearMonth);

    // Detail Data
    const [version, setVersion] = useState(0);
    const [latestVersion, setLatestVersion] = useState(0); // 최신 버전 저장

    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    // Detail Version Data
    const [detailVersionData, setDetailVersionData] = useState(null);
    const [detailVersionLoading, setDetailVersionLoading] = useState(false);
    const [detailVersionError, setDetailVersionError] = useState(null)

    // 선택이 바뀔 때 상세 기본 데이터
    useEffect(() => {
        if (!selectedMonthlyIndex) return;
        fetchDetailData(selectedMonthlyIndex.data_index);
    }, [selectedMonthlyIndex]);

    // 선택된 data_index에 대한 detail fetch 함수
    const fetchDetailData = async (dataIndex) => {
        if (!dataIndex) return;
        setDetailLoading(true);
        setDetailError(null);
        try {
            const response = await fetchKOMonthlyDetailIndexData(dataIndex + `?ts=${Date.now()}`);
            setDetailData(response);
            setVersion(response.update_version || 0);
            setLatestVersion(response.update_version || 0);
        } catch (error) {
            setDetailError(error.message || "Failed to fetch detail data");
        } finally {
            setDetailLoading(false);
        }
    };

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

    console.log('detailData: ', detailData)
    console.log(selectedMonthlyIndex)

    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-xl font-base font-bold">단말기별 청구서 수정 및 저장 페이지</h1>
            </div>

            <div className={`p-2 ${isExpanded ? "col-span-2" : "col-span-6"}`}>
                <div>
                    <div className="flex flex-row items-center justify-between mb-3 relative z-10">
                        <h1 className="text-xl font-bold">단말기 청구서 테이블</h1>
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
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
                            columns={[{ accessorKey: "data_index", header: "Data Index", enableHiding: true }, ...MonthlyTableColumns]}
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
                                // ✅ 필터 상태 연결
                                state: {
                                    columnFilters,
                                },
                                onColumnFiltersChange: setColumnFilters,
                            }}
                        />
                    )}
                </div>
            </div>

            {isExpanded && selectedMonthlyIndex && (
                <div className="px-2 py-4 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row items-center">
                                <h1 className="text-xl font-bold text-gray-700 align-center text-center justify-center">{selectedMonthlyIndex.acct_num} _ {selectedMonthlyIndex.serial_number}</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSelectedMonthlyIndex(null);
                                }}
                                className="p-2 rounded-md text-black hover:text-gray-500"
                            >
                                <IoMdClose />
                            </button>
                        </div>
                        <div>
                            {detailLoading || detailVersionLoading ? (
                                <LoadingSpinner />
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailError}</p>
                            ) : (
                                <>
                                    <DeviceMonthlyForm
                                        detailData={detailVersionData || detailData}
                                        version={version}
                                        latestVersion={latestVersion}
                                        setVersion={setVersion}
                                        fetchVersionData={fetchVersionData}
                                        fetchDetailData={fetchDetailData}
                                        originalSerialNumber={selectedMonthlyIndex.monthly_primary_key}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KOMonthlyPage;
