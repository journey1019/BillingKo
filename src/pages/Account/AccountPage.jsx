import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchAccounts, deleteAccount, fetchAccountHistory, fetchAccountPart } from '@/service/accountService.js';
import { fetchAdjustmentPart } from '@/service/adjustmentService.js';
import { AccountTableColumns } from '@/columns/AccountTableColumns.jsx';
import { AccountTableOptions } from '@/options/AccountTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';

import { useNavigate } from 'react-router-dom';

import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';
import AccountPartForm from '@/components/form/AccountPartForm.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import { AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';


const AccountPage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchAccounts);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    // 이력 데이터 상태
    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 부분 계정 데이터 상태
    const [accountPartData, setAccountPartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // 조정 데이터 상태
    const [adjustData, setAdjustData] = useState(null);
    const [adjustLoading, setAdjustLoading] = useState(false);
    const [adjustError, setAdjustError] = useState(null);

    // 선택된 acct_num 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (!selectedAccountId) return;  // 선택된 값이 없으면 호출하지 않음

            // 이력 데이터 가져오기
            setHistoryLoading(true);
            setHistoryError(null);
            try {
                const response = await fetchAccountHistory(selectedAccountId.acct_num);
                setHistoryData(response);
            } catch (error) {
                setHistoryError(error.message || 'Failed to fetch account history');
            } finally {
                setHistoryLoading(false);
            }

            // 부분 계정 데이터 가져오기
            setPartDataLoading(true);
            setPartDataError(null);
            try {
                const partResponse = await fetchAccountPart(selectedAccountId.acct_num);
                setAccountPartData(partResponse);
            } catch (error) {
                setPartDataError(error.message || 'Failed to fetch account details');
            } finally {
                setPartDataLoading(false);
            }

            setAdjustLoading(true);
            setAdjustError(null);
            try {
                const adjustResponse = await fetchAdjustmentPart(selectedAccountId.acct_num);
                setAdjustData(adjustResponse);
            } catch (error) {
                setAdjustError(error.message || 'Failed to fetch account details');
            } finally {
                setAdjustLoading(false);
            }
        };

        fetchAccountDetails();
    }, [selectedAccountId]);  // selectedAccountId가 변경될 때만 실행

    const getSelectedAccount = () => {
        return data?.find(account => account.id === selectedAccountId) || {};
    };

    // 계정 삭제 핸들러
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await deleteAccount(id);
                refetch();
                alert('Account deleted successfully!');
                setSelectedAccountId(null);
            } catch (error) {
                console.error('Failed to delete account:', error.message);
            }
        }
    };

    const handleModify = (id) => {
        navigate(`/accounts/${id}/edit`);
    };

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        refetch();  // 데이터 새로고침
        setSelectedAccountId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };

    // Edit & Delete 메뉴
    const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);
    const closeDropdown = () => setIsOpenDropdown(false);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;


    const OverviewTab = () => {
        return(
            <>
                {/* Account Part Information */}
                <div>
                    {partDataLoading ? (
                        <LoadingSpinner />
                    ) : partDataError ? (
                        <p className="text-red-500">{partDataError}</p>
                    ) : accountPartData ? (
                        <AccountPartForm accountPartData={accountPartData} />
                    ) : (
                        <p>Select an account to view details</p>
                    )}
                </div>
            </>
        )
    }
    const TransactionTab = () => {
        return(
            <div>
                {adjustLoading ? (
                    <LoadingSpinner />
                ) : adjustError ? (
                    <p className="text-red-500">{adjustError}</p>
                ) : (
                    <div>
                        <ReusableTable
                            columns={AdjustmentTableColumns}
                            data={adjustData}
                            options={{
                                ...AdjustmentTableOptions,
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }
    const HistoryTab = () => {
        return (
            <>
                {isExpanded && selectedAccountId && (
                    <div>
                        {historyLoading ? (
                            <LoadingSpinner />
                        ) : historyError ? (
                            <p>Error loading history: {historyError}</p>
                        ) : (
                            <div>
                                <ReusableTable
                                    columns={AccountTableColumns}
                                    data={historyData ? historyData : []}
                                    options={{
                                        initialState: { sorting: [{ id: 'acct_num', desc: true }] },
                                        enablePagination: false,
                                        enableSorting: false,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </>
        )
    }
    const tabs = [
        { id: 1, label: 'Overview', content: <OverviewTab /> },
        { id: 2, label: 'Transaction', content: <TransactionTab /> },
        { id: 3, label: 'History', content: <HistoryTab /> },
    ];


    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Account</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Account Data</h1>
                    <div className="flex space-x-2 items-center">
                        <button onClick={() => navigate('/accounts/new')}
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
                    columns={AccountTableColumns}
                    data={data}
                    options={{
                        ...AccountTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id:', selectedRow);
                                // setSelectedAccountId(selectedRow);
                                // setIsExpanded(true);

                                // 같은 Row 선택
                                if (selectedAccountId && selectedAccountId.acct_num === selectedRow.acct_num) {
                                    setSelectedAccountId(null);
                                    setIsExpanded(false); // 동일 row 선택 시 닫기
                                } else { // 다른 Row 선택시
                                    setSelectedAccountId(selectedRow);
                                    setIsExpanded(true); // 새로운 row 선택 시 열기
                                }
                            },
                        },
                    }}
                />
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && selectedAccountId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        {/* Handle */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Acct_Num */}
                            <h2 className="py-1 text-lg font-bold text-red-600">{selectedAccountId.acct_num}</h2>

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="accounts"
                                id={selectedAccountId.acct_num}
                                deleteFunction={deleteAccount}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        <TabComponent tabs={tabs} />

                    </div>

                </div>
            )}

            {/* Under Section (Only visible when expanded) */}
            {/*{isExpanded && selectedAccountId && (*/}
            {/*    <div className="p-2 col-span-6">*/}
            {/*        <div className="flex flex-col">*/}
            {/*            <div className="col-span-2 bg-gray-50 rounded-lg shadow-lg">*/}
            {/*                <div className="p-2">*/}
            {/*                    <h2 className="text-xl font-medium pl-2 pb-2">{selectedAccountId.acct_num} History</h2>*/}
            {/*                    {historyLoading ? (*/}
            {/*                        <LoadingSpinner />*/}
            {/*                    ) : historyError ? (*/}
            {/*                        <p>Error loading history: {historyError}</p>*/}
            {/*                    ) : (*/}
            {/*                        <div className="px-3">*/}
            {/*                            <ReusableTable*/}
            {/*                                columns={AccountTableColumns}*/}
            {/*                                data={historyData ? historyData : []}*/}
            {/*                                options={{*/}
            {/*                                    initialState: { sorting: [{ id: 'acct_num', desc: true }] },*/}
            {/*                                    enablePagination: false,*/}
            {/*                                    enableSorting: false,*/}
            {/*                                }}*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default AccountPage;
