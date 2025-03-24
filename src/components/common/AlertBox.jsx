import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const typeStyles = {
    info: {
        text: "text-blue-800",
        bg: "bg-blue-50",
        border: "border-blue-300",
        darkText: "dark:text-blue-400",
        darkBorder: "dark:border-blue-800",
        icon: "text-blue-500",
    },
    danger: {
        text: "text-red-800",
        bg: "bg-red-50",
        border: "border-red-300",
        darkText: "dark:text-red-400",
        darkBorder: "dark:border-red-800",
        icon: "text-red-500",
    },
    success: {
        text: "text-green-800",
        bg: "bg-green-50",
        border: "border-green-300",
        darkText: "dark:text-green-400",
        darkBorder: "dark:border-green-800",
        icon: "text-green-500",
    },
    warning: {
        text: "text-yellow-800",
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        darkText: "dark:text-yellow-300",
        darkBorder: "dark:border-yellow-800",
        icon: "text-yellow-500",
    },
    dark: {
        text: "text-gray-800",
        bg: "bg-gray-50",
        border: "border-gray-300",
        darkText: "dark:text-gray-300",
        darkBorder: "dark:border-gray-600",
        icon: "text-gray-500",
    },
};

const AlertBox = ({ type = "info", title, message }) => {
    const style = typeStyles[type] || typeStyles.info;

    return (
        <div
            className={`fixed bottom-4 left-4 z-50 w-fit max-w-sm flex items-center p-4 text-sm 
                        ${style.text} border ${style.border} rounded-lg ${style.bg} 
                        dark:bg-gray-800 ${style.darkText} ${style.darkBorder} shadow-lg`}
            role="alert"
        >
            <FaInfoCircle className={`shrink-0 inline w-4 h-4 me-3 ${style.icon}`} />
            <span className="sr-only">{type}</span>
            <div>
                <span className="font-medium">{title}</span> {message}
            </div>
        </div>
    );
    // return (
    //     <div
    //         className={`flex items-center p-4 mb-4 text-sm ${style.text} border ${style.border} rounded-lg ${style.bg} dark:bg-gray-800 ${style.darkText} ${style.darkBorder}`}
    //         role="alert"
    //     >
    //         <FaInfoCircle className={`shrink-0 inline w-4 h-4 me-3 ${style.icon}`} />
    //         <span className="sr-only">{type}</span>
    //         <div>
    //             <span className="font-medium">{title}</span> {message}
    //         </div>
    //     </div>
    // );
};

export default AlertBox;




/**
 * <AlertBox type="info" title="Info alert!" message="Change a few things up and try submitting again." />
 * <AlertBox type="danger" title="Danger alert!" message="Something went wrong. Please try again." />
 * <AlertBox type="success" title="Success alert!" message="Your changes have been saved!" />
 * <AlertBox type="warning" title="Warning alert!" message="Double-check your input values." />
 * <AlertBox type="dark" title="Dark alert!" message="This is a neutral message." />
 * */