import { useState } from "react";
import "./App.css";
import { ParserDemo } from "./components/ParserDemo";
import { ColorPreview } from "./components/ColorPreview";
import { ProxyPreview } from "./components/ProxyPreview";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

type AppMode = "interactive" | "proxy";

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("interactive");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1" />
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Tailwind Color Scheme Converter
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Transform your design system from one color palette to another
                  instantly
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <ThemeToggle />
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
                <button
                  onClick={() => setCurrentMode("interactive")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentMode === "interactive"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Interactive Editor
                </button>
                <button
                  onClick={() => setCurrentMode("proxy")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentMode === "proxy"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Website Preview
                </button>
              </div>
            </div>
          </header>

          {/* Mode Content */}
          {currentMode === "interactive" ? (
            <div>
              {/* Interactive Color Preview */}
              <ColorPreview />

              {/* Parser Demo Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <ParserDemo />
              </div>
            </div>
          ) : (
            <div>
              {/* Proxy Mode */}
              <ProxyPreview />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
