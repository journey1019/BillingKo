import React from "react";

const DropdownMenu = ({ isOpen, closeDropdown, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="w-[250px] xl:w-[400px] absolute top-full mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm border border-gray-300 transition-all duration-200 ease-in-out transform right-0">
            <div className="flex rounded-t-md py-3 px-4 border-b bg-gray-100">
                <span className="font-semibold">{title}</span>
            </div>
            <ul className="text-sm text-gray-700">{children}</ul>
        </div>
    );
};

export default DropdownMenu;
