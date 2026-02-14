import { useEffect, useState } from "react";


export default function Share() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxViews, setMaxViews] = useState(100);
  const [maxDownloads, setMaxDownloads] = useState(100);
  const [myUploads, setMyUploads] = useState([]);
  const [sharePassword, setSharePassword] = useState("");

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "video/mp4",
    "application/zip",
    "text/plain"
  ];

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      window.location.href = "/";
    }

    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    try {
      const res = await fetch("http://localhost:5000/my-uploads", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMyUploads(data);
      }
    } catch (err) {
      console.error("Failed to fetch uploads");
    }
  };

  const handleDelete = async (id) => {

    try {
      const res = await fetch(
        `http://localhost:5000/upload/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setMyUploads(prev =>
          prev.filter(item => item._id !== id)
        );
      }
    } catch (err) {

    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setShareLink("");
    setExpiresAt("");

    if (!text && !file) {
      setMessage("Please provide text or select a file");
      return;
    }

    if (text && file) {
      setMessage("Upload either text OR file, not both");
      return;
    }

    


    const formData = new FormData();

    if (text) {
      formData.append("text", text);
      formData.append("maxViews", maxViews);
    }

    if (file) {
      formData.append("file", file);
      formData.append("maxDownloads", maxDownloads);
    }

    if (expiry) {
      formData.append("expiry", new Date(expiry).toISOString());
    }
    if (sharePassword) {
      formData.append("sharePassword", sharePassword);
    }
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
      setExpiresAt(data.expiresAt);

      setText("");
      setFile(null);
      setExpiry("");
      setMaxViews(100);
      setMaxDownloads(100);
      setSharePassword("");
      e.target.reset();

      fetchMyUploads();

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden text-slate-900 dark:text-white">

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl p-10 rounded-3xl shadow-lg bg-white dark:bg-slate-800">
          <h2 className="text-4xl font-semibold mb-8 text-center">
            Share
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">

            <textarea
              placeholder="Enter plain text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value) {
                  setFile(null);
                }
              }}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
              rows={8}
            />

            <div className="text-center text-sm text-slate-500">OR</div>

            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (!selectedFile) return;

                if (selectedFile.size > MAX_FILE_SIZE) {
                  setMessage("File size exceeds 50MB limit.");
                  e.target.value = "";
                  return;
                }

                if (!allowedTypes.includes(selectedFile.type)) {
                  setMessage("Unsupported file type.");
                  e.target.value = "";
                  return;
                }

                setFile(selectedFile);
                setText("");
                setMessage("");
              }}
              className="w-full"
            />

            <input
              type="datetime-local"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
            />
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">
                Password (Optional)
              </label>

              <input
                type="password"
                placeholder="Enter password to protect link"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>

            {text && (
              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Maximum Views
                </label>

                <input
                  type="number"
                  min="1"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMaxViews(1)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    View Once
                  </button>

                </div>
              </div>
            )}


            {file && (
              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Maximum Downloads
                </label>

                <input
                  type="number"
                  min="1"
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMaxDownloads(1)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Download Once
                  </button>
                </div>
              </div>
            )}


            {message && (
              <p className={`text-sm ${message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
                }`}>
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
            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 ">
              <a
                href={`${window.location.origin}${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {window.location.origin}{shareLink}
              </a>

              {expiresAt && (
                <p className="text-xs mt-2 text-slate-500">
                  Expires: {new Date(expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 border-l border-slate-300 dark:border-slate-700 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <h3 className="text-xl font-semibold mb-4">
          Your Links
        </h3>

        {myUploads.length === 0 && (
          <p className="text-sm text-slate-500">
            No uploads yet.
          </p>
        )}

        {myUploads.map((item) => (
          <div
            key={item._id}
            className="mb-4 p-4 rounded-lg bg-white dark:bg-slate-800 shadow"
          >
            <a
              href={`${window.location.origin}/share/${item.shareToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-all text-sm"
            >
              {window.location.origin}/share/{item.shareToken}
            </a>

            <div className="text-xs text-slate-500 mt-2">
              Expires: {new Date(item.expiresAt).toLocaleString()}
            </div>

            <div className="text-xs text-slate-500">
              Views: {item.currentViews / 2}/{item.maxViews}
            </div>

            <div className="text-xs text-slate-500">
              Downloads: {item.currentDownloads}/{item.maxDownloads}
            </div>

            <button
              onClick={() => handleDelete(item._id)}
              className="mt-3 px-3 py-1 text-xs bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
