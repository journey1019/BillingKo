import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

const ConfirmModal = ({ show, onClose, onConfirm, message, status }) => {
    if (!show) return null;

    const StatusIcon = ({ statusIcon }) => {
        const IconComponent = (statusIcon === "delete") ? IoIosCloseCircle : FaCheck;

        return <IconComponent className="w-12 h-12 mx-auto mb-4 text-gray-500" />;
    };

    // 동적 클래스 설정
    const buttonClass =
        status === 'delete'
            ? 'bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800'
            : 'bg-blue-600 hover:bg-blue-800 focus:ring-blue-300 dark:focus:ring-blue-800';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md md:max-w-lg p-4 h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Close button */}
                    <button
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-4 text-center">
                        <StatusIcon statusIcon={status}/>
                        <h3 className="mb-5 text-base md:text-lg font-normal text-gray-500">{message}</h3>

                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-4 ${buttonClass}`}
                        >
                            Yes, I&apos;m sure
                        </button>
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 ml-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
