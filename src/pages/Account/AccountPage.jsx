import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import useAccountStore from '@/stores/accountStore';
import { useAcctClassificationOptions } from '@/selectors/useAccountSelectors';

import { AccountTableColumns } from '@/columns/AccountTableColumns.jsx';
import { AccountTableOptions } from '@/options/AccountTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

import EachTransactionHistoryTab from '@/components/form/Adjustment/EachTransactionHistoryTab.jsx';
import AccountOverviewTab from '@/components/form/Account/AccountOverviewTab.jsx';
import AccountTransactionTab from '@/components/form/Account/AccountTransactionTab.jsx';
import AccountHistoryTab from '@/components/form/Account/AccountHistoryTab.jsx';

import ExpandablePageLayout from '@/components/layout/ExpandablePageLayout';


const AccountPage = () => {
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.get("value");

    const {
        accountData,
        fetchAccountData,
        fetchAccountDetails,
        accountLoading,
        accountError,
        accountPartData,
        historyData,
        adjustHistoryData,
        deleteAccountData
    } = useAccountStore();
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
    const handleDeleteSuccess = async () => {
        try {
            await fetchAccountData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedAccountId(null);
            setIsExpanded(false);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };

    return (
        <ExpandablePageLayout
            title="고객 관리"
            isExpanded={isExpanded}
            leftTitle="고객 데이터 검토"
            newButtonTo="/accounts/new"
            onExportCSV={() => exportToCSV(accountData, 'Accounts.csv')}
            onExportExcel={() => exportToExcel(accountData, 'Accounts.xlsx')}
            onRefresh={fetchAccountData}
            table={
                <ReusableTable
                    columns={dynamicColumns || []}
                    data={accountData || []}
                    options={{
                        ...AccountTableOptions(selectedAccountId),
                        meta: {
                            onRowSelect: (selectedRow) => {
                                if (selectedAccountId?.acct_num === selectedRow.acct_num) {
                                    setSelectedAccountId(null);
                                    setIsExpanded(false);
                                } else {
                                    setSelectedAccountId(selectedRow);
                                    setIsExpanded(true);
                                }
                            },
                        },
                    }}
                    isLoading={accountLoading}
                    error={accountError}
                />
            }
            selectedId={selectedAccountId}
            rightTitle={`${selectedAccountId?.acct_num} _ ${selectedAccountId?.acct_name}`}
            onClose={() => {
                setIsExpanded(false);
                setSelectedAccountId(null);
            }}
            entityType="accounts"
            editSelectedId={selectedAccountId?.acct_num}
            deleteData={deleteAccountData}
            handleDelete={handleDeleteSuccess}
            rightTabs={[
                { id: 1, label: 'Overview', content: <AccountOverviewTab /> },
                { id: 2, label: 'Transaction', content: <AccountTransactionTab selectedAccountId={selectedAccountId} /> },
                {
                    id: 3, label: 'History', content: (
                        <>
                            <h1 className="font-bold my-2">고객 이력 정보</h1>
                            <AccountHistoryTab AccountTableColumns={AccountTableColumns} />
                            <h1 className="font-bold my-2 pt-4">고객 조정 이력 정보</h1>
                            <EachTransactionHistoryTab selectedData={selectedAccountId} />
                        </>
                    )
                }
            ]}
        />
    );
};

export default AccountPage;
