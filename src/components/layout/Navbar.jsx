import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useActivePath } from '@/utils/navigationHelpers.js';
import {
    FaBars,
    FaTimes,
    FaChalkboard,
    FaPrint,
} from 'react-icons/fa';
import { TbLogout } from 'react-icons/tb';
import Sidebar from '@/components/layout/Sidebar.jsx';
import { BiSolidUserAccount } from "react-icons/bi";

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative">
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 z-50 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'w-48' : 'w-16'
                }`}
            >
                <div className="flex items-center justify-start border-b border-gray-700 px-4 pb-6 pt-5">
                    <button onClick={toggleSidebar} className="focus:outline-none">
                        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                    <span className="truncate pl-3 text-xl font-bold">
                      {isSidebarOpen ? '' : ''}
                    </span>
                </div>
                {/* Sidebar Menu */}
                <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>

            {/* Navbar */}
            <nav
                className={`fixed right-0 top-0 z-50 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'left-48' : 'left-16'
                }`}
            >
                <div className="flex items-center justify-between px-6 py-3 md:py-3">
                    <NavLink
                        to="/"
                        className="text-lg md:text-2xl font-bold hover:underline"
                    >
                        KOREA ORBCOMM
                    </NavLink>
                    <ul className="flex space-x-8">
                        <li>
                            <NavLink
                                to="/ko_monthly"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/ko_monthly")}`}
                            >
                                <FaChalkboard />
                                <span>단말기별 청구서 수정 페이지</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/monthly/account"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/monthly/account")}`}
                            >
                                <BiSolidUserAccount />
                                <span>고객별 청구서 수정 페이지</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/ko_monthly/account/save"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/ko_monthly/account/save")}`}
                            >
                                <FaPrint />
                                <span>최종 청구서 페이지</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/logout"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <TbLogout />
                                <span>로그아웃</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
