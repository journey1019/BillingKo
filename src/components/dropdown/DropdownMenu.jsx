import React from "react";
import { FaExpandAlt } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const DropdownMenu = ({ isOpen, closeDropdown, title, children }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();

    return (
        <div className="w-[250px] xl:w-[400px] absolute top-full mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm border border-gray-300 transition-all duration-200 ease-in-out transform right-0">
            <div className="flex rounded-t-md py-3 px-4 border-b bg-gray-100 justify-between">
                <span className="font-semibold">{title}</span>
                <Tooltip title="조정 세부 데이터 설정">
                    <button onClick={() => navigate('/adjustment')} className="hover:text-blue-500"><FaExpandAlt/></button>
                </Tooltip>
            </div>
            <ul className="text-sm text-gray-700">{children}</ul>
        </div>
    );
};

export default DropdownMenu;
