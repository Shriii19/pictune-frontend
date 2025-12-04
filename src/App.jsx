import { useState } from "react";

function App() {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      alert("Please select a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    setLoading(true);
    setResult(null);

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch("http://localhost:5000/analyze-photo", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let msg = `Server error: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.error) msg = errData.error;
        } catch (_) {}
        alert(msg);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      if (err.name === 'AbortError') {
        alert("Request timed out. Please try again.");
      } else {
        alert("Failed to analyze image: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter songs based on selected language
  const filteredSongs =
    result?.songs?.filter((song) => {
      if (languageFilter === "all") return true;
      return song.language?.toLowerCase() === languageFilter;
    }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            PicTune <span className="text-indigo-400">🎵📸</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Upload a photo and let AI guess the mood.
          </p>
        </div>

        {/* Upload section */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-900/60 hover:border-indigo-400 hover:bg-slate-900 transition">
          <div className="flex flex-col items-center justify-center pt-4 pb-5">
            <p className="mb-2 text-sm text-slate-300">
              <span className="font-semibold">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-slate-500">PNG, JPG or JPEG</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-5">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Preview</h3>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-64 object-cover"
              />
            </div>
          </div>
        )}

        {/* Language Filter */}
        <div className="mt-5">
          <p className="text-xs font-medium text-slate-400 mb-2">
            Preferred language
          </p>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setLanguageFilter("all")}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                languageFilter === "all"
                  ? "bg-indigo-500 border-indigo-400 text-white"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setLanguageFilter("hindi")}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                languageFilter === "hindi"
                  ? "bg-indigo-500 border-indigo-400 text-white"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              Hindi
            </button>
            <button
              onClick={() => setLanguageFilter("english")}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                languageFilter === "english"
                  ? "bg-indigo-500 border-indigo-400 text-white"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          disabled={loading}
        >
          {loading ? "Analyzing photo..." : "Detect Mood"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-200">
              Detected Mood:
            </h3>

            <p className="mt-1 text-lg font-bold text-indigo-300">
              {result.mood}
            </p>

            {/* Labels */}
            <h4 className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Labels from AI
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Songs */}
            <h4 className="mt-5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Suggested Songs
            </h4>
            {filteredSongs.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                No songs for this language. Try &quot;Both&quot;.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {filteredSongs.map((song, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-100">
                        {song.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {song.artist} • {song.language}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
