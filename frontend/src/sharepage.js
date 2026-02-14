import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShareView() {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  
  const [savedPassword, setSavedPassword] = useState("");
  
  const [unlockMode, setUnlockMode] = useState(null); 

  useEffect(() => {
    fetch(`http://localhost:5000/share/${token}`)
      .then(async (res) => {
        const result = await res.json();

        if (!res.ok) {
          setError(result.message || "Link invalid");
          return;
        }

        if (result.requiresPassword) {
          setRequiresPassword(true);
          setUnlockMode("view"); 
        } else {
          setData(result);
        }
      })
      .catch(() => {
        setError("Link invalid or expired");
      });
  }, [token]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/share/${token}/unlock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Incorrect password");
        return;
      }

      setData(result);
      
      setSavedPassword(password);
      
      setRequiresPassword(false);
      setPassword(""); 

    } catch {
      setError("Something went wrong");
    }
  };

  const downloadWithPassword = async (pwd) => {
    try {
      const response = await fetch(
        `http://localhost:5000/share/${token}/download/unlock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
 
      const a = document.createElement("a");
      a.href = url;
      a.download = data?.file?.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      setRequiresPassword(false);
      setPassword("");
      setUnlockMode(null);

    } catch {
      setError("Download failed");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/share/${token}/download`
      );

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.requiresPassword) {
          if (savedPassword) {
            await downloadWithPassword(savedPassword);
          } else {
            setUnlockMode("download");
            setRequiresPassword(true);
            setPassword(""); 
          }
          return;
        }

        alert(result.message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = data.file?.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch {
      alert("Download failed");
    }
  };

  const handleProtectedDownloadForm = async (e) => {
    e.preventDefault();
    await downloadWithPassword(password);
  };

  const handleCopy = async () => {
    if (!data?.text) return;
    await navigator.clipboard.writeText(data.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error && !requiresPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!data && !requiresPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="max-w-3xl w-full p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg space-y-4">

        {requiresPassword && (
          <>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {unlockMode === "download" ? "Enter password to download" : "This link is password protected"}
            </h2>

            <form
              onSubmit={unlockMode === "download" ? handleProtectedDownloadForm : handleUnlock}
              className="space-y-4"
            >

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                required
              />

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                Unlock
              </button>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </form>
          </>
        )}

        {data && !requiresPassword && (
          <>
            {data.text && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Text
                  </h2>

                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-slate-700 dark:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>

                <pre className="whitespace-pre-wrap text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  {data.text}
                </pre>
              </>
            )}

            {data.file && (
              <button
                onClick={handleDownload}
                className="text-blue-600 underline"
              >
                Download file
              </button>
            )}

          </>
        )}

      </div>
    </div>
  );
}