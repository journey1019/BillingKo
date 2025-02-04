import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '@/service/accountService';
import { useState } from 'react';

const ButtonGroup = ({ acct_num, onDeleteSuccess }) => {
    const navigate = useNavigate();

    // const handleDelete = async (e) => {
    //     e.preventDefault();
    //     try {
    //         console.log("Delete 요청 보낼 데이터", acct_num);
    //         await deleteAccount(acct_num);
    //         alert("Delete!");
    //         navigate("/accounts");
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // }
    const handleDelete = async (e) => {
        e.preventDefault();
        const confirmDelete = window.confirm("Are you sure you want to delete this account?");
        if (!confirmDelete) return;

        try {
            console.log("Deleting account:", acct_num);
            await deleteAccount(acct_num);
            alert("Account deleted successfully!");

            // 부모 컴포넌트의 상태 갱신을 위해 콜백 호출
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (err) {
            console.error("Failed to delete account:", err.message);
        }
    };

    return (
        <div className="inline-flex rounded-md shadow-xs" role="group">
            <button type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={() => navigate(`/accounts/${acct_num}/edit`)}
            >
                <MdModeEditOutline className="mr-3" />
                Edit
            </button>
            <button type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={handleDelete}
            >
                <MdDelete className="mr-3" />
                Delete
            </button>
            <button type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                </svg>
                Settings
            </button>
            <button type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor"
                     viewBox="0 0 20 20">
                    <path
                        d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path
                        d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                </svg>
                Downloads
            </button>
        </div>
    );
};
export default ButtonGroup;