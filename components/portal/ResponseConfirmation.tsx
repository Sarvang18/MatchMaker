interface ResponseConfirmationProps {
  response: 'INTERESTED' | 'NOT_INTERESTED';
}

export function ResponseConfirmation({ response }: ResponseConfirmationProps) {
  const isInterested = response === 'INTERESTED';

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

      {/* Confirmation Content */}
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          {isInterested ? (
            <>
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Wonderful! 🎉
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Your matchmaker has been notified.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                They will be in touch with you very soon to arrange an introduction.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🙏</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Thank you for letting us know
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We will continue searching for your perfect match.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our matchmaker will be in touch soon.
              </p>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">— The Date Crew Team</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a2e] px-6 py-6 text-center mt-12">
        <p className="text-gray-500 text-xs">
          © 2025 The Date Crew · Crafting meaningful connections
        </p>
      </div>
    </div>
  );
}
