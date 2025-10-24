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

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const createMapping = () => {
    const errors: string[] = [];

    // Validate mapping name
    if (!mappingName.trim()) {
      errors.push("Please enter a mapping name");
    } else if (mappingName.trim().length > 50) {
      errors.push("Mapping name must be 50 characters or less");
    }

    const validMappings: Record<string, string> = {};
    const duplicateCheck = new Set<string>();

    for (const mapping of mappings) {
      if (mapping.from.trim() && mapping.to.trim()) {
        // Check for duplicates
        if (duplicateCheck.has(mapping.from.trim())) {
          errors.push(`Duplicate source color: "${mapping.from}"`);
          continue;
        }
        duplicateCheck.add(mapping.from.trim());

        const validation = validateMapping(mapping.from, mapping.to);
        if (validation.isValid) {
          validMappings[mapping.from.trim()] = mapping.to.trim();
        } else {
          errors.push(`${mapping.from} → ${mapping.to}: ${validation.error}`);
        }
      }
    }

    if (Object.keys(validMappings).length === 0 && errors.length === 0) {
      errors.push("Please add at least one valid color mapping");
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      return; // Don't create mapping if there are errors
    }

    try {
      const finalMapping = createColorMapping(validMappings);
      onMappingCreated(finalMapping, mappingName.trim());

      // Reset form
      setMappingName("");
      setMappings([{ from: "", to: "", id: "1" }]);
      setValidationErrors([]);
      setIsVisible(false);
    } catch (error) {
      setValidationErrors([
        `Error creating mapping: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ]);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 transition-colors"
      >
        Create Custom Mapping
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Create Custom Mapping
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Mapping Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mapping Name:
        </label>
        <input
          type="text"
          value={mappingName}
          onChange={(e) => setMappingName(e.target.value)}
          placeholder="e.g., My Custom Theme"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      {/* Color Mappings */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
                <span className="text-gray-400 dark:text-gray-500">→</span>
                <input
                  type="text"
                  value={mapping.to}
                  onChange={(e) =>
                    updateMapping(mapping.id, "to", e.target.value)
                  }
                  placeholder="To (e.g., purple)"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
                {mappings.length > 1 && (
                  <button
                    onClick={() => removeMapping(mapping.id)}
                    className="px-2 py-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
          className="mt-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          + Add Another Mapping
        </button>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
            Validation Errors:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={createMapping}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md transition-colors"
        >
          Create Mapping
        </button>
        <button
          onClick={() => {
            setIsVisible(false);
            setValidationErrors([]);
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1">
          Valid Tailwind colors: red, blue, green, purple, gray, slate, etc.
        </p>
        <p>Example mappings: blue → purple, red → green, gray → slate</p>
      </div>
    </div>
  );
}
