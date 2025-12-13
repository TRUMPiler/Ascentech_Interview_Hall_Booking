import { useState } from "react";
import Cookies from "js-cookie";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin123" && password === "adminpass123@") {
      Cookies.set("admin_auth", "true", { expires: 1 });
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-
900"
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full  bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <a href="/" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    &larr; Back to Home
                </a>
            </div>
        </div>
    </div>
  );
};

export default Login;