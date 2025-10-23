/**
 * Simple Tailwind Color Class Parser
 *
 * Focuses on extracting color-related classes with minimal complexity.
 * Handles the most common patterns without over-engineering.
 */

export interface TailwindColorClass {
  original: string; // "bg-blue-500"
  property: string; // "bg"
  color: string; // "blue"
  shade: string; // "500"
  modifiers: string[]; // ["hover", "md", "dark"]
  full: string; // "md:hover:bg-blue-500"
}

/**
 * Known Tailwind color properties that we want to parse
 */
const COLOR_PROPERTIES = [
  "bg",
  "text",
  "border",
  "ring",
  "outline",
  "from",
  "to",
  "via", // gradients
  "accent",
  "caret",
  "fill",
  "stroke",
];

/**
 * Common Tailwind colors (we'll expand this as needed)
 */
const TAILWIND_COLORS = [
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
];

/**
 * Common shade values
 */
const TAILWIND_SHADES = [
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
];

/**
 * Extract Tailwind color classes from a string of text
 */
export function parseColorClasses(input: string): TailwindColorClass[] {
  const results: TailwindColorClass[] = [];

  // Simple regex to match class-like patterns
  // Matches: className="..." or class="..." content
  const classMatches = input.match(/class(?:Name)?=["'`]([^"'`]*)["'`]/g);

  if (!classMatches) return results;

  // Extract all classes from matched strings
  const allClasses: string[] = [];
  classMatches.forEach((match) => {
    const classContent = match
      .replace(/class(?:Name)?=["'`]/, "")
      .replace(/["'`]$/, "");
    allClasses.push(...classContent.split(/\s+/).filter(Boolean));
  });

  // Parse each class for color patterns
  allClasses.forEach((className) => {
    const colorClass = parseColorClass(className);
    if (colorClass) {
      results.push(colorClass);
    }
  });

  return results;
}

/**
 * Parse a single class name for color patterns
 */
export function parseColorClass(className: string): TailwindColorClass | null {
  if (!className.trim()) return null;

  // Split by colons to handle modifiers (hover:, md:, dark:, etc.)
  const parts = className.split(":");
  const actualClass = parts[parts.length - 1]; // Last part is the actual class
  const modifiers = parts.slice(0, -1); // Everything before is modifiers

  // Check if this looks like a color class
  for (const property of COLOR_PROPERTIES) {
    for (const color of TAILWIND_COLORS) {
      for (const shade of TAILWIND_SHADES) {
        const pattern = `${property}-${color}-${shade}`;
        if (actualClass === pattern) {
          return {
            original: actualClass,
            property,
            color,
            shade,
            modifiers,
            full: className,
          };
        }
      }

      // Also check for classes without shades (like bg-white, text-black)
      const simplePattern = `${property}-${color}`;
      if (actualClass === simplePattern) {
        return {
          original: actualClass,
          property,
          color,
          shade: "",
          modifiers,
          full: className,
        };
      }
    }

    // Handle special cases like bg-white, bg-black, text-transparent
    const specialColors = [
      "white",
      "black",
      "transparent",
      "current",
      "inherit",
    ];
    for (const specialColor of specialColors) {
      const specialPattern = `${property}-${specialColor}`;
      if (actualClass === specialPattern) {
        return {
          original: actualClass,
          property,
          color: specialColor,
          shade: "",
          modifiers,
          full: className,
        };
      }
    }
  }

  return null;
}

/**
 * Parse color classes from file content (for CLI/file processing)
 */
export function parseFileContent(content: string): TailwindColorClass[] {
  return parseColorClasses(content);
}

/**
 * Get unique color classes (remove duplicates)
 */
export function getUniqueColorClasses(
  classes: TailwindColorClass[]
): TailwindColorClass[] {
  const seen = new Set<string>();
  return classes.filter((cls) => {
    if (seen.has(cls.full)) return false;
    seen.add(cls.full);
    return true;
  });
}
