import { useState } from "react";
import { parseColorClasses } from "../utils/tailwind-parser";
import { mapClassString, PRESET_MAPPINGS } from "../utils/color-mapper";
import type { ColorMappingConfig, ColorMapping } from "../utils/color-mapper";
import { CustomMappingCreator } from "./CustomMappingCreator";

export function ColorPreview() {
  const [selectedMapping, setSelectedMapping] =
    useState<string>("blue-to-purple");
  const [customMappings, setCustomMappings] = useState<
    Record<string, ColorMappingConfig>
  >({});
  const [inputHtml, setInputHtml] =
    useState(`<div className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg border-2 border-blue-300">
  <h2 className="text-2xl text-blue-900 mb-4">Sample Component</h2>
  <p className="text-gray-600 mb-4">This is some sample text content.</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Click Me
  </button>
  <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded">
    <strong>Alert:</strong> This is a red alert message.
  </div>
</div>`);

  // Combine preset and custom mappings with error handling
  const allMappings = { ...PRESET_MAPPINGS, ...customMappings };
  const currentMapping = allMappings[selectedMapping];
  
  // Safe conversion with error handling
  let convertedHtml = inputHtml;
  let conversionError = '';
  
  try {
    if (currentMapping && currentMapping.mappings) {
      convertedHtml = mapClassString(inputHtml, currentMapping.mappings);
    } else {
      conversionError = `Invalid mapping configuration for "${selectedMapping}"`;
      console.error('ColorPreview: Invalid mapping configuration', currentMapping);
    }
  } catch (error) {
    conversionError = `Error converting colors: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('ColorPreview: Conversion error', error);
    convertedHtml = inputHtml; // Fallback to original
  }

  // Handle custom mapping creation
  const handleCustomMappingCreated = (mapping: ColorMapping, name: string) => {
    const customKey = `custom-${Date.now()}`;
    const newCustomMapping: ColorMappingConfig = {
      name,
      mappings: mapping,
    };
    setCustomMappings((prev) => ({ ...prev, [customKey]: newCustomMapping }));
    setSelectedMapping(customKey); // Auto-select the new mapping
  };

  // Safe parsing with error handling
  let originalClasses: any[] = [];
  let convertedClasses: any[] = [];
  let parseError = '';

  try {
    originalClasses = parseColorClasses(inputHtml);
    convertedClasses = parseColorClasses(convertedHtml);
  } catch (error) {
    parseError = `Error parsing classes: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('ColorPreview: Parse error', error);
  }

  // Create renderable components (safe HTML substitution)
  const createRenderableHtml = (html: string) => {
    return html
      .replace(/className=/g, "class=")
      .replace(/class="([^"]*)"/g, (_, classes) => {
        return `style="display:block; margin:4px 0; padding:8px; border-radius:4px;" class="${classes}"`;
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Interactive Color Preview
      </h2>

      {/* Error Display */}
      {(conversionError || parseError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Error</h3>
          {conversionError && <p className="text-sm text-red-700 mb-1">{conversionError}</p>}
          {parseError && <p className="text-sm text-red-700">{parseError}</p>}
        </div>
      )}

      {/* Custom Mapping Creator */}
      <CustomMappingCreator onMappingCreated={handleCustomMappingCreated} />

      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Mapping:
        </label>
        <select
          value={selectedMapping}
          onChange={(e) => setSelectedMapping(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <optgroup label="Presets">
            {Object.entries(PRESET_MAPPINGS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </optgroup>
          {Object.keys(customMappings).length > 0 && (
            <optgroup label="Custom Mappings">
              {Object.entries(customMappings).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Input HTML Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input HTML/JSX:
        </label>
        <textarea
          value={inputHtml}
          onChange={(e) => setInputHtml(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your HTML/JSX here..."
        />
      </div>

      {/* Before/After Preview */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Original (Before)
          </h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-48">
            <div className="font-mono text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
              Classes: {originalClasses.length} color classes found
            </div>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: createRenderableHtml(
                  inputHtml.replace(/className=/g, "class=")
                ),
              }}
            />
          </div>
        </div>

        {/* Converted */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Converted (After)
          </h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-48">
            <div className="font-mono text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
              Mapping: {currentMapping.name} • {convertedClasses.length} color
              classes
            </div>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: createRenderableHtml(
                  convertedHtml.replace(/className=/g, "class=")
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Code Diff */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original Code */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Original Code:
          </h4>
          <pre className="text-xs bg-gray-100 border border-gray-200 rounded p-3 overflow-x-auto max-h-40">
            <code>{inputHtml}</code>
          </pre>
        </div>

        {/* Converted Code */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Converted Code:
          </h4>
          <pre className="text-xs bg-green-50 border border-green-200 rounded p-3 overflow-x-auto max-h-40">
            <code>{convertedHtml}</code>
          </pre>
        </div>
      </div>

      {/* Mapping Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3">
          Active Color Mappings:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {Object.entries(currentMapping.mappings)
            .slice(0, 8)
            .map(([from, to]) => (
              <div key={from} className="flex items-center space-x-2">
                <span className="font-mono text-blue-700">{from}</span>
                <span className="text-gray-400">→</span>
                <span className="font-mono text-purple-700">{to}</span>
              </div>
            ))}
          {Object.keys(currentMapping.mappings).length > 8 && (
            <div className="text-gray-500 text-xs">
              +{Object.keys(currentMapping.mappings).length - 8} more...
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {originalClasses.length}
          </div>
          <div className="text-sm text-gray-600">Original Classes</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {convertedClasses.length}
          </div>
          <div className="text-sm text-gray-600">Converted Classes</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(currentMapping.mappings).length}
          </div>
          <div className="text-sm text-gray-600">Mapping Rules</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {
              new Set(
                [...originalClasses, ...convertedClasses].map((c) => c.color)
              ).size
            }
          </div>
          <div className="text-sm text-gray-600">Unique Colors</div>
        </div>
      </div>
    </div>
  );
}
