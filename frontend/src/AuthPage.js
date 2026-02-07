import { useState } from "react";



export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "login"
      ? "http://localhost:5000/login"
      : "http://localhost:5000/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

         const expires = new Date();
        expires.setDate(expires.getDate() + 2);

        document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()}`;


      window.location.href = "/share";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs p-4 rounded-xl shadow-md bg-white dark:bg-slate-800">
      <h2 className="text-xl font-semibold text-center mb-4">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
          required
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-center mt-3">
        {mode === "login" ? "No account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {mode === "login" ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}