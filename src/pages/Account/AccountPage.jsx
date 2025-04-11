import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import useAccountStore from '@/stores/accountStore';
import { useAcctNumList, useAcctClassificationOptions } from '@/selectors/useAccountSelectors';

import { AccountTableColumns } from '@/columns/AccountTableColumns.jsx';
import { AccountTableOptions } from '@/options/AccountTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

import EachTransactionHistoryTab from '@/components/form/Adjustment/EachTransactionHistoryTab.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import AccountOverviewTab from '@/components/form/Account/AccountOverviewTab.jsx';
import AccountTransactionTab from '@/components/form/Account/AccountTransactionTab.jsx';
import AccountHistoryTab from '@/components/form/Account/AccountHistoryTab.jsx';

import { IoMdClose } from "react-icons/io";



const AccountPage = () => {
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.get("value");

    const { accountData, fetchAccountData, fetchAccountDetails, accountLoading, accountError, accountPartData, historyData, adjustHistoryData, deleteAccountData } = useAccountStore();
    const classificationOptions = useAcctClassificationOptions();

    const navigate = useNavigate();

    // Account Table Row Select
    const [selectedAccountId, setSelectedAccountId] = useState(urlValue || null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchAccountData();
    }, []);

    useEffect(() => {
        if (selectedAccountId) {
            fetchAccountDetails(selectedAccountId.acct_num);
        }
    }, [selectedAccountId]);

    // ✅ urlValue로 선택할 계정 자동 설정
    useEffect(() => {
        if (urlValue && accountData.length > 0) {
            const matchedAccount = accountData.find(account => account.acct_num === urlValue);
            if (matchedAccount) {
                setSelectedAccountId(matchedAccount);
                setIsExpanded(true);
            }
        }
    }, [urlValue, accountData]);

    const dynamicColumns = useMemo(() => {
        return AccountTableColumns.map((col) =>
            col.accessorKey === 'classification'
                ? { ...col, filterSelectOptions: classificationOptions }
                : col
        );
    }, [classificationOptions]);

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = async (acct_num) => {
        try {
            await fetchAccountData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedAccountId(null);
            setIsExpanded(false);
            // console.log(`✅ 삭제 후 새로고침 완료 (Account: ${acct_num})`);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };

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
                        <NewButton to="/accounts/new"/>

                        <DataActionDropdown
                            onExportCSV={() => exportToCSV(accountData, 'Accounts.csv')}
                            onExportExcel={() => exportToExcel(accountData, 'Accounts.xlsx')}
                            onRefresh={fetchAccountData}
                        />
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={dynamicColumns || []}
                    data={accountData || []}
                    options={{
                        ...AccountTableOptions(selectedAccountId),
                        meta: {
                            onRowSelect: (selectedRow) => {
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
                                    deleteFunction={deleteAccountData}
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
                            { id: 1, label: 'Overview', content: <AccountOverviewTab /> },
                            { id: 2, label: 'Transaction', content: <AccountTransactionTab selectedAccountId={selectedAccountId}/> },
                            { id: 3, label: 'History',
                                content: (
                                    <>
                                        <h1 className="font-bold my-2">고객 이력 정보</h1>
                                        <AccountHistoryTab AccountTableColumns={AccountTableColumns} />

                                        <h1 className="font-bold my-2 pt-4">고객 조정 이력 정보</h1>
                                        <EachTransactionHistoryTab selectedData={selectedAccountId}/>
                                    </>
                                )
                            },
                        ]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
