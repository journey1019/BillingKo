import React from 'react';
import InnerAccordion from '@/components/ui/Accordions/InnerAccordion.jsx';

const CostSummaryForm = ({ summary }) => {
    return (
        <InnerAccordion items={[
            {
                title: '상세 정보',
                content: (
                    <>
                        <div className="flex flex-row gap-4">
                            {Object.entries(summary).map(([spId, spData]) => (
                                <div key={spId} className="border rounded-lg shadow-sm p-4 w-full">
                                    <h3 className="text-md font-semibold text-blue-600">
                                        {spId} - {spDataAlias(spData.alias)}
                                    </h3>
                                    <hr className="my-2" />
                                    {Object.entries(spData.data).map(([profileId, profile]) => (
                                        <div key={profileId} className="mt-2 mb-4">
                                            <p className="text-xs text-gray-500">
                                                프로필 ID: {profileId} ({spDataAlias(profile.alias)})
                                            </p>
                                            <div
                                                className="max-h-48 overflow-y-auto pl-2 border border-gray-200 rounded mt-2">
                                                {Object.entries(profile.data).map(([serialNumber, fee]) => (
                                                    <div
                                                        key={serialNumber}
                                                        className="flex flex-row justify-between py-1"
                                                    >
                                                        <span className="text-xs">{serialNumber}</span>
                                                        <span className="text-xs font-medium">${fee.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm font-bold text-right mt-2">
                                                프로필 합계: ${profile.total_fee.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                    <p className="text-base font-bold text-right mt-2 text-orange-500">
                                        총합계: ${spData.total_fee.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )
            }
        ]}
        />
    );
};

const spDataAlias = (alias) => alias || 'Solution Provider';

export default CostSummaryForm;
