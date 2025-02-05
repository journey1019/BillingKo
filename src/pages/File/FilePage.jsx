import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { fetchFileUpdateHistory } from '@/service/fileService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { FileUpdateTableColumns } from '@/columns/FileUpdateTableColumns.jsx';
import { FileTableOptions } from '@/options/FileTableOptions.jsx';

const FilePage = () => {
    const navigate = useNavigate();

    // file update history data
    const [fileHistory, setFileHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getFileHistory = async () => {
            try {
                const data = await fetchFileUpdateHistory();
                setFileHistory(data);
            } catch (err) {
                setError('파일 이력을 가져오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        getFileHistory();
    }, []);

    if (loading) return <LoadingSpinner/>;
    if (error) return <p className="text-red-500">{error}</p>;

    return(
        <div className="grid grid-cols-3">
            <h1>File </h1>
            <div className="grid col-span-3">
                <div>
                    <button onClick={() => navigate('/file/upload')} className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition mr-4">
                        <FiPlus />
                        <span>Upload</span>
                    </button>
                </div>
            </div>
            <div className="grid col-span-1">
                <h1 className="py-1 text-lg font-bold">File Updated History</h1>
                <ReusableTable
                    data={fileHistory}
                    columns={FileUpdateTableColumns}
                    options={{
                        ...FileTableOptions,
                    }}
                />
            </div>
            <div>
                <p>CDR Table</p>
                <p>NetworkReport Table</p>
                <p>Account Table</p>
                <p>Device Table</p>
                <p>PPlan Table</p>
            </div>
        </div>
    )
}

export default FilePage;