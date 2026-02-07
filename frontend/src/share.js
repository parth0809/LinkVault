import { useEffect, useState } from "react";

export default function Share() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      window.location.href = "/";
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setShareLink("");

    if (!text && !file) {
      setMessage("Please provide text or select a file");
      return;
    }

    if (text && file) {
      setMessage("Upload either text OR a file, not both");
      return;
    }

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("Upload successful !!");
      setShareLink(data.link); 
      setText("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow flex items-center justify-center text-slate-900 dark:text-white">
       <div className="w-full max-w-6xl p-12 rounded-3xl shadow-lg bg-white dark:bg-slate-800">
          <h2 className="text-5xl font-semibold mb-9 text-center">Share</h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <textarea
              placeholder="Enter plain text (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
              rows={10}
            />

            <div className="text-center text-sm text-slate-500">OR</div>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm"
            />

            {message && (
              <p className={`text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            >
              Upload
            </button>
          </form>
          {shareLink && (
          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              Shareable link
            </p>

            <a
              href={`${window.location.origin}${shareLink}`}
              className="break-all text-blue-600 dark:text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${window.location.origin}${shareLink}`}
            </a>
          </div>
        )}

        </div>
      </main>

    </div>
  );
}