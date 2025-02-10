import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';
import { useState } from 'react';

const AdditionButtons = () => {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    // Edit & Delete 메뉴
    const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);
    const closeDropdown = () => setIsOpenDropdown(false);
    return(
        <>
            <button onClick={toggleDropdown}
                    className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                <BsThreeDotsVertical />
            </button>
            {isOpenDropdown && (
                <div
                    className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                    onMouseLeave={closeDropdown}>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <a href="#"
                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modify</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                        </li>
                    </ul>
                </div>
            )}
            <button onClick={() => console.log('acct_setting')}
                    className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                <RiSettings3Fill />
            </button>
        </>
    )
}

export default AdditionButtons;