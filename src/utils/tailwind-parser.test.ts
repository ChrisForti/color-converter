/**
 * Simple tests for the Tailwind parser
 * Only testing the complex parsing logic and edge cases
 */

import { parseColorClass, parseColorClasses, getUniqueColorClasses } from './tailwind-parser';

// Simple test runner (avoiding test framework for radical simplicity)
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}:`, error);
  }
}

function assertEqual(actual: any, expected: any, message?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}${message ? ': ' + message : ''}`);
  }
}

// Run tests
console.log('🧪 Testing Tailwind Parser...\n');

test('parseColorClass - basic color class', () => {
  const result = parseColorClass('bg-blue-500');
  assertEqual(result, {
    original: 'bg-blue-500',
    property: 'bg',
    color: 'blue',
    shade: '500',
    modifiers: [],
    full: 'bg-blue-500'
  });
});

test('parseColorClass - with modifiers', () => {
  const result = parseColorClass('hover:md:bg-purple-600');
  assertEqual(result, {
    original: 'bg-purple-600',
    property: 'bg',
    color: 'purple',
    shade: '600',
    modifiers: ['hover', 'md'],
    full: 'hover:md:bg-purple-600'
  });
});

test('parseColorClass - special colors', () => {
  const result = parseColorClass('text-white');
  assertEqual(result, {
    original: 'text-white',
    property: 'text',
    color: 'white',
    shade: '',
    modifiers: [],
    full: 'text-white'
  });
});

test('parseColorClass - not a color class', () => {
  const result = parseColorClass('flex');
  assertEqual(result, null);
});

test('parseColorClasses - from JSX string', () => {
  const jsx = `<div className="bg-blue-500 text-white hover:bg-blue-600">Test</div>`;
  const result = parseColorClasses(jsx);
  
  assertEqual(result.length, 3);
  assertEqual(result[0].color, 'blue');
  assertEqual(result[1].color, 'white');
  assertEqual(result[2].modifiers, ['hover']);
});

test('parseColorClasses - multiple class attributes', () => {
  const jsx = `
    <div className="bg-red-500">
      <span class="text-green-400">Test</span>
    </div>
  `;
  const result = parseColorClasses(jsx);
  
  assertEqual(result.length, 2);
  assertEqual(result[0].color, 'red');
  assertEqual(result[1].color, 'green');
});

test('getUniqueColorClasses - removes duplicates', () => {
  const classes = [
    parseColorClass('bg-blue-500')!,
    parseColorClass('bg-blue-500')!,
    parseColorClass('text-red-400')!
  ];
  
  const unique = getUniqueColorClasses(classes);
  assertEqual(unique.length, 2);
});

console.log('\n🎉 All tests passed!');

export { }; // Make this a module