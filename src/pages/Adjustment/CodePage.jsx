import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchCode, deleteCode } from '@/service/codeService.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { CodeTableColumns } from '@/columns/CodeTableColumns.jsx';
import CodeNewPage from '@/pages/Adjustment/CodeNewPage.jsx';


const CodePage = () => {
    const {data: codeData, loading: codeLoading, error: codeError, refetch: codeRefetch} = useApiFetch(fetchCode);
    const [selectedCodeId, setSelectedCodeId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);



    return(
        <>
            <div className={`grid gap-0 grid-cols-6`}>
                <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                    <h1 className="text-2xl font-base">Code Table</h1>
                </div>

                {/* Left */}
                <div className={`p-2 col-span-4`}>
                    <ReusableTable
                        data={codeData || []}
                        columns={CodeTableColumns}
                        isLoading={codeLoading}
                        error={codeError}
                    />
                </div>

                {/* Right */}
                <div className={`p-2 col-span-2`}>
                    <CodeNewPage />
                </div>
            </div>
        </>
    )
}

export default CodePage;