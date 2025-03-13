import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

/**
 * 재사용 가능한 Dropdown 컴포넌트
 * @param {JSX.Element} trigger - 드롭다운을 열기 위한 버튼 (예: 아이콘 버튼)
 * @param {JSX.Element} children - 드롭다운 내부에 들어갈 동적 컨텐츠
 * @param {"left" | "right"} position - 드롭다운 메뉴의 정렬 방향 (기본값: "left")
 */
const Dropdown = ({ trigger, children, position = "left" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    return (
        <div className="relative inline-block">
            {/* ✅ 트리거 버튼 */}
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                {trigger}
            </button>

            {/* ✅ 드롭다운 메뉴 */}
            <div
                ref={dropdownRef}
                className={clsx(
                    "absolute top-full mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-md border border-gray-300",
                    "transition-all duration-200 ease-in-out transform min-w-max",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                    position === "right" ? "right-0" : "left-0"
                )}
            >
                {/* ✅ 컨텐츠 영역 (줄바꿈 방지) */}
                <ul className="text-sm text-gray-700 p-2 whitespace-nowrap">{children}</ul>

                {/* ✅ 닫기 버튼 */}
                <div className="flex justify-end p-2 bg-gray-100 rounded-b-md">
                    <button onClick={closeDropdown} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
