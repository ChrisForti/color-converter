import { useState } from 'react';
import { parseColorClasses } from '../utils/tailwind-parser';
import type { TailwindColorClass } from '../utils/tailwind-parser';

export function ParserDemo() {
  const [input, setInput] = useState(`<div className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-300">
  <h1 className="text-2xl text-blue-900 mb-4">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>`);

  const [parsedClasses, setParsedClasses] = useState<TailwindColorClass[]>([]);

  const handleParse = () => {
    const classes = parseColorClasses(input);
    setParsedClasses(classes);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔍 Tailwind Class Parser Demo
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input JSX/HTML:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Paste your JSX/HTML here..."
          />
          <button
            onClick={handleParse}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Parse Color Classes
          </button>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parsed Color Classes:
          </label>
          <div className="h-40 overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50">
            {parsedClasses.length > 0 ? (
              <div className="space-y-2">
                {parsedClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border text-sm"
                  >
                    <div className="font-mono font-bold text-blue-600">
                      {cls.full}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">
                      Property: <code>{cls.property}</code> • 
                      Color: <code>{cls.color}</code>
                      {cls.shade && (
                        <>
                          {' '}• Shade: <code>{cls.shade}</code>
                        </>
                      )}
                      {cls.modifiers.length > 0 && (
                        <>
                          {' '}• Modifiers: <code>{cls.modifiers.join(', ')}</code>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No color classes found. Click "Parse Color Classes" to analyze the input.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {parsedClasses.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Parser Statistics:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Total Classes:</span>
              <div className="text-2xl font-bold text-blue-900">{parsedClasses.length}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Unique Colors:</span>
              <div className="text-2xl font-bold text-blue-900">
                {new Set(parsedClasses.map(c => c.color)).size}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Properties:</span>
              <div className="text-2xl font-bold text-blue-900">
                {new Set(parsedClasses.map(c => c.property)).size}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">With Modifiers:</span>
              <div className="text-2xl font-bold text-blue-900">
                {parsedClasses.filter(c => c.modifiers.length > 0).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}