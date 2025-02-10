import { useState } from 'react';

const TabComponent = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 1); // 기본 첫 번째 탭 활성화

    return (
        <div className="w-full p-3 bg-white rounded-md shadow-lg">
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
            <div className="p-2 rounded-md bg-white mt-4">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default TabComponent;
