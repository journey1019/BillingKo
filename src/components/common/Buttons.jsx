import { useState, useEffect } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal.jsx';

const Buttons = () => {
    // Modal
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="inline-flex rounded-md shadow-xs items-center" role="group">
                <button type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        onClick={() => setShowModal(true)}
                >
                    <MdModeEditOutline className="mr-3" />
                    Edit
                </button>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div>
                        This is the content inside the modal.
                    </div>
                </Modal>
            </div>

        </>
    );
};

export default Buttons;
