import { useState, useRef } from "react";

const Popover = ({ title, content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef(null);

    return (
        <div
            className="relative inline-block w-full"
            onMouseEnter={() => setIsVisible(true)} // ✅ 마우스를 올리면 Popover 표시
            onMouseLeave={() => setIsVisible(false)} // ✅ 마우스를 떼면 Popover 숨김
        >
            {/* ✅ 항상 보이는 ProgressBar */}
            {children}

            {/* ✅ Hover 시 Popover 표시 */}
            {isVisible && (
                <div
                    ref={popoverRef}
                    className="absolute z-10 w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 left-1/2 transform -translate-x-1/2 mt-2"
                >
                    {/* ✅ Popover 제목 */}
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                    </div>

                    {/* ✅ Popover 내용 */}
                    <div className="px-3 py-2">{content}</div>
                </div>
            )}
        </div>
    );
};

export default Popover;
