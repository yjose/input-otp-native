import * as React from 'react';
import { TextInput, StyleSheet, Pressable, Platform } from 'react-native';

import type { OTPInputProps, RenderProps } from './types';
import { usePrevious } from './use-previous';

export const OTPInputContext = React.createContext<RenderProps>(
  {} as RenderProps
);

export const OTPInput = React.forwardRef<TextInput, OTPInputProps>(
  (
    {
      value: uncheckedValue,
      onChange: uncheckedOnChange,
      maxLength,
      pattern,
      placeholder,
      inputMode = 'numeric',
      containerStyle,
      onComplete,
      render,
      children,
      ...props
    }
    // ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      typeof props.defaultValue === 'string' ? props.defaultValue : ''
    );

    const value = uncheckedValue ?? internalValue;
    const previousValue = usePrevious(value);
    const onChange = React.useCallback(
      (newValue: string) => {
        uncheckedOnChange?.(newValue);
        setInternalValue(newValue);
      },
      [uncheckedOnChange]
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
    const initialLoadRef = React.useRef({
      value,
      onChange,
    });

    // React.useImperativeHandle(ref, () => inputRef.current, []);

    React.useEffect(() => {
      if (initialLoadRef.current.value !== value) {
        initialLoadRef.current.onChange(value);
      }
    }, [value]);

    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (previousValue === undefined) {
        return;
      }

      if (
        value !== previousValue &&
        previousValue.length < maxLength &&
        value.length === maxLength
      ) {
        onComplete?.(value);
      }
    }, [maxLength, onComplete, previousValue, value]);

    const _changeListener = React.useCallback(
      (text: string) => {
        const newValue = text.slice(0, maxLength);
        if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
          return;
        }
        onChange(newValue);
      },
      [maxLength, onChange, regexp]
    );

    const _focusListener = React.useCallback(() => {
      setIsFocused(true);
    }, []);

    const _blurListener = React.useCallback(() => {
      setIsFocused(false);
    }, []);

    const contextValue = React.useMemo<RenderProps>(() => {
      return {
        slots: Array.from({ length: maxLength }).map((_, slotIdx) => {
          const isActive = isFocused;
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

    const renderedChildren = React.useMemo(() => {
      if (render) {
        return render(contextValue);
      }
      return (
        <OTPInputContext.Provider value={contextValue}>
          {children}
        </OTPInputContext.Provider>
      );
    }, [children, contextValue, render]);

    return (
      <Pressable
        style={[styles.container, containerStyle]}
        onPress={() => {
          inputRef.current?.clear();
          inputRef.current?.focus();
        }}
      >
        {renderedChildren}
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={maxLength}
          value={value}
          onChangeText={_changeListener}
          onFocus={_focusListener}
          onBlur={_blurListener}
          placeholder={placeholder}
          caretHidden={true}
          autoFocus={true}
          inputMode={inputMode}
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          clearTextOnFocus
          //   pointerEvents="none"
          {...props}
        />
      </Pressable>
    );
  }
);
OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    backgroundColor: 'red',
  },
});
