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

### Coming Soon

- 🔄 **Tailwind Class Parser** - Extract color classes from HTML/JSX files## Expanding the ESLint configuration

- 🎨 **Interactive Preview** - Before/after color scheme visualization

- ⚙️ **Color Mapping Engine** - Core conversion logicIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- 📄 **Configuration Generator** - Export reusable mapping configs

- 📁 **Batch File Processing** - Convert multiple files at once```js

- 💻 **CLI Interface** - Command-line tool for automationexport default defineConfig([

- 🌙 **Advanced Pattern Support** - Dark mode, hover states, responsive variants globalIgnores(['dist']),

- 🧪 **Comprehensive Testing** - Robust test suite {

  files: ['**/*.{ts,tsx}'],

## 🎯 Use Cases extends: [

      // Other configs...

### Browser Extension (Most Practical)

A Chrome/Firefox extension that injects CSS to override colors. Works on any site and persists across sessions. // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

### Build-Time Converter (Best for Your Own Apps) // Alternatively, use this for stricter rules

Parse your Tailwind codebase and systematically convert color classes from one palette to another. tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

### Proxy/Wrapper App tseslint.configs.stylisticTypeChecked,

Fetch and render another app's HTML with modified colors (limited by CORS).

      // Other configs...

## 🛠️ Quick Start ],

    languageOptions: {

### Prerequisites parserOptions: {

- Node.js 18+ project: ['./tsconfig.node.json', './tsconfig.app.json'],

- npm or yarn tsconfigRootDir: import.meta.dirname,

      },

### Installation // other options...

````bash },

# Clone the repository  },

git clone https://github.com/yourusername/color-converter])

cd color-converter```



# Install dependenciesYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

npm install

```js

# Start development server// eslint.config.js

npm run devimport reactX from 'eslint-plugin-react-x'

```import reactDom from 'eslint-plugin-react-dom'



### Usageexport default defineConfig([

1. Open `http://localhost:5173` in your browser  globalIgnores(['dist']),

2. See the demo showing blue → purple color scheme conversion  {

3. Explore the interactive components and styling examples    files: ['**/*.{ts,tsx}'],

    extends: [

## 🎨 Color Mapping Configuration      // Other configs...

      // Enable lint rules for React

### Basic Example      reactX.configs['recommended-typescript'],

```json      // Enable lint rules for React DOM

{      reactDom.configs.recommended,

  "name": "Blue to Purple Scheme",    ],

  "description": "Convert blue-based design to purple theme",    languageOptions: {

  "mappings": {      parserOptions: {

    "simple": {        project: ['./tsconfig.node.json', './tsconfig.app.json'],

      "blue-500": "purple-500",        tsconfigRootDir: import.meta.dirname,

      "blue-600": "purple-600",      },

      "blue-700": "purple-700"      // other options...

    }    },

  }  },

}])

````

### Advanced Configuration

```json
{
  "name": "Corporate Theme Converter",
  "mappings": {
    "backgrounds": {
      "blue-500": "purple-500"
    },
    "text": {
      "blue-500": "purple-600"
    },
    "states": {
      "hover": {
        "blue-500": "purple-600"
      }
    }
  },
  "rules": {
    "preserveShades": true,
    "maintainContrast": true
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

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

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

## 🌟 Roadmap

### Phase 1: Core Functionality ✅

- [x] Project setup and Tailwind integration
- [x] Color mapping system design
- [x] Basic demo implementation

### Phase 2: Parser & Engine 🔄

- [ ] Tailwind class parser
- [ ] Color mapping logic
- [ ] Interactive preview component

### Phase 3: Advanced Features 🔮

- [ ] CLI interface
- [ ] Batch file processing
- [ ] Browser extension
- [ ] Advanced pattern support

### Phase 4: Polish & Distribution 🚀

- [ ] Comprehensive testing
- [ ] Documentation
- [ ] NPM package
- [ ] VS Code extension

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/color-converter/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/color-converter/discussions)
