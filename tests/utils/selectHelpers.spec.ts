import { test, expect } from '@playwright/test';
import { createSelectChangeHandler } from '../../src/utils/selectHelpers';

test.describe('selectHelpers - createSelectChangeHandler', () => {
  // ============================================================================
  // Test: Valid Selection
  // ============================================================================
  test('should call onChange with valid value when option exists', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    let capturedValue: string | undefined;
    const onChange = (value: string) => {
      capturedValue = value;
    };

    const handler = createSelectChangeHandler(options, onChange);
    handler('option2');

    expect(capturedValue).toBe('option2');
  });

  // ============================================================================
  // Test: Invalid Selection
  // ============================================================================
  test('should not call onChange when option does not exist', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    let wasCalled = false;
    const onChange = () => {
      wasCalled = true;
    };

    const handler = createSelectChangeHandler(options, onChange);
    handler('nonexistent');

    expect(wasCalled).toBe(false);
  });

  // ============================================================================
  // Test: Custom Value Key
  // ============================================================================
  test('should work with custom valueKey', () => {
    const options = [
      { id: 'custom1', name: 'First' },
      { id: 'custom2', name: 'Second' },
      { id: 'custom3', name: 'Third' },
    ];

    let capturedValue: string | undefined;
    const onChange = (value: string) => {
      capturedValue = value;
    };

    const handler = createSelectChangeHandler(options, onChange, 'id');
    handler('custom2');

    expect(capturedValue).toBe('custom2');
  });

  // ============================================================================
  // Test: Type Safety with Generic Types
  // ============================================================================
  test('should handle different value types correctly', () => {
    const statusOptions = [
      { value: 'TODO', label: 'To Do' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'DONE', label: 'Done' },
    ];

    let capturedValue: string | undefined;
    const onChange = (value: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
      capturedValue = value;
    };

    const handler = createSelectChangeHandler(statusOptions, onChange);
    handler('TODO');

    expect(capturedValue).toBe('TODO');
  });

  // ============================================================================
  // Test: Empty Options Array
  // ============================================================================
  test('should not call onChange when options array is empty', () => {
    const options: Array<{ value: string; label: string }> = [];

    let wasCalled = false;
    const onChange = () => {
      wasCalled = true;
    };

    const handler = createSelectChangeHandler(options, onChange);
    handler('anything');

    expect(wasCalled).toBe(false);
  });

  // ============================================================================
  // Test: Complex Objects
  // ============================================================================
  test('should work with complex option objects', () => {
    const options = [
      {
        id: 1,
        value: 'red',
        label: 'Red',
        hex: '#FF0000',
        description: 'Red color',
      },
      {
        id: 2,
        value: 'blue',
        label: 'Blue',
        hex: '#0000FF',
        description: 'Blue color',
      },
      {
        id: 3,
        value: 'green',
        label: 'Green',
        hex: '#00FF00',
        description: 'Green color',
      },
    ];

    let capturedValue: string | undefined;
    const onChange = (value: string) => {
      capturedValue = value;
    };

    const handler = createSelectChangeHandler(options, onChange);
    handler('blue');

    expect(capturedValue).toBe('blue');
  });

  // ============================================================================
  // Test: First Match Only
  // ============================================================================
  test('should use first match when multiple options have same value', () => {
    const options = [
      { value: 'duplicate', label: 'First' },
      { value: 'duplicate', label: 'Second' },
      { value: 'unique', label: 'Third' },
    ];

    let capturedValue: string | undefined;
    const onChange = (value: string) => {
      capturedValue = value;
    };

    const handler = createSelectChangeHandler(options, onChange);
    handler('duplicate');

    expect(capturedValue).toBe('duplicate');
  });
});
