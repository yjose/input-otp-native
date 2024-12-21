import { act, renderHook } from '@testing-library/react-native';
import { useInput } from './use-input';
describe('useInput', () => {
  // Setup section
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('initializes with default values', () => {
      const { result } = renderHook(() => useInput({ maxLength: 4 }));

      expect(result.current.value).toBe('');
      expect(result.current.isFocused).toBe(false);
      expect(result.current.contextValue.slots).toHaveLength(4);
    });

    test('initializes with default value', () => {
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, defaultValue: '123' })
      );

      expect(result.current.value).toBe('123');
      expect(result.current.contextValue.slots).toHaveLength(4);
    });
  });

  describe('Value Changes', () => {
    test('updates value on valid input', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInput({ maxLength: 4, onChange }));

      act(() => {
        result.current.handlers.onChangeText('123');
      });

      expect(result.current.value).toBe('123');
      expect(onChange).toHaveBeenCalledWith('123');
    });

    test('limits input to maxLength', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInput({ maxLength: 4, onChange }));

      act(() => {
        result.current.handlers.onChangeText('12345');
      });

      expect(result.current.value).toBe('1234');
      expect(onChange).toHaveBeenCalledWith('1234');
    });

    test('validates input against pattern (string)', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, pattern: '[0-9]', onChange })
      );

      act(() => {
        result.current.handlers.onChangeText('abc');
      });

      expect(result.current.value).toBe('');
      expect(onChange).not.toHaveBeenCalled();
    });

    test('validates input against pattern (RegExp string)', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, pattern: '^[0-9]+$', onChange })
      );

      act(() => {
        result.current.handlers.onChangeText('123');
      });

      expect(result.current.value).toBe('123');
      expect(onChange).toHaveBeenCalledWith('123');
    });

    test('calls onComplete when maxLength is reached', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, onComplete })
      );

      act(() => {
        result.current.handlers.onChangeText('1234');
      });

      expect(onComplete).toHaveBeenCalledWith('1234');
    });

    test('applies pasteTransformer on paste operations', () => {
      const onChange = jest.fn();
      const pasteTransformer = jest.fn((text) => text.replace(/\D/g, ''));
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, onChange, pasteTransformer })
      );

      // Simulate pasting "Code: 1234"
      act(() => {
        result.current.handlers.onChangeText('Code: 1234');
      });

      expect(pasteTransformer).toHaveBeenCalledWith('Code: 1234');
      expect(result.current.value).toBe('1234');
      expect(onChange).toHaveBeenCalledWith('1234');
    });

    test('does not apply pasteTransformer on normal typing', () => {
      const onChange = jest.fn();
      const pasteTransformer = jest.fn((text) => text.replace(/\D/g, ''));
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, onChange, pasteTransformer })
      );

      // Simulate typing "1"
      act(() => {
        result.current.handlers.onChangeText('1');
      });

      expect(pasteTransformer).not.toHaveBeenCalled();
      expect(result.current.value).toBe('1');
      expect(onChange).toHaveBeenCalledWith('1');
    });
  });

  describe('Focus Management', () => {
    test('handles focus state', () => {
      const { result } = renderHook(() => useInput({ maxLength: 4 }));

      act(() => {
        result.current.handlers.onFocus();
      });

      expect(result.current.isFocused).toBe(true);

      act(() => {
        result.current.handlers.onBlur();
      });

      expect(result.current.isFocused).toBe(false);
    });
  });

  describe('Actions', () => {
    test('clear action resets value', () => {
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, defaultValue: '123' })
      );

      act(() => {
        result.current.actions.clear();
      });

      expect(result.current.value).toBe('');
    });
  });

  describe('Slots', () => {
    test('generates correct slots with placeholder', () => {
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, placeholder: '0000' })
      );

      const firstSlot = result.current.contextValue.slots[0];
      expect(firstSlot?.placeholderChar).toBe('0');
      expect(firstSlot?.char).toBe(null);
    });

    test('generates correct slots with value', () => {
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, defaultValue: '12' })
      );

      const slots = result.current.contextValue.slots;
      expect(slots[0]?.char).toBe('1');
      expect(slots[1]?.char).toBe('2');
      expect(slots[2]?.char).toBe(null);
    });

    test('marks active slot correctly', () => {
      const { result } = renderHook(() =>
        useInput({ maxLength: 4, defaultValue: '12' })
      );

      act(() => {
        result.current.handlers.onFocus();
      });

      const activeSlot = result.current.contextValue.slots[2];
      expect(activeSlot?.isActive).toBe(true);
      expect(activeSlot?.hasFakeCaret).toBe(true);
    });
  });
});
