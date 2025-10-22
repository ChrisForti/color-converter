# Tailwind CSS Styling Examples

This file contains various Tailwind CSS styling patterns to test our color converter tool.

## Basic Color Patterns

### Buttons
```jsx
// Primary button
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>

// Secondary button
<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400 px-4 py-2 rounded">
  Cancel
</button>

// Danger button
<button className="bg-red-500 hover:bg-red-600 text-white border border-red-700 px-4 py-2 rounded">
  Delete
</button>

// Success button
<button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
  Save
</button>
```

### Cards
```jsx
// Basic card
<div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
  <h3 className="text-gray-900 text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card description goes here.</p>
</div>

// Featured card
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
  <h3 className="text-blue-900 text-lg font-semibold mb-2">Featured</h3>
  <p className="text-blue-700">This is a featured item.</p>
</div>

// Warning card
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <div className="text-yellow-800">
    <strong>Warning:</strong> This action cannot be undone.
  </div>
</div>
```

### Navigation
```jsx
// Navigation bar
<nav className="bg-gray-800 border-b border-gray-700">
  <div className="flex items-center justify-between px-6 py-3">
    <a href="#" className="text-white text-xl font-bold">Logo</a>
    <div className="flex space-x-4">
      <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
      <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Contact</a>
    </div>
  </div>
</nav>

// Sidebar navigation
<aside className="bg-gray-100 border-r border-gray-300 w-64 h-screen">
  <ul className="p-4">
    <li><a href="#" className="block text-gray-700 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded">Dashboard</a></li>
    <li><a href="#" className="block text-gray-700 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded">Users</a></li>
    <li><a href="#" className="block bg-blue-100 text-blue-700 px-3 py-2 rounded">Settings</a></li>
  </ul>
</aside>
```

### Forms
```jsx
// Form inputs
<form className="bg-white p-6 rounded-lg border border-gray-200">
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Email
    </label>
    <input 
      type="email" 
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Password
    </label>
    <input 
      type="password" 
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  
  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
    Sign In
  </button>
</form>

// Error state
<input 
  type="text" 
  className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
/>
<p className="text-red-600 text-sm mt-1">This field is required</p>
```

## Advanced Patterns

### Dark Mode Variants
```jsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
  <button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
    Action
  </button>
</div>
```

### Group Hover States
```jsx
<div className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer">
  <h3 className="text-gray-900 group-hover:text-blue-600">Card Title</h3>
  <p className="text-gray-600 group-hover:text-gray-700">Description</p>
  <button className="bg-blue-500 group-hover:bg-blue-600 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
    View
  </button>
</div>
```

### Responsive Design
```jsx
<div className="bg-white sm:bg-gray-50 md:bg-blue-50 lg:bg-green-50 xl:bg-purple-50">
  <h1 className="text-gray-900 sm:text-blue-900 md:text-green-900 lg:text-purple-900">
    Responsive Title
  </h1>
  <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-purple-600">
    This changes color at different breakpoints
  </p>
</div>
```

### Complex Combinations
```jsx
// Multi-state button
<button className="
  bg-gradient-to-r from-blue-500 to-purple-600 
  hover:from-blue-600 hover:to-purple-700 
  active:from-blue-700 active:to-purple-800
  disabled:from-gray-300 disabled:to-gray-400
  text-white font-semibold px-6 py-3 rounded-lg
  transition-all duration-200 ease-in-out
  shadow-md hover:shadow-lg
  border border-transparent hover:border-purple-300
">
  Gradient Button
</button>

// Status indicators
<div className="flex space-x-2">
  <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full text-xs">Active</span>
  <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-full text-xs">Pending</span>
  <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-1 rounded-full text-xs">Inactive</span>
  <span className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded-full text-xs">Unknown</span>
</div>
```

## Color Patterns to Test

1. **Basic Colors**: red, blue, green, yellow, purple, pink, indigo, gray
2. **Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
3. **Properties**: bg-, text-, border-, ring-, from-, to-, via-
4. **States**: hover:, focus:, active:, disabled:, visited:
5. **Responsive**: sm:, md:, lg:, xl:, 2xl:
6. **Dark Mode**: dark:
7. **Group**: group-hover:, group-focus:
8. **Combinations**: Multiple modifiers on single element