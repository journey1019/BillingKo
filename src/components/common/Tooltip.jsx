import { useState } from 'react';

const Tooltip = ({ message, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {/* Tooltip 대상 요소 */}
            {children}

            {/* Tooltip 메시지 */}
            {isVisible && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs transition-opacity duration-300 opacity-100 z-10 whitespace-nowrap">
                    {message}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-gray-900 rotate-45 rounded-sm"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
