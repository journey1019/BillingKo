import React from "react";
import { CgMoveRight } from "react-icons/cg";
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DropdownMenu = ({ isOpen, closeDropdown, title, children, tooltipContent, tooltipLink, position = "right" }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();

    // position에 따라 class 설정 (left 또는 right)
    const positionClass = position === "left" ? "right-0" : "left-0";

    return (
        <div className={`w-[250px] xl:w-[400px] absolute top-full mt-1 bg-white divide-y divide-gray-100 
                        rounded-lg shadow-sm border border-gray-300 transition-all duration-200 
                        ease-in-out transform ${positionClass} z-20`}>
            <div className="flex rounded-t-md py-3 px-4 border-b bg-gray-100 justify-between">
                <span className="font-semibold">{title}</span>
                {/* ✅ tooltipContent가 있을 때만 Tooltip을 렌더링 */}
                {tooltipContent && (
                    <Tooltip title={tooltipContent}>
                        <button onClick={() => navigate(tooltipLink)} className="hover:text-blue-500">
                            <CgMoveRight className="w-6 h-6"/>
                        </button>
                    </Tooltip>
                )}
            </div>
            <ul className="text-sm text-gray-700">{children}</ul>
        </div>
    );
};

export default DropdownMenu;
