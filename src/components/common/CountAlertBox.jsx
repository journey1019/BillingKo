// components/common/CountAlertBox.jsx
import { useEffect } from "react";
import { alertStyleMap } from "@/utils/alertStyleMap";


const CountAlertBox = ({ type = "info", message, onClose }) => {
    if (!message) return null;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                id="alert-floating"
                className={`flex items-center p-4 mb-4 text-sm rounded-lg ${alertStyleMap[type]?.wrapper}`}
                role="alert"
            >
                <svg className="shrink-0 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>

                <div className="ms-3 text-sm font-medium">{message}</div>

                <button
                    type="button"
                    onClick={onClose}
                    className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${alertStyleMap[type]?.button}`}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CountAlertBox;
