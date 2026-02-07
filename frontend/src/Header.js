export default function Header({ darkMode, setDarkMode }) {
  const hasToken = document.cookie.includes("token=");

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";

    window.location.href = "/";
  };

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
      <h1 className="text-lg font-semibold">LinkVault</h1>

      <div className="flex items-center gap-3">

        {setDarkMode && (
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="text-sm px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        )}

        {hasToken && (
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}