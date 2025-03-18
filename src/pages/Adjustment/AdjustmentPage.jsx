import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchAdjustment, fetchAdjustmentPart, deleteAdjustment, fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import AdjustmentPartForm from '@/components/form/AdjustmentPartForm.jsx';
import Tooltip from '@/components/common/Tooltip.jsx';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import { IoIosArrowDown } from 'react-icons/io';

const AdjustmentPage = () => {
    const { data: adjustmentData, loading: adjustmentLoading, error: adjustmentError, refetch: adjustmentRefetch } = useApiFetch(fetchAdjustment);
    const [selectedAdjustId, setSelectedAdjustId] = useState(null);
    const [isAdjustExpanded, setIsAdjustExpanded] = useState(false); // Drawer 확장
    const [isOpenNewDropdown, setIsOpenNewDropdown] = useState(false); // New icon Drop
    const navigate = useNavigate();

    // 부분 데이터 상태
    const [adjustPartData, setAdjustPartData] = useState(null);
    const [adjustPartLoading, setAdjustPartLoading] = useState(false);
    const [adjustPartError, setAdjustPartError] = useState(null);

    // 이력 데이터 상태
    const [adjustHistoryData, setAdjustHistoryData] = useState(null);
    const [adjustHistoryLoading, setAdjustHistoryLoading] = useState(false);
    const [adjustHistoryError, setAdjustHistoryError] = useState(null);


    useEffect(()=> {
        const fetchParticular = async () => {
            if(!selectedAdjustId) return;

            // 조정 데이터 가져오기
            setAdjustPartLoading(true);
            setAdjustPartError(null);
            try {
                const adjustResponse = await fetchAdjustmentPart(selectedAdjustId.adjustment_index);
                setAdjustPartData(adjustResponse);
            } catch (error) {
                setAdjustPartError(error.message || 'Failed to fetch account details');
            } finally {
                setAdjustPartLoading(false);
            }

            // 조정 데이터 가져오기
            setAdjustHistoryLoading(true);
            setAdjustHistoryError(null);
            try {
                const adjustResponse = await fetchAdjustmentValueHistory(selectedAdjustId.adjustment_code_value);
                setAdjustHistoryData(adjustResponse);
            } catch (error) {
                setAdjustHistoryError(error.message || 'Failed to fetch account details');
            } finally {
                setAdjustHistoryLoading(false);
            }
        }

        fetchParticular();
    }, [selectedAdjustId]);

    const handleDeleteSuccess = () => {
        adjustmentRefetch();
        setSelectedAdjustId(null);
        setIsAdjustExpanded(false);
    }

    // New Button Toggle
    const toggleNewDropdown = () => setIsOpenNewDropdown(!isOpenNewDropdown);
    const closeNewDropdown = () => setIsOpenNewDropdown(false);

    const OverviewTab = () => {
        return(
            <div>
                {adjustPartLoading ? (
                    <LoadingSpinner/>
                ) : adjustPartError ? (
                    <p className="text-red-500">Error loading history: {adjustPartError}</p>
                ) : adjustPartData ? (
                    <AdjustmentPartForm adjustPartData={adjustPartData}/>
                ) : (
                    <p>Select an price to view details</p>
                )}
            </div>
        )
    }
    const HistoryTab = () => {
        return(
            <div>
                {adjustHistoryLoading ? (
                    <LoadingSpinner/>
                ) : adjustHistoryError ? (
                    <p className="text-red-500">Error loading history: {adjustHistoryError}</p>
                ) : adjustHistoryData ? (
                    <ReusableTable
                        data={adjustHistoryData}
                        columns={AdjustmentHistoryTableColumns}
                        options={AdjustmentHistoryTableOptions}
                    />
                ) : (
                    <p>Select an price to view details</p>
                )}
            </div>
        )
    }
    const tabs = [
        { id: 1, label: 'Overview', content: <OverviewTab/>},
        { id: 2, label: 'History', content: <HistoryTab /> },
    ];


    return(
        <div className={`grid gap-0 ${isAdjustExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">조정 내역 관리</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isAdjustExpanded ? 'col-span-2' : 'col-span-6'}`}>
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">할인, 가산 요금 등 조정 내역 삽입, 수정, 삭제</h1>
                    <div className="flex space-x-2 items-center">
                        <div className="inline-flex rounded-md shadow-xs" role="group">
                            <Tooltip message="Create Price Plan">
                                <button type="button"
                                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-white font-medium bg-blue-500 border border-gray-200 rounded-s-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                        onClick={() => navigate('/adjustment/new')}
                                >
                                    <FiPlus />
                                    <span>New</span>
                                </button>
                            </Tooltip>
                            <button type="button"
                                    className="inline-flex items-center px-1 py-2 text-sm font-medium text-white bg-blue-500 border border-gray-200 rounded-e-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                    onClick={toggleNewDropdown}
                            >
                                <IoIosArrowDown />
                            </button>
                            {isOpenNewDropdown && (
                                <div
                                    className="absolute z-10 mt-10 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                                    onMouseLeave={closeNewDropdown}>
                                    <div className="p-2 text-sm text-gray-700">
                                        <button onClick={() => navigate('/adjustmenr/new')}
                                                className="block px-4 py-2 text-start w-full hover:bg-blue-500 hover:text-white rounded-md transition">
                                            조정
                                        </button>
                                    </div>
                                    <ul className="p-2 text-sm text-gray-700">
                                        <li>
                                            <button onClick={() => navigate('/code/new')}
                                                    className="block px-4 py-2 text-start w-full hover:bg-blue-500 hover:text-white rounded-md transition">조정 세부 정의
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={AdjustmentTableColumns}
                    data={adjustmentData || []}
                    options={{
                        ...AdjustmentTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id: ', selectedRow);

                                if (selectedAdjustId && selectedAdjustId.adjustment_index === selectedRow.adjustment_index) {
                                    setSelectedAdjustId(null);
                                    setIsAdjustExpanded(false);
                                } else {
                                    setSelectedAdjustId(selectedRow);
                                    setIsAdjustExpanded(true);
                                }
                            },
                        },
                    }}
                    error={adjustmentError}
                    isLoading={adjustmentLoading}
                />
            </div>

            {/* Right Section */}
            {isAdjustExpanded && selectedAdjustId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <span className="pr-2 font-bold">Adjustment Index : </span>
                                <h2 className="py-1 text-lg font-bold text-red-600">{selectedAdjustId.adjustment_index}</h2>
                            </div>


                            <ButtonGroup
                                entityType="adjustment"
                                id={selectedAdjustId.adjustment_index}
                                deleteFunction={deleteAdjustment}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        <TabComponent tabs={tabs} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdjustmentPage;