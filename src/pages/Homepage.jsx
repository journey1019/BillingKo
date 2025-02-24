import { BiBuildings } from "react-icons/bi";
import Move from '@/components/layout/main/Move.jsx';
import Stock from '@/components/layout/main/Stock.jsx';
import PdfInvoice from '@/components/PdfInvoice.jsx';
import InvoiceTemplateFiller from '@/components/InvoiceTemplateFiller.jsx';


const Homepage = () => {
    const user_name = localStorage.getItem("user_name");
    console.log(localStorage.getItem("token"))

    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                <div className="p-2 border border-2 border-gray-400 rounded-md">
                    <BiBuildings className="w-6 h-6 text-gray-600"/>
                </div>
                <div className="items-center text-xl font-semibold">Hello, {user_name}</div>
            </div>

            <Move />

            <Stock />

            <PdfInvoice/>

            <InvoiceTemplateFiller />
        </div>
    );
};

export default Homepage;
