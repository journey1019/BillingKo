import { useState } from 'react'
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchAccounts, deleteAccount } from '@/service/accountService';
import { AccountTableColumns } from '@/columns/AccountTableColumns';
import { AccountTableOptions } from '@/options/AccountTableOptions';
import ReusableTable from '@/components/table/ReusableTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";

const AccountPage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchAccounts);
    const navigate = useNavigate();
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);

    // 계정 삭제 핸들러
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                await deleteAccount(id);
                refetch(); // 데이터 갱신
                alert("Account deleted successfully!");
            } catch (error) {
                console.error("Failed to delete account:", error.message);
            }
        }
    };

    // 수정 페이지 이동
    const handleModify = (id) => {
        navigate(`/accounts/${id}/edit`);
    };

    const toggleDropdown = () => {
        setIsOpenDropdown(!isOpenDropdown);
    }
    const closeDropdown = () => {
        setIsOpenDropdown(false);
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                {/* Title */}
                <h1 className="py-1 text-lg font-bold">Account Data</h1>

                {/* Setting Buttons */}
                <div className="flex space-x-2 items-center">
                    {/* New Account */}
                    <button onClick={() => navigate("/accounts/new")} className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                        <FiPlus />
                        <span>New</span>
                    </button>

                    {/* Add */}
                    <button
                        onClick={toggleDropdown}
                        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
                    >
                        <BsThreeDotsVertical />
                    </button>
                    {/* Dropdown Menu */}
                    {isOpenDropdown && (
                        <div
                            className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                            onMouseLeave={closeDropdown} // 드롭다운 외부로 마우스 이동 시 닫기
                        >
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Modify
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Settings */}
                    <button
                        onClick={() => console.log('acct_setting')}
                        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
                    >
                        <RiSettings3Fill />
                    </button>
                </div>
            </div>
            <ReusableTable
                columns={AccountTableColumns}
                data={data}
                options={{
                    ...AccountTableOptions,
                    onRowClick: (row) => {
                        setSelectedAccountId(row.original.id);
                    },
                }}
            />
            {selectedAccountId && (
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={() => handleModify(selectedAccountId)}
                        className="text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md"
                    >
                        Modify
                    </button>
                    <button
                        onClick={() => handleDelete(selectedAccountId)}
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
