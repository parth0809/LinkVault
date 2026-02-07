import { useEffect, useState } from "react";

export default function Share() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      window.location.href = "/";
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

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
      setText("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">

      <main className="flex-grow flex items-center justify-center text-slate-900 dark:text-white">
        <div className="w-full max-w-lg p-6 rounded-xl shadow-md bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-semibold mb-4 text-center">Share</h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <textarea
              placeholder="Enter plain text (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
              rows={4}
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
        </div>
      </main>

    </div>
  );
}