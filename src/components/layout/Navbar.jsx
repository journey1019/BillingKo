import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaAddressCard,
    FaBars,
    FaTimes,
    FaChalkboard,
    FaShoppingCart,
    FaChartBar,
    FaLayerGroup,
} from 'react-icons/fa';
import { SiBitcoincash } from 'react-icons/si';
import { TbLogout } from 'react-icons/tb';
import { FiPlus } from 'react-icons/fi';
import { FaFileCsv } from "react-icons/fa";
import Sidebar from '@/components/layout/Sidebar.jsx';
import { FaPrint } from "react-icons/fa";

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
                <Sidebar isSidebarOpen={isSidebarOpen}/>
            </div>

            {/* Navbar */}
            <nav
                className={`fixed right-0 top-0 z-50 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'left-48' : 'left-16'
                }`}
            >
                <div className="flex items-center justify-between px-6 py-3 md:py-3">
                    <Link to="/" className="text-lg md:text-2xl font-bold hover:underline">
                        KOREA ORBCOMM
                    </Link>
                    <ul className="flex space-x-8">
                        <li>
                            <Link
                                to="/ko_monthly"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaChalkboard />
                                <span>청구서 전 데이터</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/file"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaPrint />
                                <span>청구서</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/logout"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <TbLogout />
                                <span>로그아웃</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Breadcrumbs */}
            {/*<div*/}
            {/*    className={`fixed right-0 top-[64px] z-50 bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow-md transition-all duration-300 ${*/}
            {/*        isSidebarOpen ? 'left-48' : 'left-16'*/}
            {/*    }`}*/}
            {/*>*/}
            {/*    <div className="container mx-auto flex flex-row justify-between items-center">*/}
            {/*        /!* Search Device | Account *!/*/}
            {/*        <span>Search Device</span>*/}

            {/*        /!* Add Button *!/*/}
            {/*        <button onClick={() => console.log('click')}>*/}
            {/*            <li className="flex flex-row p-2 rounded-md bg-blue-500 items-center text-sm text-white">*/}
            {/*                <FiPlus />*/}
            {/*            </li>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default Navbar;
