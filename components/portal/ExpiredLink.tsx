export function ExpiredLink() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a1a2e] px-6 py-8 text-center">
        <h1 className="text-white text-2xl font-light tracking-[0.2em] mb-2">
          THE DATE CREW
        </h1>
        <p className="text-[#a0a0b8] text-xs tracking-widest">
          MATCHMAKING · CURATED FOR YOU
        </p>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            This link has expired
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This link is no longer valid or has expired.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            Please contact your matchmaker for a new link.
          </p>
        </div>
      </div>
    </div>
  );
}
