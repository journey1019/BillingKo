import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiRefreshCw } from 'react-icons/fi';
import { TfiImport } from 'react-icons/tfi';

const DataActionDropdown = ({
                                onExportCSV,
                                onExportExcel,
                                onRefresh,
                                csvLabel = "Export CSV",
                                excelLabel = "Export Excel",
                                refreshLabel = "Refresh List"
                            }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
            >
                <BsThreeDotsVertical />
            </button>

            {isOpen && (
                <div
                    className="absolute z-10 mt-2 right-0 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                    onMouseLeave={closeDropdown}
                >
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        {onExportCSV && (
                            <li className="block px-2 py-1">
                                <button
                                    onClick={onExportCSV}
                                    className="flex flex-row px-4 py-2 hover:bg-gray-100 items-center space-x-4 rounded-md w-full"
                                >
                                    <TfiImport className="w-4 h-4 text-blue-500 font-extrabold" />
                                    <span>{csvLabel}</span>
                                </button>
                            </li>
                        )}
                        {onExportExcel && (
                            <li className="block px-2 py-1 border-b">
                                <button
                                    onClick={onExportExcel}
                                    className="flex flex-row px-4 py-2 hover:bg-gray-100 items-center space-x-4 rounded-md w-full"
                                >
                                    <TfiImport className="w-4 h-4 text-blue-500 font-extrabold" />
                                    <span>{excelLabel}</span>
                                </button>
                            </li>
                        )}
                        {onRefresh && (
                            <li className="block p-2">
                                <button
                                    onClick={onRefresh}
                                    className="flex flex-row px-4 py-2 hover:bg-gray-100 items-center space-x-4 rounded-md w-full"
                                >
                                    <FiRefreshCw className="w-4 h-4 text-blue-500 font-extrabold" />
                                    <span>{refreshLabel}</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DataActionDropdown;
