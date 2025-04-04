import { useState } from "react";

const Modal = ({ show, onClose, children }) => {
    if (!show) return null; // 모달이 보이지 않을 때 렌더링하지 않음

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] p-6 rounded-lg shadow-lg relative overflow-y-auto">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>

                {/* ✅ 스크롤이 필요한 컨텐츠 영역 */}
                <div className="max-h-[70vh] overflow-y-auto p-2">
                    {children}
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;


// import { useState } from "react";
//
// const Modal = ({ show, onClose, children }) => {
//     if (!show) return null; // 모달이 보이지 않을 때 렌더링하지 않음
//
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
//                 >
//                     &times;
//                 </button>
//                 <div className="mb-4">
//                     {children}
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
//                     >
//                         Close
//                     </button>
//                     {/*<button*/}
//                     {/*    onClick={() => alert('Action performed!')}*/}
//                     {/*    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"*/}
//                     {/*>*/}
//                     {/*    Confirm*/}
//                     {/*</button>*/}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Modal;
