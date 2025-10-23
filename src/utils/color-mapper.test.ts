/**
 * Simple tests for color mapping logic
 * Focus on complex/flaky behavior only - keeping it minimal
 */

import { mapColorClass, mapClassString, createColorMapping } from './color-mapper';

// Test the complex edge cases and potential failure points
describe('Color Mapping Logic', () => {
  const simpleMapping = { blue: 'purple', red: 'green' };

  test('handles basic color mapping with shades', () => {
    expect(mapColorClass('bg-blue-500', simpleMapping)).toBe('bg-purple-500');
    expect(mapColorClass('text-red-300', simpleMapping)).toBe('text-green-300');
  });

  test('preserves complex modifiers', () => {
    const result = mapClassString('hover:md:bg-blue-500 focus:text-red-400', simpleMapping);
    expect(result).toBe('hover:md:bg-purple-500 focus:text-green-400');
  });

  test('handles invalid/unmapped colors gracefully', () => {
    expect(mapColorClass('bg-invalid-500', simpleMapping)).toBe('bg-invalid-500');
    expect(mapColorClass('text-yellow-400', simpleMapping)).toBe('text-yellow-400');
  });

  test('validates color mappings', () => {
    // Should warn and skip invalid colors
    const mappingWithInvalid = createColorMapping({
      blue: 'purple',
      invalidColor: 'red',
      green: 'invalidTarget'
    });
    
    expect(mappingWithInvalid).toEqual({ blue: 'purple' });
  });

  test('handles edge cases in class strings', () => {
    // Empty strings, extra spaces, malformed classes
    expect(mapClassString('', simpleMapping)).toBe('');
    expect(mapClassString('  bg-blue-500   text-red-400  ', simpleMapping))
      .toBe('bg-purple-500 text-green-400');
  });

  test('handles special Tailwind colors', () => {
    const specialMapping = { white: 'black', transparent: 'white' };
    expect(mapColorClass('bg-white', specialMapping)).toBe('bg-black');
    expect(mapColorClass('border-transparent', specialMapping)).toBe('border-white');
  });
});