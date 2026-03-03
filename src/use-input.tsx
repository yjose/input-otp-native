import * as React from 'react';
import {
  TextInput,
  type NativeSyntheticEvent,
  type TextInputSelectionChangeEventData,
} from 'react-native';
import type { OTPInputProps, RenderProps } from './types';

export function useInput({
  onChange: _onChange,
  maxLength,
  pattern,
  placeholder,
  defaultValue,
  onComplete,
  pasteTransformer,
}: Pick<
  OTPInputProps,
  | 'onChange'
  | 'maxLength'
  | 'pattern'
  | 'placeholder'
  | 'defaultValue'
  | 'onComplete'
  | 'pasteTransformer'
>) {
  const [value, setValue] = React.useState(
    typeof defaultValue === 'string' ? defaultValue : ''
  );

  const regexp = React.useMemo(
    () =>
      pattern
        ? typeof pattern === 'string'
          ? new RegExp(pattern)
          : pattern
        : null,
    [pattern]
  );

  const inputRef = React.useRef<TextInput>(null);

  const [isFocused, setIsFocused] = React.useState(false);

  const [, setSelectionResetTick] = React.useState(0);

  const onChangeText = React.useCallback(
    (text: string) => {
      // Detect paste operation: if text length increases by more than 1 character
      // it's likely a paste operation rather than normal typing
      const isPaste = text.length > value.length + 1;
      const transformedText =
        isPaste && pasteTransformer ? pasteTransformer(text) : text;
      // Slice the text to the maxLength as we're not limiting the input length to handle paste properly
      const newValue = transformedText.slice(0, maxLength);

      if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
        return;
      }
      setValue(newValue);
      _onChange?.(newValue);
      if (newValue.length === maxLength) {
        onComplete?.(newValue);
      }
    },
    [maxLength, regexp, _onChange, onComplete, pasteTransformer, value.length]
  );

  const onFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const onBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  const onSelectionChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const { start, end } = e.nativeEvent.selection;
      if (start !== value.length || end !== value.length) {
        // Cursor moved away from end — force re-render to snap it back
        setSelectionResetTick((n) => n + 1);
      }
    },
    [value.length]
  );

  const clear = React.useCallback(() => {
    inputRef.current?.clear();
    setValue('');
  }, []);

  const focus = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const focusSlot = React.useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, maxLength));
      const newValue = value.substring(0, clampedIndex);
      setValue(newValue);
      _onChange?.(newValue);
      inputRef.current?.focus();
    },
    [value, maxLength, _onChange]
  );

  const contextValue = React.useMemo<RenderProps>(() => {
    return {
      slots: Array.from({ length: maxLength }).map((_, slotIdx) => {
        const isActive = isFocused && slotIdx === value.length;
        const char = value[slotIdx] !== undefined ? value[slotIdx] : null;
        const placeholderChar =
          value[0] !== undefined ? null : (placeholder?.[slotIdx] ?? null);

        return {
          char,
          placeholderChar,
          isActive,
          hasFakeCaret: isActive && char === null,
        };
      }),
      isFocused,
    };
  }, [isFocused, maxLength, value, placeholder]);

  return {
    inputRef,
    contextValue,
    value,
    isFocused,
    handlers: {
      onChangeText,
      onFocus,
      onBlur,
      onSelectionChange,
    },
    actions: {
      clear,
      focus,
      focusSlot,
    },
  };
}
