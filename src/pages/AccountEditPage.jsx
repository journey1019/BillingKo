import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAccounts, updateAccount } from "@/service/accountService";

const AccountEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        acct_num: "",
        acct_name: "",
        acct_resident_num: "",
        classification: "",
        invoice_address: "",
        invoice_address2: "",
        invoice_postcode: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAccount = async () => {
            try {
                const accounts = await fetchAccounts();
                const account = accounts.find((acct) => acct.id === id);
                if (account) setFormData(account);
            } catch (err) {
                setError(err.message);
            }
        };
        loadAccount();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAccount(id, formData);
            alert("Account updated successfully!");
            navigate("/accounts");
        } catch (err) {
            console.error(err.message);
        }
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto">
            <h1 className="text-lg font-bold mb-6">Edit Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form Fields */}
                <input
                    type="text"
                    name="acct_name"
                    value={formData.acct_name}
                    onChange={handleChange}
                    placeholder="Account Name"
                    className="w-full border rounded p-2"
                    required
                />
                {/* Other Fields */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default AccountEditPage;
