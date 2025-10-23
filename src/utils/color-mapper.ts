/**
 * Radically Simple Color Mapping Engine
 *
 * Applies color transformations to Tailwind classes using mapping configurations.
 * Smart shade preservation, semantic mappings, graceful fallbacks.
 */

export interface ColorMapping {
  [key: string]: string; // "blue-500": "purple-500" or "blue": "purple"
}

export interface ColorMappingConfig {
  name: string;
  mappings: ColorMapping;
  preserveShades?: boolean;
}

// Valid Tailwind colors for validation
const TAILWIND_COLORS = new Set([
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "white",
  "black",
  "transparent",
]);

const TAILWIND_SHADES = new Set([
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
]);

/**
 * Extract color name from a Tailwind class
 */
function extractColorInfo(
  className: string
): { prefix: string; color: string; shade?: string } | null {
  // Match patterns like bg-blue-500, text-red-400, border-gray-200
  const match = className.match(/^(.*?-)([a-z]+)(-\d+)?$/);
  if (!match) return null;

  const [, prefix, color, shadePart] = match;
  const shade = shadePart?.slice(1); // Remove the "-"

  if (!TAILWIND_COLORS.has(color)) return null;
  if (shade && !TAILWIND_SHADES.has(shade)) return null;

  return { prefix, color, shade };
}

/**
 * Smart color mapping with intelligent fallbacks
 */
export function mapColorClass(
  className: string,
  mapping: ColorMapping
): string {
  // 1. Direct exact match (highest priority)
  if (mapping[className]) {
    return mapping[className];
  }

  // 2. Extract color info for intelligent mapping
  const colorInfo = extractColorInfo(className);
  if (!colorInfo) return className;

  const { prefix, color, shade } = colorInfo;

  // 3. Look for color family mapping (blue -> purple)
  const targetColor = mapping[color];
  if (targetColor && TAILWIND_COLORS.has(targetColor)) {
    // Build new class with mapped color
    return shade
      ? `${prefix}${targetColor}-${shade}`
      : `${prefix}${targetColor}`;
  }

  // 4. Look for specific shade mapping with fallback
  if (shade) {
    const specificMapping = mapping[`${color}-${shade}`];
    if (specificMapping) {
      return `${prefix}${specificMapping}`;
    }

    // Try base color mapping if specific shade not found
    if (mapping[color]) {
      return `${prefix}${mapping[color]}-${shade}`;
    }
  }

  // 5. No mapping found - return original
  return className;
}

/**
 * Apply color mapping to a full class string (with modifiers)
 */
export function mapFullClass(
  fullClassName: string,
  mapping: ColorMapping
): string {
  const parts = fullClassName.split(":");
  const modifiers = parts.slice(0, -1);
  const baseClass = parts[parts.length - 1];

  const mappedBase = mapColorClass(baseClass, mapping);

  if (modifiers.length > 0) {
    return `${modifiers.join(":")}:${mappedBase}`;
  }

  return mappedBase;
}

/**
 * Apply color mapping to an entire class string (multiple classes)
 */
export function mapClassString(
  classString: string,
  mapping: ColorMapping
): string {
  return classString
    .split(/\s+/)
    .filter((cls) => cls.trim()) // Remove empty strings
    .map((cls) => mapFullClass(cls.trim(), mapping))
    .join(" ");
}

/**
 * Validate that a color name is a valid Tailwind color
 */
export function isValidTailwindColor(color: string): boolean {
  return TAILWIND_COLORS.has(color);
}

/**
 * Create a complete color mapping from base colors
 * Validates input and provides helpful error messages
 */
export function createColorMapping(
  colorMappings: Record<string, string>
): ColorMapping {
  const validMappings: ColorMapping = {};

  for (const [from, to] of Object.entries(colorMappings)) {
    // Validate source color
    if (!isValidTailwindColor(from)) {
      console.warn(`Invalid source color "${from}" - skipping mapping`);
      continue;
    }

    // Validate target color
    if (!isValidTailwindColor(to)) {
      console.warn(
        `Invalid target color "${to}" for mapping "${from}" -> "${to}" - skipping`
      );
      continue;
    }

    validMappings[from] = to;
  }

  return validMappings;
}

/**
 * Get statistics about a color mapping
 */
export function getMappingStats(mapping: ColorMapping): {
  totalMappings: number;
  sourceColors: string[];
  targetColors: string[];
} {
  const sourceColors = Object.keys(mapping);
  const targetColors = [...new Set(Object.values(mapping))];

  return {
    totalMappings: sourceColors.length,
    sourceColors,
    targetColors,
  };
}

/**
 * Built-in color mapping presets
 */
export const PRESET_MAPPINGS: Record<string, ColorMappingConfig> = {
  "blue-to-purple": {
    name: "Blue to Purple",
    mappings: createColorMapping({ blue: "purple" }),
  },

  "red-to-green": {
    name: "Red to Green",
    mappings: createColorMapping({ red: "green" }),
  },

  "gray-to-slate": {
    name: "Gray to Slate",
    mappings: createColorMapping({ gray: "slate" }),
  },

  "warm-theme": {
    name: "Cool to Warm Theme",
    mappings: createColorMapping({
      blue: "orange",
      teal: "amber",
      gray: "stone",
    }),
  },

  "nature-theme": {
    name: "Tech to Nature",
    mappings: createColorMapping({
      blue: "green",
      purple: "emerald",
      gray: "stone",
      red: "amber",
    }),
  },

  "minimal-theme": {
    name: "Color to Grayscale",
    mappings: createColorMapping({
      red: "gray",
      blue: "slate",
      green: "zinc",
      purple: "neutral",
      orange: "stone",
    }),
  },
};
