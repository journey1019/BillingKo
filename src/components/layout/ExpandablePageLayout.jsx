// components/layouts/ExpandablePageLayout.jsx
import { IoMdClose } from 'react-icons/io';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';

export default function ExpandablePageLayout({
                                                 title,
                                                 isExpanded,
                                                 leftTitle,
                                                 newButtonTo,
                                                 onExportCSV,
                                                 onExportExcel,
                                                 onRefresh,
                                                 table,
                                                 selectedId,
                                                 onClose,
                                                 rightTitle,
                                                 entityType,
                                                 editSelectedId,
                                                 deleteData,
                                                 handleDelete,
                                                 rightTabs
                                             }) {
    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">{title}</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">{leftTitle}</h1>
                    <div className="flex space-x-2 items-center">
                        {newButtonTo && <NewButton to={newButtonTo} />}
                        <DataActionDropdown
                            onExportCSV={onExportCSV}
                            onExportExcel={onExportExcel}
                            onRefresh={onRefresh}
                        />
                    </div>
                </div>

                {/* Bottom */}
                {table}
            </div>

            {/* Right Section */}
            {isExpanded && selectedId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <h2 className="py-1 text-lg font-bold">{rightTitle}</h2>
                            <div className="flex flex-row">
                                <ButtonGroup
                                    entityType={entityType}
                                    id={editSelectedId}
                                    deleteFunction={deleteData}
                                    onDeleteSuccess={handleDelete}  // 삭제 후 리프레시 콜백 전달
                                />
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-md text-black hover:text-gray-500"
                                    >
                                        <IoMdClose />
                                    </button>
                                )}
                            </div>
                        </div>

                        <TabComponent tabs={rightTabs} />
                    </div>
                </div>
            )}
        </div>
    );
}
