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
                <ul className="mt-4 space-y-2">
                    <Link to="/accounts" className="block">
                        <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
                            <FaAddressCard size={20} />
                            {isSidebarOpen && <span className="transition duration-300">사용자 관리</span>}
                        </li>
                    </Link>
                    <Link to="/device" className="block">
                        <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
                            <FaChalkboard size={20} />
                            {isSidebarOpen && <span className="transition duration-300">단말기 관리</span>}
                        </li>
                    </Link>
                    <Link to="/price" className="block">
                        <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
                            <SiBitcoincash size={20} />
                            {isSidebarOpen && <span className="transition duration-300">요금제 관리</span>}
                        </li>
                    </Link>
                    <Link to="/" className="block">
                        <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
                            <FaChartBar size={20} />
                            {isSidebarOpen && <span className="transition duration-300">Reports</span>}
                        </li>
                    </Link>
                    <Link to="/" className="block">
                        <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
                            <FaLayerGroup size={20} />
                            {isSidebarOpen && <span className="transition duration-300">Integrations</span>}
                        </li>
                    </Link>
                </ul>

            </div>

            {/* Navbar */}
            <nav
                className={`fixed right-0 top-0 z-50 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'left-48' : 'left-16'
                }`}
            >
                <div className="flex items-center justify-between px-6 pt-3 pb-4">
                    <Link to="/" className="text-2xl font-bold hover:underline">
                        KOREA ORBCOMM
                    </Link>
                    <ul className="flex space-x-8">
                        <li>
                            <Link
                                to="/user"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaChalkboard />
                                <span>사용자 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/orders"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaShoppingCart />
                                <span>단말기 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/reports"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaChartBar />
                                <span>요금제 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/integrations"
                                className="flex items-center space-x-2 p-2 transition hover:text-blue-400"
                            >
                                <FaLayerGroup />
                                <span>Integrations</span>
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
            <div
                className={`fixed right-0 top-[64px] z-50 bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow-md transition-all duration-300 ${
                    isSidebarOpen ? 'left-48' : 'left-16'
                }`}
            >
                <div className="container mx-auto flex flex-row justify-between items-center">
                    {/* Search Device | Account */}
                    <span>Search Device</span>

                    {/* Add Button */}
                    <button onClick={() => console.log('click')}>
                        <li className="flex flex-row p-2 rounded-md bg-blue-500 items-center text-sm text-white">
                            <FiPlus />
                        </li>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
