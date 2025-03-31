import { NavLink } from 'react-router-dom';
import { useActivePath } from '@/utils/navigationHelpers.js';
import { useState } from "react";
import { FaAddressCard, FaChalkboard, FaCalculator } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";

const Sidebar = ({ isSidebarOpen }) => {
    const [tooltip, setTooltip] = useState("");

    const menuItems = [
        { path: "/file", icon: <FaFileCsv size={20} />, label: "파일 관리" },
        { path: "/accounts", icon: <FaAddressCard size={20} />, label: "사용자 관리" },
        { path: "/devices", icon: <FaChalkboard size={20} />, label: "단말기 관리" },
        { path: "/price", icon: <FaSackDollar size={20} />, label: "요금제 및 조정 관리" },
        { path: "/monthly", icon: <FaCalculator size={20} />, label: "단말기별 정산 내역 관리" },
    ];

    return (
        <ul className="mt-4 space-y-2">
            {menuItems.map((item, index) => (
                <NavLink to={item.path} key={index} className="block">
                    <li
                        className={`relative flex cursor-pointer items-center space-x-4 px-4 py-2 transition 
                        ${useActivePath(item.path)}`}
                        onMouseEnter={() => setTooltip(item.label)}
                        onMouseLeave={() => setTooltip("")}
                    >
                        {item.icon}
                        {isSidebarOpen && <span className="transition duration-300">{item.label}</span>}

                        {/* Tooltip */}
                        {!isSidebarOpen && tooltip === item.label && (
                            <div
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 text-sm text-white bg-gray-800 rounded shadow z-60 whitespace-nowrap">
                                {item.label}
                            </div>
                        )}
                    </li>
                </NavLink>
            ))}
        </ul>
    );
};

export default Sidebar;
