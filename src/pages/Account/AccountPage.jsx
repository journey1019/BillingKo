import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchAccounts, deleteAccount, fetchAccountHistory, fetchAccountPart } from '@/service/accountService.js';
import { fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
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
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import AccountOverviewTab from '@/components/form/Account/AccountOverviewTab.jsx';
import AccountTransactionTab from '@/components/form/Account/AccountTransactionTab.jsx';
import AccountHistoryTab from '@/components/form/Account/AccountHistoryTab.jsx';
import { IoMdClose } from "react-icons/io";


const AccountPage = () => {
    const { data: accountData, loading: accountLoading, error: accountError, refetch: accountRefetch } = useApiFetch(fetchAccounts);

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    // 부분 계정 데이터 상태
    const [accountPartData, setAccountPartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // 이력 데이터 상태
    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 조정 데이터 상태
    const [adjustHistoryData, setAdjustHistoryData] = useState(null);
    const [adjustHistoryLoading, setAdjustHistoryLoading] = useState(false);
    const [adjustHistoryError, setAdjustHistoryError] = useState(null);

    // FilterSelectOptions
    const [classificationOptions, setClassificationOptions] = useState([]);
    useEffect(() => {
        if (accountData) {
            const uniqueClassifiactions = Array.from(
                new Set(accountData.map((item) => item.classification))
            ).filter(Boolean);
            setClassificationOptions(uniqueClassifiactions);
        }
    }, [accountData]);

    const dynamicColumns = AccountTableColumns.map((col) => {
        if (col.accessorKey === 'classification') {
            return { ...col, filterSelectOptions: classificationOptions };
        }
        return col;
    });


    /** AccountData의 파생 데이터 */
    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (!selectedAccountId) return;  // 선택된 값이 없으면 호출하지 않음

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

            // 조정 데이터 가져오기
            setAdjustHistoryLoading(true);
            setAdjustHistoryError(null);
            try {
                const adjustResponse = await fetchAdjustmentValueHistory(selectedAccountId.acct_num);
                setAdjustHistoryData(adjustResponse);
            } catch (error) {
                setAdjustHistoryError(error.message || 'Failed to fetch account details');
            } finally {
                setAdjustHistoryLoading(false);
            }
        };

        fetchAccountDetails();
    }, [selectedAccountId]);  // selectedAccountId가 변경될 때만 실행


    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        accountRefetch();  // 데이터 새로고침
        setSelectedAccountId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };



    console.log('accountPartData : ', accountPartData)
    console.log('historyData : ', historyData)
    console.log('adjustHistoryData : ', adjustHistoryData)
    console.log('dynamicColumns : ', dynamicColumns)
    console.log('AccountTableColumns :', AccountTableColumns)

    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">고객 관리</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">고객 데이터 검토</h1>
                    <div className="flex space-x-2 items-center">
                        <button onClick={() => navigate('/accounts/new')}
                                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                            <FiPlus />
                            <span>New</span>
                        </button>
                        {/*<button onClick={toggleDropdown}*/}
                        {/*        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">*/}
                        {/*    <BsThreeDotsVertical />*/}
                        {/*</button>*/}
                        {/*{isOpenDropdown && (*/}
                        {/*    <div*/}
                        {/*        className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"*/}
                        {/*        onMouseLeave={closeDropdown}>*/}
                        {/*        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">*/}
                        {/*            <li>*/}
                        {/*                <a href={`accounts/{selectedAccountId.acct_num}/edit`}*/}
                        {/*                   className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modify</a>*/}
                        {/*            </li>*/}
                        {/*            <li>*/}
                        {/*                <a href="#"*/}
                        {/*                   className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>*/}
                        {/*            </li>*/}
                        {/*        </ul>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {/*<button onClick={() => console.log('acct_setting')}*/}
                        {/*        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">*/}
                        {/*    <RiSettings3Fill />*/}
                        {/*</button>*/}
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={dynamicColumns || []}
                    data={accountData || []}
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
                    isLoading={accountLoading}
                    error={accountError}
                />
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && selectedAccountId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        {/* Handle */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Acct_Num */}
                            <h2 className="py-1 text-lg font-bold">{selectedAccountId.acct_num} _ {selectedAccountId.acct_name}</h2>

                            <div className="flex flex-row items-center space-x-4">
                                {/* Buttons - Edit & Mail & . */}
                                <ButtonGroup
                                    entityType="accounts"
                                    id={selectedAccountId.acct_num}
                                    deleteFunction={deleteAccount}
                                    onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                                />
                                <button
                                    onClick={() => {
                                        setIsExpanded(false);
                                        selectedAccountId(null);
                                    }}
                                    className="p-2 rounded-md text-black hover:text-gray-500"
                                >
                                    <IoMdClose />
                                </button>
                            </div>
                        </div>

                        {/* Tab */}
                        <TabComponent tabs={[
                            {
                                id: 1,
                                label: 'Overview',
                                content: <AccountOverviewTab partDataLoading={partDataLoading}
                                                             partDataError={partDataError}
                                                             accountPartData={accountPartData} />,
                            },
                            {
                                id: 2,
                                label: 'Transaction',
                                content: <AccountTransactionTab adjustHistoryLoading={adjustHistoryLoading} adjustHistoryError={adjustHistoryError} adjustHistoryData={adjustHistoryData}/> },
                            { id: 3, label: 'History', content: <AccountHistoryTab historyLoading={historyLoading} historyError={historyError} historyData={historyData} AccountTableColumns={AccountTableColumns}/> },
                        ]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
