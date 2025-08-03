const ResponseCard = ({ response }) => {
  return (
    <div className="mt-8 bg-gray-800 text-white rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-blue-400">💡 Answer</h2>
      <p className="text-gray-100 leading-relaxed">{response.answer}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-green-400 mb-2">📚 Sources</h3>
        <ul className="space-y-4">
          {response.sources.map((src, i) => (
            <li
              key={i}
              className="bg-gray-700/50 rounded-md p-4 border border-gray-600 transition hover:bg-gray-600/60"
            >
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Speaker:</span>{" "}
                {src.speaker || "N/A"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Time:</span>{" "}
                {src.start_time} – {src.end_time}
              </p>
              <p className="text-sm mt-2 text-gray-200 italic">“{src.content}”</p>
              <a
                href={src.audio_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-400 hover:text-blue-300 hover:underline text-sm transition"
              >
                🔗 Open Audio Source
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResponseCard;
