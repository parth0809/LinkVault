import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShareView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/share/${token}`)
      .then(res => {
        if (!res.ok) throw new Error("Link invalid or expired");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [token]);

  const handleCopy = async () => {
    if (!data?.text) return;
    await navigator.clipboard.writeText(data.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="max-w-3xl w-full p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg space-y-4">

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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
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
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
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
          <a
            href={`http://localhost:5000/${data.file.path}`}
            className="text-blue-600 underline"
            download
          >
            Download file
          </a>
        )}
      </div>
    </div>
  );
}
