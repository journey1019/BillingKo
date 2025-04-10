import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const NewButton = ({ to, label = 'New' }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition"
        >
            <FiPlus />
            <span>{label}</span>
        </button>
    );
};

export default NewButton;
