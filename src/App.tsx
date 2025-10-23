import "./App.css";
import { ParserDemo } from "./components/ParserDemo";
import { ColorPreview } from "./components/ColorPreview";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
                <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tailwind Color Scheme Converter
          </h1>
          <p className="text-gray-600">
            Transform your design system from one color palette to another instantly
          </p>
        </header>

        {/* Interactive Color Preview */}
        <ColorPreview />

        {/* Parser Demo Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <ParserDemo />
        </div>
      </div>
    </div>
  );
}

export default App;
