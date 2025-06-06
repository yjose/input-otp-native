import * as React from 'react';
import { TextInput, StyleSheet, Pressable, Platform } from 'react-native';

import type { OTPInputProps, OTPInputRef } from './types';
import { useInput } from './use-input';

/**
 * Default paste transformer that removes all non-numeric characters.
 */
const defaultPasteTransformer = (maxLength: number) => (pasted: string) => {
  // match exactly maxLength digits, not preceded or followed by another digit
  const otpRegex = new RegExp(`(?<!\\d)(\\d{${maxLength}})(?!\\d)`);
  const match = pasted.match(otpRegex);

  return match?.[1] ?? '';
};

export const OTPInput = React.forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      style,
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
      pasteTransformer:
        props.pasteTransformer ?? defaultPasteTransformer(maxLength),
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
          style={[styles.input, style]}
          value={value}
          onChangeText={handlers.onChangeText}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          /**
           * On iOS if the input has an opacity of 0, we can't paste text into it.
           * As we're setting the opacity to 0.02, we need to hide the caret.
           */
          caretHidden={Platform.OS === 'ios'}
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
    /**
     * On iOS if the input has an opacity of 0, we can't paste text into it.
     * This is a workaround to allow pasting text into the input.
     */
    ...Platform.select({
      ios: {
        opacity: 0.02,
        color: 'transparent',
      },
      android: {
        opacity: 0,
      },
    }),
  },
});
