import * as React from 'react';
import { TextInput, StyleSheet, Pressable, Platform } from 'react-native';

import type { OTPInputProps, OTPInputRef } from './types';
import { useInput } from './use-input';

export const OTPInput = React.forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      onChange,
      maxLength,
      pattern,
      placeholder,
      inputMode = 'numeric',
      containerStyle,
      onComplete,
      render,
      ...props
    },
    ref
  ) => {
    const { inputRef, contextValue, value, handlers, actions } = useInput({
      onChange,
      maxLength,
      pattern,
      placeholder,
      defaultValue: props.defaultValue,
      onComplete,
    });

    React.useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        handlers.onChangeText(newValue);
      },
      focus: () => {
        actions.focus();
        // for test only we need to call onFocus
        handlers.onFocus();
      },
      blur: () => inputRef.current?.blur(),
      clear: actions.clear,
    }));

    const renderedChildren = React.useMemo(() => {
      if (render) {
        return render(contextValue);
      }
      return null;
    }, [contextValue, render]);

    const onPress = React.useCallback(() => {
      actions.focus();
      actions.clear();
    }, [actions]);

    return (
      <Pressable
        testID="otp-input-container"
        style={[styles.container, containerStyle]}
        onPress={onPress}
      >
        {renderedChildren}
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={maxLength}
          value={value}
          onChangeText={handlers.onChangeText}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          clearTextOnFocus
          accessible
          accessibilityRole="text"
          testID="otp-input"
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
