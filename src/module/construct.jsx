/**
 * @desc: grid-1 -> 버튼을 누르면 grid-1/3 / grid-2/3 로 나눠짐
 * */

import { useState } from 'react';

const GridToggleLayout = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleLayout = () => setIsExpanded(!isExpanded);

    return (
        <div className={`grid gap-4 ${isExpanded ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {/* Left Section */}
            <div className={`p-5 bg-blue-100 rounded-lg ${isExpanded ? 'col-span-1' : 'col-span-3'}`}>
                <h2 className="text-lg font-bold">Item 1</h2>
                <p>This is the main content area (Item 1).</p>
                <button
                    onClick={toggleLayout}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && (
                <div className="p-5 bg-green-100 rounded-lg col-span-2">
                    <h2 className="text-lg font-bold">Item 2</h2>
                    <p>This is the additional content area (Item 2).</p>
                </div>
            )}
        </div>
    );
};

export default GridToggleLayout;
