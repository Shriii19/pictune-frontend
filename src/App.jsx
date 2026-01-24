import { useState, useEffect } from "react";
import { 
  Upload, 
  Music, 
  Sparkles, 
  Globe, 
  Loader2,
  Image as ImageIcon,
  Palette
} from "lucide-react";

function App() {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/analyze-photo`, {
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

  const filteredSongs =
    result?.songs?.filter((song) => {
      if (languageFilter === "all") return true;
      return song.language?.toLowerCase() === languageFilter;
    }) || [];

  const languageOptions = [
    { id: "all", label: "All Languages", icon: <Globe className="w-4 h-4" /> },
    { id: "hindi", label: "Hindi", icon: <span className="text-lg">🇮🇳</span> },
    { id: "english", label: "English", icon: <span className="text-lg">🇺🇸</span> },
  ];

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <img 
              src="/logo.png" 
              alt="PicTune Logo" 
              className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PicTune
            </h1>
          </div>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Upload a photo and let AI analyze the mood to suggest perfect songs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Upload Photo</h2>
              </div>

              <label
                className={`block w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${preview ? 'h-64 md:h-[500px]' : 'h-48'}
                  ${isDragging 
                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
                    : "border-slate-600 hover:border-blue-400 hover:bg-slate-800/30"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center h-full p-6">
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-400 mb-4" />
                      <p className="text-center text-slate-300 font-medium">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-center text-slate-500 text-sm mt-2">
                        Supports JPG, PNG, WEBP
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Language Filter */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-slate-200">Preferred Language</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLanguageFilter(option.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                        ${languageFilter === option.id
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent shadow-lg"
                          : "bg-slate-800/50 border-slate-600 hover:border-blue-400/50 hover:bg-slate-800/80"
                        }`}
                    >
                      <div className="mb-1">{option.icon}</div>
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !photo}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                  ${!photo || loading
                    ? "bg-slate-700/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Mood...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Palette className="w-5 h-5" />
                    Detect Mood & Suggest Songs
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Mood Result Card */}
            {result && (
              <>
                <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-semibold">Detected Mood</h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                    <p className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                      {result.mood}
                    </p>
                  </div>
                </div>

                {/* Songs Card */}
                <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-semibold">Recommended Songs</h2>
                    <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-400/30">
                      {filteredSongs.length} songs
                    </span>
                  </div>

                  {filteredSongs.length === 0 ? (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No songs found for this language</p>
                      <p className="text-sm text-slate-500 mt-1">Try selecting "All Languages"</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {filteredSongs.map((song, idx) => (
                        <div
                          key={idx}
                          className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl p-4 transition-all hover:border-blue-400/30 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors">
                                    {song.title}
                                  </h4>
                                  <p className="text-sm text-slate-400 mt-1">
                                    {song.artist}
                                  </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/70 text-slate-300">
                                  {song.language}
                                </span>
                              </div>
                              
                              {/* Audio Features */}
                              {song.audioFeatures && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Tempo:</span>
                                    <span className="text-xs font-medium text-blue-300">
                                      {Math.round(song.audioFeatures.tempo)} BPM
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Energy:</span>
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                        style={{ width: `${song.audioFeatures.energy * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Mood:</span>
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                                        style={{ width: `${song.audioFeatures.valence * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Match:</span>
                                    <span className="text-xs font-bold text-green-400">
                                      {Math.round(song.audioFeatures.match_score * 100)}%
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {song.genre && (
                                <div className="mt-3 flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Genre:</span>
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                                    {song.genre}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {!result && !loading && (
              <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-8 text-center h-full flex items-center justify-center min-h-[300px]">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Music className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-slate-400">
                    Upload a photo and click "Detect Mood" to see song recommendations based on your image's mood
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by AI • Upload any image to discover matching music</p>
        </div>
      </div>
    </div>
  );
}

export default App;