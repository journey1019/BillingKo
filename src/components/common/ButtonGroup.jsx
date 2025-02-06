import { useState, useEffect } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '@/service/accountService';

const ButtonGroup = ({ entityType, id, deleteFunction, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (showConfirmModal) {
            // Disable scrolling when the modal is open
            document.body.style.overflow = "hidden";
        } else {
            // Enable scrolling when the modal is closed
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; // Clean up if component unmounts
        };
    }, [showConfirmModal]);

    const handleDelete = async () => {
        try {
            console.log(`Deleting ${entityType}:`, id);
            await deleteFunction(id);
            alert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully!`);

            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (err) {
            console.error(`Failed to delete ${entityType}:`, err.message);
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <>
            <div className="inline-flex rounded-md shadow-xs" role="group">
                <button type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        onClick={() => navigate(`/${entityType}/${id}/edit`)}
                >
                    <MdModeEditOutline className="mr-3" />
                    Edit
                </button>
                <button type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        onClick={() => setShowConfirmModal(true)}
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


            {/* Confirm Delete Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-md p-4 h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Close button */}
                            <button
                                type="button"
                                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>

                            <div className="p-4 text-center">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-200"
                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure
                                    you want to delete this {entityType}?</h3>

                                <button
                                    onClick={handleDelete}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-5 py-2.5 ml-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ButtonGroup;
