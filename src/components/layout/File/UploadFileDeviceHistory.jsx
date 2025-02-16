import { useState } from 'react';
import { fetchFileByteHistory } from '@/service/fileService.js';

const UploadFileDeviceHistory = () => {
    const [changeResult, setChangeResult] = useState([{
        serial_number: "",
        change_point: "",
        change_type: "",
        before: "",
        after: "",
        before_size: "",
        after_size: "",
        date_index: ""
    }]);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setChangeResult()
    }

    return(
        <>

        </>
    )
}

export default UploadFileDeviceHistory;