import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShareView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/share/${token}`)
      .then(res => {
        if (!res.ok) throw new Error("Link invalid or expired");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [token]);

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
      <div className="max-w-3xl w-full p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg">
        {data.text && (
          <pre className="whitespace-pre-wrap text-slate-900 dark:text-white">
            {data.text}
          </pre>
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
