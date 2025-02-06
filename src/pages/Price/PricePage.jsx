import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchPrice, deletePrice, fetchPriceHistory, fetchPricePart } from '@/service/priceService.js';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { PriceTableOptions } from '@/options/PriceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import Modal from '@/components/common/Modal.jsx';

import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import PricePartForm from '@/components/form/PricePartForm.jsx';

const PricePage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchPrice);
    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, ssetHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 부분 단말 데이터 상태
    const [pricePartData, setPricePartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // Modal
    const [showModal, setShowModal] = useState(false);

    // 선택된 ppid 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchParticular = async () => {
            if (!selectedPriceId) return;  // 선택된 값이 없으면 호출하지 않음

            // 이력 데이터 가져오기
            ssetHistoryLoading(true);
            setHistoryError(null);
            try {
                const response = await fetchPriceHistory(selectedPriceId.ppid);
                setHistoryData(response);
            } catch (error) {
                setHistoryError(error.message || 'Failed to fetch price particular');
            } finally {
                ssetHistoryLoading(false);
            }

            // 부분 계정 데이터 가져오기
            setPartDataLoading(true);
            setPartDataError(null);
            try {
                const partResponse = await fetchPricePart(selectedPriceId.ppid);
                setPricePartData(partResponse);
            } catch (error) {
                setPartDataError(error.message || 'Failed to fetch price details');
            } finally {
                setPartDataLoading(false);
            }
        };

        fetchParticular();
    }, [selectedPriceId]);  // selectedPriceId가 변경될 때만 실행

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        refetch();  // 데이터 새로고침
        setSelectedPriceId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };

    // Edit & Delete 메뉴
    const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);
    const closeDropdown = () => setIsOpenDropdown(false);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-4' : 'grid-cols-2'}`}>
            <div className="col-span-4 justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Price</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-4'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Price Data</h1>
                    <div className="flex space-x-2 items-center">
                        <button onClick={() => navigate('/price/new')}
                                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                            <FiPlus />
                            <span>New</span>
                        </button>
                        <button onClick={toggleDropdown}
                                className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                            <BsThreeDotsVertical />
                        </button>
                        {isOpenDropdown && (
                            <div
                                className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                                onMouseLeave={closeDropdown}>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modify</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                        <button onClick={() => console.log('acct_setting')}
                                className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                            <RiSettings3Fill />
                        </button>
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={PriceTableColumns}
                    data={data}
                    options={{
                        ...PriceTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id:', selectedRow);
                                // setSelectedPriceId(selectedRow);
                                // setIsExpanded(true);

                                // 같은 Row 선택
                                if (selectedPriceId && selectedPriceId.ppid === selectedRow.ppid) {
                                    setSelectedPriceId(null);
                                    setIsExpanded(false); // 동일 row 선택 시 닫기
                                } else { // 다른 Row 선택시
                                    setSelectedPriceId(selectedRow);
                                    setIsExpanded(true); // 새로운 row 선택 시 열기
                                }
                            },
                        },
                    }}
                />
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && selectedPriceId && (
                <div className="p-2 col-span-2">
                    <div className="flex flex-col">
                        {/* Top */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Acct_Num */}
                            <h2 className="py-1 text-lg font-bold text-red-600">{selectedPriceId.ppid}</h2>

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="price"
                                id={selectedPriceId.ppid}
                                deleteFunction={deletePrice}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/* Bottom */}
                        <div className="col-span-2 bg-gray-50 rounded-lg shadow-lg">
                            <div className="p-3">
                                <h2 className="text-xl font-bold">가격 세부 정보</h2>

                                {partDataLoading ? (
                                    <LoadingSpinner />
                                ) : partDataError ? (
                                    <p className="text-red-500">Error loading history: {historyError}</p>
                                ) : pricePartData ? (
                                    <PricePartForm pricePartData={pricePartData} />
                                ) : (
                                    <p>Select an price to view details</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isExpanded && selectedPriceId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="col-span-2 bg-gray-50 rounded-lg shadow-lg">
                            <div className="p-2">
                                <h2 className="text-xl font-bold">Price Particular</h2>

                                {historyLoading ? (
                                    <LoadingSpinner />
                                ) : historyError ? (
                                    <p>Error loading particular: {historyError}</p>
                                ) : (
                                    <div className="px-3">
                                        <ReusableTable
                                            columns={PriceTableColumns}
                                            data={historyData ? [historyData] : []}
                                            options={{
                                                initialState: { sorting: [{ id: 'ppid', desc: true }] },
                                                enablePagination: false,
                                                enableSorting: false,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-span-4 justify-between border-b pb-3 mb-2 border-gray-400">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Open Modal
                </button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <p>This is the content inside the modal.</p>
                </Modal>
            </div>

        </div>
    );
};

export default PricePage;
