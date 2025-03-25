import { useEffect, useState, useMemo } from 'react';
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
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import useAccountStore from '@/stores/accountStore';
import { useAcctNumList, useClassificationOptions } from '@/selectors/useAccountSelectors';



const AccountPage = () => {
    const { accountData, fetchAccountData, fetchAccountDetails, accountLoading, accountError, accountPartData, historyData, adjustHistoryData, } = useAccountStore();
    const classificationOptions = useClassificationOptions();

    const navigate = useNavigate();

    // Account Table Row Select
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchAccountData();
    }, []);

    useEffect(() => {
        if (selectedAccountId) {
            fetchAccountDetails(selectedAccountId.acct_num);
        }
    }, [selectedAccountId]);


    // FilterSelectOptions
    // const [classificationOptions, setClassificationOptions] = useState([]);
    // useEffect(() => {
    //     if (accountData) {
    //         const uniqueClassifiactions = Array.from(
    //             new Set(accountData.map((item) => item.classification))
    //         ).filter(Boolean);
    //         setClassificationOptions(uniqueClassifiactions);
    //     }
    // }, [accountData]);
    // const dynamicColumns = AccountTableColumns.map((col) => {
    //     if (col.accessorKey === 'classification') {
    //         return { ...col, filterSelectOptions: classificationOptions };
    //     }
    //     return col;
    // });

    const dynamicColumns = useMemo(() => {
        return AccountTableColumns.map((col) =>
            col.accessorKey === 'classification'
                ? { ...col, filterSelectOptions: classificationOptions }
                : col
        );
    }, [classificationOptions]);

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        setSelectedAccountId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };

    const handleClick = () => {
        if (!selectedAccountId?.acct_num) {
            console.error("Account Num이 존재하지 않습니다.");
            return;
        }

        if (!adjustHistoryData || adjustHistoryData.length === 0) {
            // 🔹 조정 정보가 없으면 새로운 조정 추가 페이지로 이동
            console.log("Navigating to new adjustment page");
            navigate(`/adjustment/new?adjustment_code=account_num&adjustment_code_value=${selectedAccountId.acct_num}`);
        } else {
            // 🔹 조정 정보가 있으면 가장 최근 adjustment_index 가져와서 수정 페이지로 이동
            const latestAdjustment = adjustHistoryData[0]; // 최신 데이터 (정렬이 되어 있다고 가정)
            console.log("Navigating to edit adjustment page:", latestAdjustment.adjustment_index);
            navigate(`/adjustment/${latestAdjustment.adjustment_index}/adjustment_code=account_num&edit?adjustment_code_value=${selectedAccountId.acct_num}`);
        }
    };


    console.log('accountData : ', accountData)
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
                                content: <AccountOverviewTab />,
                            },
                            {
                                id: 2,
                                label: 'Transaction',
                                content: (
                                    <>
                                        <div className="flex flex-row justify-between">
                                            <h1 className="font-bold my-2">단말기 조정 정보 이력</h1>
                                            <Tooltip title="단말기 조정 정보 추가">
                                                <button
                                                    className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600"
                                                    onClick={() => {
                                                        console.log("Button Clicked!");
                                                        handleClick();
                                                    }}
                                                >
                                                    <TiPlus />
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <AccountTransactionTab />
                                    </>
                                )
                            },
                            {
                                id: 3,
                                label: 'History',
                                content: <AccountHistoryTab AccountTableColumns={AccountTableColumns} />
                            },
                        ]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
