import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import useYearMonth from "@/hooks/useYearMonth"; // 선택된 월 (예: "202505")
import { useActivePath } from '@/utils/navigationHelpers.js';
import { useStepperStore } from '@/stores/stepperStore';
import Sidebar from '@/components/layout/Sidebar.jsx';
import Stepper from '@/components/ui/step/Stepper.jsx';

import { FaBars, FaTimes, FaChalkboard, FaPrint } from 'react-icons/fa';
import { TbLogout } from 'react-icons/tb';
import { BiSolidUserAccount } from "react-icons/bi";
import Alarm from '../alarm/Alarm.jsx';



const Navbar = () => {
    const loadSteps = useStepperStore((state) => state.loadSteps);

    useEffect(() => {
        loadSteps(); // ✅ API fetch + stepMap 저장
    }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative">
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 z-50 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'w-64' : 'w-16'
                }`}
            >
                <div className={`flex items-center justify-start border-b border-gray-700 px-4 ${isSidebarOpen ? 'py-5' : 'py-6 pb-7'}`}>
                    <button onClick={toggleSidebar} className="focus:outline-none">
                        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                    <span className="truncate pl-3 text-xl font-bold">
                      {isSidebarOpen ? '' : ''}
                    </span>

                    {isSidebarOpen && (
                        <NavLink
                            to="/"
                            className={`text-2xl font-bold hover:underline ml-2`}
                        >
                            Payment
                        </NavLink>
                    )}
                </div>
                {/* Sidebar Menu */}
                <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>

            {/* Navbar */}
            <nav
                className={`fixed right-0 top-0 z-50 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'left-64' : 'left-16'
                }`}
            >
                <div className="flex items-center justify-between px-6 py-3 md:py-3">
                    {/* Logo */}
                    {!isSidebarOpen && (
                        <NavLink
                            to="/"
                            className="text-lg md:text-2xl font-bold hover:underline"
                        >
                            KOREA ORBCOMM
                        </NavLink>
                    )}

                    {/* Progress Bar */}
                    <div className="flex-grow flex justify-center">
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                            <Stepper />
                        </div>
                    </div>


                    {/* Main Menu */}
                    <ul className="text-base flex items-center space-x-4">
                        <li>
                            <NavLink
                                to="/ko_monthly"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/ko_monthly")}`}
                            >
                                <FaChalkboard />
                                <span>단말별 청구서</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/ko_monthly_account"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/ko_monthly_account")}`}
                            >
                                <BiSolidUserAccount />
                                <span>고객별 청구서</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/ko_monthly_result"
                                className={`flex items-center space-x-2 p-2 transition hover:text-blue-400 ${useActivePath("/ko_monthly_result")}`}
                            >
                                <FaPrint />
                                <span>최종 청구서</span>
                            </NavLink>
                        </li>
                        <li>
                            <Alarm />
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
