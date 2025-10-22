# Color Mapping System Design

## Configuration Structure

### Basic Mapping Format
```json
{
  "name": "Scheme Name",
  "description": "Description of the color scheme conversion",
  "version": "1.0.0",
  "mappings": {
    "simple": {
      "source-color": "target-color"
    }
  }
}
```

### Supported Mapping Types

#### 1. Simple Color Mappings
Direct color-to-color conversions:
```json
{
  "blue-500": "purple-500",
  "red-600": "pink-600",
  "gray-200": "slate-200"
}
```

#### 2. Palette Mappings
Map entire color families:
```json
{
  "blue": "purple",    // Maps all blue shades to purple
  "gray": "slate",     // Maps all gray shades to slate
  "red": "rose"        // Maps all red shades to rose
}
```

#### 3. Contextual Mappings
Different mappings based on CSS property:
```json
{
  "backgrounds": {
    "blue-500": "purple-500"
  },
  "text": {
    "blue-500": "purple-600"    // Darker for better contrast
  },
  "borders": {
    "blue-500": "purple-400"    // Lighter for subtle borders
  }
}
```

#### 4. State-Specific Mappings
Handle hover, focus, and other states:
```json
{
  "states": {
    "hover": {
      "blue-500": "purple-600",
      "blue-600": "purple-700"
    },
    "focus": {
      "blue-500": "purple-500",
      "blue-600": "purple-600"
    }
  }
}
```

## Configuration Rules

### Preservation Rules
```json
{
  "rules": {
    "preserveShades": true,        // Keep shade numbers (500 -> 500)
    "preserveOpacity": true,       // Keep opacity modifiers (/50, /75)
    "handleArbitraryValues": false, // Convert arbitrary values [#ff0000]
    "respectDarkMode": true,       // Handle dark: variants separately
    "maintainContrast": true       // Ensure adequate contrast ratios
  }
}
```

### Advanced Pattern Handling
```json
{
  "patterns": {
    "gradients": {
      "from-blue-500": "from-purple-500",
      "to-blue-600": "to-purple-600",
      "via-blue-400": "via-purple-400"
    },
    "responsive": {
      "sm:bg-blue-500": "sm:bg-purple-500",
      "md:text-blue-600": "md:text-purple-600"
    },
    "darkMode": {
      "dark:bg-blue-500": "dark:bg-purple-500",
      "dark:text-blue-100": "dark:text-purple-100"
    }
  }
}
```

## Preset Configurations

### Popular Color Scheme Conversions

#### Material Design Blue → Indigo
```json
{
  "name": "Material Blue to Indigo",
  "mappings": {
    "blue-50": "indigo-50",
    "blue-500": "indigo-500",
    "blue-700": "indigo-700"
  }
}
```

#### Corporate → Modern
```json
{
  "name": "Corporate to Modern",
  "mappings": {
    "blue-600": "slate-600",
    "gray-100": "zinc-100",
    "red-500": "rose-500"
  }
}
```

#### Accessibility-First
```json
{
  "name": "High Contrast Theme",
  "mappings": {
    "gray-400": "gray-600",    // Increase contrast
    "blue-400": "blue-600",    // Darker blues
    "green-400": "green-600"   // Darker greens
  },
  "rules": {
    "maintainContrast": true,
    "minContrastRatio": 4.5
  }
}
```

## Usage Examples

### Basic Usage
```javascript
import { convertColors } from './color-converter';
import blueToProtection from './configs/blue-to-purple.json';

const converted = convertColors(
  'bg-blue-500 text-blue-600 hover:bg-blue-600',
  blueToProtection
);
// Result: 'bg-purple-500 text-purple-600 hover:bg-purple-600'
```

### Advanced Usage with Context
```javascript
const converted = convertColors(
  'bg-blue-500',
  config,
  {
    property: 'background',
    state: 'default',
    responsive: false,
    darkMode: false
  }
);
```

## Configuration Validation

### Required Fields
- `name`: Human-readable scheme name
- `mappings`: At least one mapping definition
- `version`: Semantic version for compatibility

### Optional Fields
- `description`: Detailed explanation
- `rules`: Conversion behavior rules
- `presets`: Pre-defined mapping sets
- `metadata`: Author, tags, etc.

### Validation Rules
1. All color values must be valid Tailwind colors
2. Mappings must be bidirectional when possible
3. Contrast ratios should be maintained
4. No circular mappings allowed