// src/components/ResponseCard.jsx
const ResponseCard = ({ response }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">💡 Answer</h2>
      <p className="text-gray-200 leading-relaxed">{response.answer}</p>

      {response.sources?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            📚 Sources
          </h3>
          <ul className="space-y-4">
            {response.sources.map((src, i) => (
              <li
                key={i}
                className="bg-gray-800/60 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Speaker:</span>{" "}
                    {src.speaker || "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">
                    ⏱ {src.start_time} – {src.end_time}
                  </p>
                </div>
                <p className="text-sm mt-3 text-gray-200 italic">
                  “{src.content}”
                </p>
                <a
                  href={src.audio_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-400 hover:text-blue-300 underline text-sm transition"
                >
                  🔗 Listen to segment
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResponseCard;
