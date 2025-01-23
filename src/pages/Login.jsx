import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/service/authService";

const Login = () => {
    const [userId, setUserId] = useState(""); // 사용자 ID
    const [userPw, setUserPw] = useState(""); // 사용자 PW
    const [error, setError] = useState(""); // 에러 메시지
    const navigate = useNavigate(); // 페이지 이동

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        setError("");  // 기존 에러 초기화

        try {
            const data = await login(userId, userPw);

            // 받은 데이터 출력 (로그인 성공 시)
            console.log("Login Success:", data);

            // 토큰 저장 (예: localStorage)
            localStorage.setItem("token", data.user_token);

            // 로그인 성공 후 홈페이지로 리다이렉션
            navigate("/");
        } catch (err) {
            // 에러 메시지 출력
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="userId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            User ID
                        </label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="userPw"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="userPw"
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
