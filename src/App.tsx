import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Color Scheme Converter
          </h1>
          <p className="text-lg text-gray-600">
            Transform your Tailwind color schemes with ease
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sample Card 1 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Original Theme
            </h2>
            <div className="space-y-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full transition-colors">
                Primary Button
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full transition-colors">
                Secondary Button
              </button>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-800 text-sm">
                  This is an info message with blue theme
                </p>
              </div>
            </div>
          </div>

          {/* Sample Card 2 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">
              Converted Theme
            </h2>
            <div className="space-y-3">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-full transition-colors">
                Primary Button
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full transition-colors">
                Secondary Button
              </button>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-purple-800 text-sm">
                  This is an info message with purple theme
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="btn-primary">
            Start Converting Colors
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
