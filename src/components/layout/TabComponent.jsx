import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { MdArrowDropDown } from "react-icons/md";

const TabComponent = ({ tabs, drag }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 1);
    const [height, setHeight] = useState(650); // 초기 높이

    if (!tabs.length) return <p>No tabs available</p>;

    const tabContent = (
        <div className="w-full p-3 bg-white rounded-md shadow-lg h-full">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-2 mt-4 overflow-auto h-full">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );

    if (drag === 'Y') {
        return (
            <Rnd
                default={{
                    x: 0,
                    y: 0,
                    width: '100%',
                    height: height,
                }}
                enableResizing={{
                    bottom: true,
                }}
                disableDragging={true}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setHeight(ref.offsetHeight);
                }}
                resizeHandleComponent={{
                    bottom: (
                        <div
                            className="flex justify-center items-center cursor-ns-resize transition hover:bg-gray-200"
                            style={{
                                height: '36px',
                                marginTop: '-18px',
                                backgroundColor: '#eef1f8', // 은은한 회색 (tailwind: gray-100)
                                borderBottomLeftRadius: '8px',
                                borderBottomRightRadius: '8px',
                                boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <MdArrowDropDown size={40} color="#4B5563" />
                        </div>
                    ),
                }}

                style={{
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {tabContent}
            </Rnd>

        );
    }

    return tabContent;
};

export default TabComponent;
