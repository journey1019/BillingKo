import { postWithBody } from "./api"; // Body
import { get, getWithAuth, post, put, del } from "./api";


export const fetchInvoicePrint = async () => {
    try {
        return await getWithAuth(`/codeInfo/codeType/invoice_print`);
    } catch (error) {
        console.error("❌ Failed to fetch adjustment data:", error.response?.data || error.message);
        throw error;
    }
};