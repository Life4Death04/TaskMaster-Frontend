/**
 * Select Helper Utilities
 * Reusable functions for select/dropdown components
 */

/**
 * Create a type-safe change handler for select elements
 * Validates that the selected value exists in the options before calling onChange
 *
 * @param options - Array of options with a property containing the value
 * @param onChange - Callback function to call with the validated value
 * @param valueKey - The key in the option object that contains the value (default: 'value')
 * @returns A change handler function
 */
export function createSelectChangeHandler<
  T extends string,
  O extends Record<string, any>,
>(
  options: O[],
  onChange: (value: T) => void,
  valueKey: keyof O = 'value' as keyof O
) {
  return (newValue: string) => {
    // Find the option that matches the selected value
    const selectedOption = options.find(
      (option) => option[valueKey] === newValue
    );
    if (selectedOption) {
      onChange(selectedOption[valueKey]);
    }
  };
}
