# Tailwind Color Scheme Converter

[![CI/CD Pipeline](https://github.com/ChrisForti/color-converter/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ChrisForti/color-converter/actions/workflows/ci-cd.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://chrisforti.github.io/color-converter/)

A powerful tool for converting Tailwind CSS color schemes in your projects. Transform your entire design system from one color palette to another with ease!

## 🚀 Features

- ✅ **Interactive Preview** - Real-time before/after color conversion with live code editor
- ✅ **Smart Color Mapping** - Intelligent shade preservation (blue-500 → purple-500)
- ✅ **Custom Mappings** - Create your own color schemes through interactive UI
- ✅ **Built-in Presets** - 6 ready-to-use themes (warm, nature, minimal, etc.)
- ✅ **Robust Validation** - Handles edge cases and provides helpful error messages
- ✅ **Tailwind CSS v4** - Built with latest Tailwind and Vite for optimal performance

## 🌐 Live Demo

Try it out: **[https://chrisforti.github.io/color-converter/](https://chrisforti.github.io/color-converter/)**

## 🏗️ Development

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).


## 🎯 Use Cases

### Interactive Web Tool (Current Implementation) ✅
Copy and paste your HTML/JSX code to see instant color scheme conversions with live preview. Perfect for prototyping and small-scale conversions.

### Browser Extension (Future Enhancement) 🔮
A Chrome/Firefox extension that injects CSS to override colors. Works on any site and persists across sessions.

### CLI Tool (Planned) 📋
Command-line interface for batch processing Tailwind files in your projects. Parse your codebase and systematically convert color classes from one palette to another.

### Proxy/Wrapper App (Possible Future Feature) 🌐
Fetch and render another app's HTML with modified colors (limited by CORS). Useful for previewing external sites with different color schemes.

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ChrisForti/color-converter
cd color-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. Open `http://localhost:5173` in your browser
2. See the demo showing blue → purple color scheme conversion
3. Explore the interactive components and styling examples

## 🎨 Color Mapping Configuration

### Basic Example

```json
{
  "name": "Blue to Purple Scheme",
  "description": "Convert blue-based design to purple theme",
  "mappings": {
    "blue": "purple"
  }
}
```

### Advanced Configuration

```json
{
  "name": "Corporate Theme Converter",
  "mappings": {
    "blue": "purple",
    "red": "green",
    "gray": "slate"
  }
}
```

## 📚 Documentation

### Supported Patterns

- **Basic Colors**: `bg-blue-500`, `text-red-600`, `border-gray-300`
- **State Variants**: `hover:bg-blue-600`, `focus:ring-blue-500`
- **Responsive**: `md:bg-blue-500`, `lg:text-blue-600`
- **Dark Mode**: `dark:bg-blue-900`, `dark:text-blue-100`
- **Complex**: `group-hover:bg-blue-50`, `sm:hover:bg-blue-600`

### File Structure

```
src/
├── components/          # React components
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── styles/             # CSS and styling
└── examples/           # Test cases and examples

docs/
├── color-mapping-design.md    # Mapping system architecture
├── styling-examples.md        # Tailwind pattern examples
└── color-scheme-converter.md  # Project overview
```

## 🔧 Development
### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS with PostCSS
- **Development**: Hot reload, ESLint, TypeScript

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **[Live Demo](https://chrisforti.github.io/color-converter/)** - Try the tool online
- **[Roadmap](ROADMAP.md)** - Development roadmap and current status
- **[Contributing Guidelines](#-contributing)** - How to contribute to the project
