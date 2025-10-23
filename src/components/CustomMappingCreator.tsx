import { useState } from "react";
import {
  isValidTailwindColor,
  createColorMapping,
} from "../utils/color-mapper";
import type { ColorMapping } from "../utils/color-mapper";

interface CustomMappingCreatorProps {
  onMappingCreated: (mapping: ColorMapping, name: string) => void;
}

export function CustomMappingCreator({
  onMappingCreated,
}: CustomMappingCreatorProps) {
  const [mappingName, setMappingName] = useState("");
  const [mappings, setMappings] = useState<
    Array<{ from: string; to: string; id: string }>
  >([{ from: "", to: "", id: "1" }]);
  const [isVisible, setIsVisible] = useState(false);

  const addMapping = () => {
    const newId = (
      Math.max(...mappings.map((m) => parseInt(m.id))) + 1
    ).toString();
    setMappings([...mappings, { from: "", to: "", id: newId }]);
  };

  const removeMapping = (id: string) => {
    if (mappings.length > 1) {
      setMappings(mappings.filter((m) => m.id !== id));
    }
  };

  const updateMapping = (id: string, field: "from" | "to", value: string) => {
    setMappings(
      mappings.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const validateMapping = (
    from: string,
    to: string
  ): { isValid: boolean; error?: string } => {
    if (!from.trim() || !to.trim()) {
      return { isValid: false, error: "Both colors required" };
    }
    if (!isValidTailwindColor(from)) {
      return {
        isValid: false,
        error: `"${from}" is not a valid Tailwind color`,
      };
    }
    if (!isValidTailwindColor(to)) {
      return { isValid: false, error: `"${to}" is not a valid Tailwind color` };
    }
    return { isValid: true };
  };

  const createMapping = () => {
    if (!mappingName.trim()) {
      alert("Please enter a mapping name");
      return;
    }

    const validMappings: Record<string, string> = {};
    const errors: string[] = [];

    for (const mapping of mappings) {
      if (mapping.from.trim() && mapping.to.trim()) {
        const validation = validateMapping(mapping.from, mapping.to);
        if (validation.isValid) {
          validMappings[mapping.from] = mapping.to;
        } else {
          errors.push(`${mapping.from} -> ${mapping.to}: ${validation.error}`);
        }
      }
    }

    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }

    if (Object.keys(validMappings).length === 0) {
      alert("Please add at least one valid color mapping");
      return;
    }

    const finalMapping = createColorMapping(validMappings);
    onMappingCreated(finalMapping, mappingName);

    // Reset form
    setMappingName("");
    setMappings([{ from: "", to: "", id: "1" }]);
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-700 transition-colors"
      >
        Create Custom Mapping
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Create Custom Mapping
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Mapping Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mapping Name:
        </label>
        <input
          type="text"
          value={mappingName}
          onChange={(e) => setMappingName(e.target.value)}
          placeholder="e.g., My Custom Theme"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Color Mappings */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Mappings:
        </label>
        <div className="space-y-2">
          {mappings.map((mapping) => {
            return (
              <div key={mapping.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={mapping.from}
                  onChange={(e) =>
                    updateMapping(mapping.id, "from", e.target.value)
                  }
                  placeholder="From (e.g., blue)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="text"
                  value={mapping.to}
                  onChange={(e) =>
                    updateMapping(mapping.id, "to", e.target.value)
                  }
                  placeholder="To (e.g., purple)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {mappings.length > 1 && (
                  <button
                    onClick={() => removeMapping(mapping.id)}
                    className="px-2 py-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={addMapping}
          className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Another Mapping
        </button>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={createMapping}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Create Mapping
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">
          Valid Tailwind colors: red, blue, green, purple, gray, slate, etc.
        </p>
        <p>Example mappings: blue → purple, red → green, gray → slate</p>
      </div>
    </div>
  );
}
