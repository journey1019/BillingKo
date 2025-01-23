import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaAddressCard,
  FaBars,
  FaTimes,
  FaChalkboard,
  FaShoppingCart,
  FaChartBar,
  FaLayerGroup,
} from "react-icons/fa";
import { SiBitcoincash } from "react-icons/si";

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
          isSidebarOpen ? "w-48" : "w-16"
        }`}
      >
        <div className="flex items-center justify-start border-b border-gray-700 px-4 pb-6 pt-5">
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <span className="truncate pl-3 text-xl font-bold">
            {isSidebarOpen ? "" : ""}
          </span>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-4 space-y-2">
          <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
            <Link to="/account">
              <FaAddressCard size={20} />
            </Link>
            {isSidebarOpen && (
              <Link to="/account" className="transition duration-300">
                사용자 관리
              </Link>
            )}
          </li>
          <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
            <Link to="/device">
              <FaChalkboard size={20} />
            </Link>
            {isSidebarOpen && (
              <Link to="/device" className="transition duration-300">
                단말기 관리
              </Link>
            )}
          </li>
          <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
            <Link to="/price">
              <SiBitcoincash size={20} />
            </Link>
            {isSidebarOpen && (
              <Link to="/price" className="transition duration-300">
                요금제 관리
              </Link>
            )}
          </li>
          <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
            <FaChartBar size={20} />
            {isSidebarOpen && (
              <Link to="/" className="transition duration-300">
                Reports
              </Link>
            )}
          </li>
          <li className="flex cursor-pointer items-center space-x-4 px-4 py-2 text-white transition hover:bg-gray-700 hover:text-blue-400 hover:underline">
            <FaLayerGroup size={20} />
            {isSidebarOpen && (
              <Link to="/" className="transition duration-300">
                Integrations
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed right-0 top-0 z-50 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "left-48" : "left-16"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold hover:underline">
            KOREA ORBCOMM
          </Link>
          <ul className="flex space-x-8">
            <li className="flex items-center space-x-2 transition hover:text-blue-400">
              <FaChalkboard />
              <Link to="/user">사용자 관리</Link>
            </li>
            <li className="flex items-center space-x-2 transition hover:text-blue-400">
              <FaShoppingCart />
              <Link to="/orders">Orders</Link>
            </li>
            <li className="flex items-center space-x-2 transition hover:text-blue-400">
              <FaChartBar />
              <Link to="/reports">Reports</Link>
            </li>
            <li className="flex items-center space-x-2 transition hover:text-blue-400">
              <FaLayerGroup />
              <Link to="/integrations">Integrations</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div
        className={`fixed right-0 top-[64px] z-50 bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow-md transition-all duration-300 ${
          isSidebarOpen ? "left-48" : "left-16"
        }`}
      >
        <span>Home</span>
      </div>
    </div>
  );
};

export default Navbar;
