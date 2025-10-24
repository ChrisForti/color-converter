import { useState, useEffect } from "react";
import { PRESET_MAPPINGS } from "../utils/color-mapper";
import type { ColorMappingConfig, ColorMapping } from "../utils/color-mapper";
import { CustomMappingCreator } from "./CustomMappingCreator";

export function ProxyPreview() {
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedMapping, setSelectedMapping] =
    useState<string>("blue-to-purple");
  const [customMappings, setCustomMappings] = useState<
    Record<string, ColorMappingConfig>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [lastMappingUpdate, setLastMappingUpdate] = useState<number>(0);

  // Combine preset and custom mappings
  const allMappings = { ...PRESET_MAPPINGS, ...customMappings };
  const currentMapping = allMappings[selectedMapping];

  // Handle custom mapping creation
  const handleCustomMappingCreated = (mapping: ColorMapping, name: string) => {
    const customKey = `custom-${Date.now()}`;
    const newCustomMapping: ColorMappingConfig = {
      name,
      mappings: mapping,
    };
    setCustomMappings((prev) => ({ ...prev, [customKey]: newCustomMapping }));
    setSelectedMapping(customKey);
  };

  // Function to inject CSS into iframe
  const injectCssIntoIframe = (
    iframe: HTMLIFrameElement,
    forceRefresh = false
  ) => {
    try {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        // Always remove existing styles first - be more aggressive
        const existingStyles = iframeDoc.querySelectorAll(
          '#color-converter-overrides, style[data-color-converter], [id*="color"], [class*="color-converter"]'
        );
        existingStyles.forEach((style) => {
          console.log(
            "🗑️ Removing existing style:",
            style.id || style.className
          );
          style.remove();
        });

        if (forceRefresh) {
          console.log("🔄 Force refreshing CSS injection...");
        }

        // Create a unique ID to ensure we can track this specific injection
        const injectionId = `color-converter-${Date.now()}`;
        const activeMapping = allMappings[selectedMapping];

        // Create and inject new styles
        const styleElement = iframeDoc.createElement("style");
        styleElement.id = injectionId;
        styleElement.setAttribute("data-color-converter", "true");
        styleElement.setAttribute("data-mapping", selectedMapping);
        styleElement.textContent = `
          /* Tailwind Color Converter Overrides - ${
            activeMapping?.name || "Unknown"
          } */
          /* Injection ID: ${injectionId} */
          /* Timestamp: ${Date.now()} */
          
          ${generateCssOverrides()}
        `;

        // Insert the style element at the very end of head for highest priority
        if (iframeDoc.head) {
          iframeDoc.head.appendChild(styleElement);
          console.log(
            `✅ Injected CSS (ID: ${injectionId}) for mapping: ${activeMapping?.name}`
          );
          console.log(
            `📋 CSS Rules count: ${generateCssOverrides().split("\n").length}`
          );
          return true;
        } else {
          console.warn("❌ No head element found in iframe");
        }
      } else {
        console.warn("❌ Cannot access iframe document - CORS blocked");
        return false;
      }
    } catch (e) {
      console.warn(
        "❌ Cannot inject CSS into iframe due to CORS restrictions:",
        e
      );
      return false;
    }
    return false;
  };

  // Fallback method: Apply CSS via external stylesheet injection
  const applyFallbackColorMapping = () => {
    const activeMapping = allMappings[selectedMapping];
    if (!activeMapping) return false;

    try {
      // Remove any existing fallback styles
      const existingFallback = document.getElementById("proxy-fallback-styles");
      if (existingFallback) {
        existingFallback.remove();
      }

      // Create a style element in the parent document
      const fallbackStyle = document.createElement("style");
      fallbackStyle.id = "proxy-fallback-styles";

      // Apply CSS that targets the iframe and its surroundings
      fallbackStyle.textContent = `
        /* Fallback color mapping for CORS-blocked iframes */
        iframe[title="Website Preview"] {
          /* Apply a filter that approximates the color mapping */
          ${getFallbackFilter(activeMapping)}
        }
        
        /* Visual indicator that fallback is active */
        iframe[title="Website Preview"]::after {
          content: "🎨 Fallback color mapping active";
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          font-size: 11px;
          border-radius: 4px;
          z-index: 10000;
          pointer-events: none;
        }
      `;

      document.head.appendChild(fallbackStyle);
      console.log(`🔄 Applied fallback color mapping: ${activeMapping.name}`);
      return true;
    } catch (e) {
      console.warn("Failed to apply fallback color mapping:", e);
      return false;
    }
  };

  // Generate CSS filter for fallback mode
  const getFallbackFilter = (mapping: ColorMappingConfig): string => {
    // Analyze the mapping to determine appropriate filter
    const mappings = Object.entries(mapping.mappings);

    if (
      mappings.some(
        ([from, to]) => from.includes("blue") && to.includes("purple")
      )
    ) {
      return "hue-rotate(60deg) saturate(1.1);";
    } else if (
      mappings.some(
        ([from, to]) => from.includes("blue") && to.includes("green")
      )
    ) {
      return "hue-rotate(120deg) saturate(1.2);";
    } else if (
      mappings.some(
        ([from, to]) => from.includes("gray") && to.includes("slate")
      )
    ) {
      return "contrast(1.1) brightness(0.95);";
    } else if (
      mappings.some(([from, to]) => from.includes("blue") && to.includes("red"))
    ) {
      return "hue-rotate(-60deg) saturate(1.1);";
    } else {
      return "hue-rotate(30deg) saturate(1.1);";
    }
  };

  // Re-inject CSS when mapping changes
  useEffect(() => {
    console.log("🎯 useEffect triggered:", {
      loadedUrl: !!loadedUrl,
      selectedMapping,
      allMappingKeys: Object.keys(allMappings),
    });

    if (loadedUrl && selectedMapping && allMappings[selectedMapping]) {
      setLastMappingUpdate(Date.now());

      // Get the fresh mapping object directly from allMappings
      const freshMapping = allMappings[selectedMapping];
      console.log(
        "🔄 Using fresh mapping:",
        freshMapping.name,
        "for key:",
        selectedMapping
      );

      // Wait a bit longer and try multiple times
      const attemptInjection = (attempt = 1) => {
        const iframe = document.querySelector(
          'iframe[title="Website Preview"]'
        ) as HTMLIFrameElement;
        if (iframe) {
          console.log(
            `🎨 Attempt ${attempt}: Switching to mapping: ${freshMapping.name}`
          );

          // Try direct CSS injection first
          const success = injectCssIntoIframe(iframe, true);

          if (success) {
            console.log(
              `✅ Successfully applied mapping: ${freshMapping.name}`
            );
          } else if (attempt < 3) {
            console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
            setTimeout(() => attemptInjection(attempt + 1), 500);
          } else {
            // All direct injection attempts failed, use fallback
            console.log(
              "🔄 All direct injection attempts failed, switching to fallback mode..."
            );
            const fallbackSuccess = applyFallbackColorMapping();
            if (fallbackSuccess) {
              console.log(
                `✅ Fallback color mapping applied: ${freshMapping.name}`
              );
            } else {
              console.error("❌ Both direct and fallback methods failed");
            }
          }
        } else {
          console.warn("⚠️ No iframe found");
        }
      };

      // Start first attempt after a short delay
      setTimeout(() => attemptInjection(), 200);
    }
  }, [selectedMapping, loadedUrl, allMappings]); // Include allMappings to ensure fresh data

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Handle URL input changes with real-time validation
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setTargetUrl(url);

    if (url.trim()) {
      const valid = validateUrl(url);
      setIsUrlValid(valid);

      if (!valid && url.length > 8) {
        setError("Please enter a valid HTTP/HTTPS URL");
      } else {
        setError("");
      }
    } else {
      setIsUrlValid(false);
      setError("");
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(targetUrl)) {
      setError("Please enter a valid HTTP/HTTPS URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Normalize URL - add https:// if no protocol specified
      let normalizedUrl = targetUrl.trim();
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Basic URL accessibility check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // Test if we can fetch the URL (this will likely be blocked by CORS, but helps validate)
        await fetch(normalizedUrl, {
          method: "HEAD",
          signal: controller.signal,
          mode: "no-cors", // This prevents CORS errors but limits response access
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // CORS error is expected, so we'll continue anyway
        console.log("CORS or network error (expected):", fetchError);
      }

      setLoadedUrl(normalizedUrl);
      setError("");
    } catch (err) {
      console.error("URL validation error:", err);
      setError("Failed to load website. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateCssOverrides = (): string => {
    // Use fresh mapping from allMappings instead of currentMapping
    const activeMapping = allMappings[selectedMapping];
    if (!activeMapping) {
      console.warn("⚠️ No active mapping found for:", selectedMapping);
      return "";
    }

    console.log(
      "🎨 Generating CSS for mapping:",
      activeMapping.name,
      "with",
      Object.keys(activeMapping.mappings).length,
      "rules"
    );

    const cssRules: string[] = [];

    // Map common Tailwind colors to their actual CSS values
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "200": "#bfdbfe",
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
        "600": "#2563eb",
        "700": "#1d4ed8",
        "800": "#1e40af",
        "900": "#1e3a8a",
      },
      purple: {
        "50": "#faf5ff",
        "100": "#f3e8ff",
        "200": "#e9d5ff",
        "300": "#d8b4fe",
        "400": "#c084fc",
        "500": "#a855f7",
        "600": "#9333ea",
        "700": "#7c3aed",
        "800": "#6b21a8",
        "900": "#581c87",
      },
      green: {
        "50": "#f0fdf4",
        "100": "#dcfce7",
        "200": "#bbf7d0",
        "300": "#86efac",
        "400": "#4ade80",
        "500": "#22c55e",
        "600": "#16a34a",
        "700": "#15803d",
        "800": "#166534",
        "900": "#14532d",
      },
      red: {
        "50": "#fef2f2",
        "100": "#fee2e2",
        "200": "#fecaca",
        "300": "#fca5a5",
        "400": "#f87171",
        "500": "#ef4444",
        "600": "#dc2626",
        "700": "#b91c1c",
        "800": "#991b1b",
        "900": "#7f1d1d",
      },
      orange: {
        "50": "#fff7ed",
        "100": "#ffedd5",
        "200": "#fed7aa",
        "300": "#fdba74",
        "400": "#fb923c",
        "500": "#f97316",
        "600": "#ea580c",
        "700": "#c2410c",
        "800": "#9a3412",
        "900": "#7c2d12",
      },
      yellow: {
        "50": "#fefce8",
        "100": "#fef3c7",
        "200": "#fde68a",
        "300": "#fcd34d",
        "400": "#fbbf24",
        "500": "#f59e0b",
        "600": "#d97706",
        "700": "#b45309",
        "800": "#92400e",
        "900": "#78350f",
      },
      pink: {
        "50": "#fdf2f8",
        "100": "#fce7f3",
        "200": "#fbcfe8",
        "300": "#f9a8d4",
        "400": "#f472b6",
        "500": "#ec4899",
        "600": "#db2777",
        "700": "#be185d",
        "800": "#9d174d",
        "900": "#831843",
      },
      indigo: {
        "50": "#eef2ff",
        "100": "#e0e7ff",
        "200": "#c7d2fe",
        "300": "#a5b4fc",
        "400": "#818cf8",
        "500": "#6366f1",
        "600": "#4f46e5",
        "700": "#4338ca",
        "800": "#3730a3",
        "900": "#312e81",
      },
    };

    // Generate comprehensive CSS overrides for each color mapping
    Object.entries(activeMapping.mappings).forEach(([from, to]) => {
      const fromParts = from.split("-");
      const toParts = to.split("-");

      if (fromParts.length >= 2 && toParts.length >= 2) {
        const fromColor = fromParts[0];
        const fromShade = fromParts[1];
        const toColor = toParts[0];
        const toShade = toParts[1];

        const toColorValue = colorMap[toColor]?.[toShade] || "#6b7280";

        // More aggressive CSS rules with higher specificity (exclude images and media)
        const cssDeclarations = [
          // Background colors (exclude all media elements)
          `*[class*="bg-${fromColor}-${fromShade}"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { background-color: ${toColorValue} !important; }`,
          `.bg-${fromColor}-${fromShade}:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { background-color: ${toColorValue} !important; }`,

          // Text colors (exclude all media elements)
          `*[class*="text-${fromColor}-${fromShade}"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { color: ${toColorValue} !important; }`,
          `.text-${fromColor}-${fromShade}:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { color: ${toColorValue} !important; }`,

          // Border colors (exclude all media elements)
          `*[class*="border-${fromColor}-${fromShade}"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { border-color: ${toColorValue} !important; }`,
          `.border-${fromColor}-${fromShade}:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { border-color: ${toColorValue} !important; }`,

          // Hover states (exclude all media elements)
          `*[class*="hover:bg-${fromColor}-${fromShade}"]:hover:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { background-color: ${toColorValue} !important; }`,
          `*[class*="hover:text-${fromColor}-${fromShade}"]:hover:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { color: ${toColorValue} !important; }`,

          // Focus states (exclude all media elements)
          `*[class*="focus:bg-${fromColor}-${fromShade}"]:focus:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { background-color: ${toColorValue} !important; }`,
          `*[class*="focus:text-${fromColor}-${fromShade}"]:focus:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { color: ${toColorValue} !important; }`,
        ];

        cssRules.push(...cssDeclarations);
      }
    });

    // Add some general overrides for common scenarios (exclude images and media)
    cssRules.push(`
      /* Force override for any blue elements (exclude all media) */
      *[class*="bg-blue-"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { background-color: #a855f7 !important; }
      *[class*="text-blue-"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { color: #a855f7 !important; }
      *[class*="border-blue-"]:not(img):not([src]):not(video):not(audio):not(canvas):not(svg):not(picture):not(source) { border-color: #a855f7 !important; }
      
      /* MAXIMUM PROTECTION: Ensure ALL media elements are NEVER affected */
      img, img *, [src], [src] *, video, video *, audio, audio *, canvas, canvas *, svg, svg *, picture, picture *, source, source * { 
        background-color: unset !important; 
        color: unset !important; 
        border-color: unset !important; 
        filter: none !important; 
        background-image: unset !important;
        background: unset !important;
        opacity: unset !important;
        transform: unset !important;
        -webkit-filter: none !important;
      }
      
      /* Additional protection for common image containers */
      [class*="image"], [class*="img"], [class*="photo"], [class*="picture"], [id*="image"], [id*="img"] {
        background-color: unset !important; 
        color: unset !important; 
        filter: none !important; 
        -webkit-filter: none !important;
      }
      
      /* Remove any CSS filters from the iframe itself */
      iframe { filter: none !important; -webkit-filter: none !important; }
    `);

    return cssRules.join("\n        ");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Website Color Preview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter a website URL to preview it with different color schemes. Note:
          Some sites may block embedding due to security policies.
        </p>

        {/* Example URLs */}
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Try these example sites:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "https://example.com",
              "https://httpbin.org/html",
              "https://jsonplaceholder.typicode.com",
              "https://httpstat.us/200",
            ].map((exampleUrl) => (
              <button
                key={exampleUrl}
                onClick={() => {
                  setTargetUrl(exampleUrl);
                  setIsUrlValid(true);
                  setError("");
                }}
                className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                {exampleUrl.replace("https://", "")}
              </button>
            ))}
          </div>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleUrlSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="url"
              value={targetUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                error && targetUrl.trim()
                  ? "border-red-300 bg-red-50"
                  : isUrlValid || !targetUrl.trim()
                  ? "border-gray-300"
                  : "border-yellow-300 bg-yellow-50"
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !targetUrl.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {isLoading ? "Loading..." : "Preview"}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </form>

        {/* Custom Mapping Creator */}
        <CustomMappingCreator onMappingCreated={handleCustomMappingCreated} />

        {/* Color Mapping Controls */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Color Mapping:
            </label>
            {currentMapping && (
              <span className="text-xs text-gray-500">
                {
                  Object.keys(allMappings[selectedMapping]?.mappings || {})
                    .length
                }{" "}
                color
                {Object.keys(allMappings[selectedMapping]?.mappings || {})
                  .length !== 1
                  ? "s"
                  : ""}{" "}
                mapped
              </span>
            )}
          </div>

          <select
            value={selectedMapping}
            onChange={(e) => {
              console.log(
                "🔄 Mapping changed from",
                selectedMapping,
                "to",
                e.target.value
              );
              setSelectedMapping(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
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

          {/* Color Mapping Preview */}
          {allMappings[selectedMapping] && (
            <div className="mt-3 p-3 bg-white rounded border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Active Color Mappings:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                {Object.entries(allMappings[selectedMapping].mappings).map(
                  ([from, to]) => (
                    <div
                      key={`${from}-${to}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span
                        className={`px-2 py-1 rounded text-white bg-${from.replace(
                          "-",
                          "-"
                        )}`}
                        style={{
                          backgroundColor: from.includes("blue")
                            ? "#3b82f6"
                            : from.includes("red")
                            ? "#ef4444"
                            : from.includes("green")
                            ? "#10b981"
                            : from.includes("purple")
                            ? "#8b5cf6"
                            : "#6b7280",
                        }}
                      >
                        {from}
                      </span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span
                        className={`px-2 py-1 rounded text-white bg-${to.replace(
                          "-",
                          "-"
                        )}`}
                        style={{
                          backgroundColor: to.includes("blue")
                            ? "#3b82f6"
                            : to.includes("red")
                            ? "#ef4444"
                            : to.includes("green")
                            ? "#10b981"
                            : to.includes("purple")
                            ? "#8b5cf6"
                            : "#6b7280",
                        }}
                      >
                        {to}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Debug CSS Preview */}
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  View Generated CSS (Debug)
                </summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  <div className="mb-2 p-1 bg-yellow-100 text-yellow-800 rounded">
                    <strong>Debug Info:</strong>
                    <br />
                    Selected: {selectedMapping}
                    <br />
                    Active Mapping: {allMappings[selectedMapping]?.name}
                    <br />
                    Last Update:{" "}
                    {new Date(lastMappingUpdate).toLocaleTimeString()}
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {generateCssOverrides()}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Website Preview */}
      {loadedUrl && !error && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate">
              Preview: {loadedUrl}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-gray-500">
                Mapping: {currentMapping?.name}
              </span>
              <button
                onClick={() => {
                  const iframe = document.querySelector(
                    'iframe[title="Website Preview"]'
                  ) as HTMLIFrameElement;
                  if (iframe) {
                    const success = injectCssIntoIframe(iframe, true);
                    if (success) {
                      console.log("🔄 Manually refreshed color overrides");
                    } else {
                      console.log(
                        "🔄 Manual refresh failed, using fallback..."
                      );
                      const fallbackSuccess = applyFallbackColorMapping();
                      if (fallbackSuccess) {
                        console.log("🔄 Manual fallback refresh successful");
                      } else {
                        console.warn(
                          "❌ Manual refresh failed - both methods unsuccessful"
                        );
                      }
                    }
                  }
                }}
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                title="Refresh color overrides"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="relative" style={{ height: "600px" }}>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading website...</p>
                </div>
              </div>
            ) : (
              <>
                <iframe
                  src={loadedUrl}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  title="Website Preview"
                  onLoad={(e) => {
                    const iframe = e.target as HTMLIFrameElement;
                    setIsBlocked(false);

                    // Clear any parent document styles that might interfere
                    const parentDoc = document;
                    const existingParentStyle = parentDoc.getElementById(
                      "proxy-color-overrides"
                    );
                    if (existingParentStyle) {
                      existingParentStyle.remove();
                      console.log("🧹 Cleared parent document styles");
                    }

                    // Method 1: Try to inject CSS directly into iframe
                    const injectionSuccess = injectCssIntoIframe(iframe);

                    // Method 2: Use fallback if direct injection fails
                    if (!injectionSuccess) {
                      console.log(
                        "🔄 Direct injection failed, using fallback..."
                      );
                      applyFallbackColorMapping();
                    }
                  }}
                  onError={() => {
                    setError(
                      "Failed to load website. This site may not allow embedding."
                    );
                    setIsBlocked(true);
                  }}
                />

                {/* Overlay with instructions */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        Date.now() - lastMappingUpdate < 2000
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-green-400 animate-pulse"
                      }`}
                    ></span>
                    <p className="font-semibold">
                      {Date.now() - lastMappingUpdate < 2000
                        ? "Updating Colors..."
                        : "Color Override Active"}
                    </p>
                  </div>
                  <p className="text-xs opacity-90 mb-2">
                    {
                      Object.keys(allMappings[selectedMapping]?.mappings || {})
                        .length
                    }{" "}
                    color mappings applied
                  </p>
                  <p className="text-xs opacity-75">
                    Mapping: {allMappings[selectedMapping]?.name}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {document.getElementById("proxy-fallback-styles")
                      ? "Fallback mode active"
                      : "Direct CSS injection"}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    Use refresh button if colors don't update.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Blocked Site Alternative */}
      {isBlocked && (
        <div className="border border-yellow-200 rounded-lg overflow-hidden bg-yellow-50">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              🚫 Site Embedding Blocked
            </h3>
            <p className="text-yellow-800 mb-4">
              This website doesn't allow embedding in iframes for security
              reasons.
            </p>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">
                Try These Alternatives:
              </h4>
              <div className="text-sm text-yellow-800 space-y-2">
                <p>
                  • Use the Interactive Editor mode to test your HTML/CSS
                  directly
                </p>
                <p>• Try one of the working example URLs above</p>
                <p>• Look for simpler websites that allow embedding</p>
                <p>
                  • Copy your CSS overrides and test them manually in browser
                  dev tools
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
        <div className="grid md:grid-cols-2 gap-4 text-blue-800 text-sm">
          <div>
            <h4 className="font-medium mb-2">🎯 Getting Started</h4>
            <ul className="space-y-1">
              <li>• Enter any website URL to load it in a preview frame</li>
              <li>
                • Select a color mapping to apply Tailwind color overrides
              </li>
              <li>• Use the example URLs for sites that work well</li>
              <li>
                • Try the refresh button if colors don't update immediately
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">⚡ Technical Details</h4>
            <ul className="space-y-1">
              <li>• CSS injection attempts to override colors in real-time</li>
              <li>
                • Some sites may block embedding due to X-Frame-Options headers
              </li>
              <li>
                • CORS policies may prevent color injection on external sites
              </li>
              <li>• Works best with sites that allow iframe embedding</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Best Results</h4>
          <p className="text-blue-800 text-sm">
            For the best experience, try simple websites, documentation sites,
            or development tools. Many social media and commercial sites block
            embedding for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
}
