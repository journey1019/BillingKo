import { useState } from 'react';
import { Rnd } from 'react-rnd';

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
                    bottom: true, // 아래 방향만 리사이징 가능
                }}
                disableDragging={true} // 드래그 이동 비활성화
                onResizeStop={(e, direction, ref, delta, position) => {
                    setHeight(ref.offsetHeight);
                }}
                style={{
                    width: '100%',
                    position: 'relative', // 🔥 문맥 내 배치
                }}
            >
                {tabContent}
            </Rnd>
        );
    }

    return tabContent;
};

export default TabComponent;
