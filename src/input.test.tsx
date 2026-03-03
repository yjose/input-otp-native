import { View, Text, Platform, TextInput } from 'react-native';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react-native';

import { OTPInput } from './input';
import type {
  InputOTPRenderFn,
  OTPInputProps,
  RenderProps,
  SlotProps,
  OTPInputRef,
} from './types';

afterEach(cleanup);
afterEach(() => {
  // Reset Platform.OS mock after each test
  Platform.OS = 'ios';
});

const onChangeMock: OTPInputProps['onChange'] = jest.fn();
const onCompleteMock: OTPInputProps['onComplete'] = jest.fn();

const defaultRender: InputOTPRenderFn = (props: RenderProps) => (
  <View testID="otp-cells" data-focused={props.isFocused}>
    {props.slots.map((slot: SlotProps, index: number) => (
      <View
        key={index}
        testID={`otp-cell-${index}`}
        style={{ opacity: props.isFocused ? 1 : 0.5 }}
      >
        {slot.char && <Text>{slot.char}</Text>}
      </View>
    ))}
  </View>
);

/**
 * Simulate typing on the input like a user would do by typing one character at a time.
 *
 * @param input - The input element to simulate typing on.
 * @param text - The text to simulate typing.
 */
const simulateTyping = (input: TextInput, text: string) => {
  let accumulated = '';

  for (const char of text) {
    accumulated += char;
    fireEvent.changeText(input, accumulated);
    fireEvent(input, 'keyPress', { nativeEvent: { key: char } });
  }
};

// Mock Platform.OS
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(),
}));

describe('OTPInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders correctly with default props', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      expect(input).toBeTruthy();
      expect(input.props.inputMode).toBe('numeric');
      expect(input.props.autoComplete).toBe('one-time-code');
    });

    test('sets correct autoComplete value for Android', async () => {
      Platform.OS = 'android';

      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      expect(input.props.autoComplete).toBe('sms-otp');
    });

    test('sets correct autoComplete value for iOS', async () => {
      Platform.OS = 'ios';

      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      expect(input.props.autoComplete).toBe('one-time-code');
    });

    test('renders correctly without render prop', async () => {
      render(<OTPInput onChange={onChangeMock} maxLength={6} />);

      const input = await screen.findByTestId('otp-input');
      expect(input).toBeTruthy();

      // The container should still be rendered
      const container = await screen.findByTestId('otp-input-container');
      expect(container).toBeTruthy();

      // Container should have exactly two children:
      // 1. null from the render prop (React still counts this)
      // 2. The TextInput component
      const customContent = container.children.length;
      expect(customContent).toBe(2);
    });

    test('renders with custom props', async () => {
      const placeholder = '******';
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={4}
          placeholder={placeholder}
          inputMode="text"
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      expect(input.props.placeholder).toBe(placeholder);
      expect(input.props.inputMode).toBe('text');
    });

    test('renders custom content using render prop', async () => {
      const customRender: InputOTPRenderFn = (props: RenderProps) => (
        <View testID="custom-content">
          {props.slots.map((slot, index) => (
            <Text key={index}>{slot.char || slot.placeholderChar}</Text>
          ))}
        </View>
      );

      render(
        <OTPInput onChange={onChangeMock} maxLength={4} render={customRender} />
      );

      expect(await screen.findByTestId('custom-content')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    test('handles text input correctly', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          onComplete={onCompleteMock}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      simulateTyping(input, '123456');

      expect(onChangeMock).toHaveBeenCalledWith('123456');
      expect(onCompleteMock).toHaveBeenCalledWith('123456');
    });

    test('onComplete is called when maxLength is reached only', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          onComplete={onCompleteMock}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      simulateTyping(input, '12345');
      expect(onChangeMock).toHaveBeenCalledWith('12345');
      expect(onCompleteMock).not.toHaveBeenCalled();

      simulateTyping(input, '123456');
      expect(onChangeMock).toHaveBeenCalledWith('123456');
      expect(onCompleteMock).toHaveBeenCalledWith('123456');
    });

    test('clears input on container press', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      simulateTyping(input, '123');

      const container = await screen.findByTestId('otp-input-container');
      fireEvent.press(container);

      expect(input.props.value).toBe('');
    });

    test('cursor is always locked to the end of the value', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );
      const input = await screen.findByTestId('otp-input');

      simulateTyping(input, '12');

      // selection prop should always be at end
      expect(input.props.selection).toEqual({ start: 2, end: 2 });
    });

    test('cursor resets to end when onSelectionChange fires with wrong position', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );
      const input = await screen.findByTestId('otp-input');

      simulateTyping(input, '12');

      // Simulate cursor moved to position 0 by arrow key
      fireEvent(input, 'selectionChange', {
        nativeEvent: { selection: { start: 0, end: 0 } },
      });

      // After the state reset re-render, selection prop is back at end
      expect(input.props.selection).toEqual({ start: 2, end: 2 });
    });

    test('handles focus and blur events', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      const cells = await screen.findByTestId('otp-cells');

      fireEvent(input, 'focus');
      expect(cells.props['data-focused']).toBe(true);

      fireEvent(input, 'blur');
      expect(cells.props['data-focused']).toBe(false);
    });
  });

  describe('Validation', () => {
    test('respects pattern prop for input validation', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={6}
          pattern="^[0-9]+$"
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');

      // Test invalid input
      simulateTyping(input, 'abc');
      expect(onChangeMock).toHaveBeenCalledTimes(2);
      expect(onChangeMock).toHaveBeenCalledWith('');
      expect(input.props.value).toBe('');

      // Test valid input
      simulateTyping(input, '123');
      expect(onChangeMock).toHaveBeenCalledWith('123');
      expect(input.props.value).toBe('123');
    });

    test('respects maxLength prop', async () => {
      render(
        <OTPInput
          onChange={onChangeMock}
          maxLength={4}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      simulateTyping(input, '123456');

      expect(input.props.value.length).toBeLessThanOrEqual(4);
    });
  });

  describe('Ref Methods', () => {
    test('setValue updates input value through ref', async () => {
      const ref = React.createRef<OTPInputRef>();
      render(
        <OTPInput
          ref={ref}
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      await act(async () => {
        ref.current?.setValue('1');
      });

      expect(input.props.value).toBe('1');
      expect(onChangeMock).toHaveBeenCalledWith('1');
    });

    test('focus method focuses the input through ref', async () => {
      const ref = React.createRef<OTPInputRef>();
      render(
        <OTPInput
          ref={ref}
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const cells = await screen.findByTestId('otp-cells');
      const input = await screen.findByTestId('otp-input');

      await act(async () => {
        ref.current?.focus();
        // we need to call onFocus by fireEvent because test environment do not support onFocus
        // see the issue https://github.com/callstack/react-native-testing-library/issues/1069
        fireEvent(input, 'focus');
      });

      expect(cells.props['data-focused']).toBe(true);
    });

    test('blur method blurs the input through ref', async () => {
      const ref = React.createRef<OTPInputRef>();
      render(
        <OTPInput
          ref={ref}
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');
      const cells = await screen.findByTestId('otp-cells');

      // First focus
      await act(async () => {
        ref.current?.focus();
        // we need to call onFocus by fireEvent because test environment do not support onFocus
        // see the issue https://github.com/callstack/react-native-testing-library/issues/1069
        fireEvent(input, 'focus');
      });
      expect(cells.props['data-focused']).toBe(true);

      // Then blur
      await act(async () => {
        ref.current?.blur();
        // we need to call onBlur by fireEvent because test environment do not support onBlur
        // see the issue https://github.com/callstack/react-native-testing-library/issues/1069
        fireEvent(input, 'blur');
      });
      expect(cells.props['data-focused']).toBe(false);
    });

    describe('focusSlot', () => {
      test('truncates value to the given index and focuses', async () => {
        const ref = React.createRef<OTPInputRef>();
        render(
          <OTPInput
            ref={ref}
            onChange={onChangeMock}
            maxLength={6}
            render={defaultRender}
          />
        );

        const input = await screen.findByTestId('otp-input');
        simulateTyping(input, '123456');

        await act(async () => {
          ref.current?.focusSlot(3);
        });

        expect(input.props.value).toBe('123');
        expect(onChangeMock).toHaveBeenCalledWith('123');
      });

      test('focusSlot(0) clears all slots', async () => {
        const ref = React.createRef<OTPInputRef>();
        render(
          <OTPInput
            ref={ref}
            onChange={onChangeMock}
            maxLength={6}
            render={defaultRender}
          />
        );

        const input = await screen.findByTestId('otp-input');
        simulateTyping(input, '123456');

        await act(async () => {
          ref.current?.focusSlot(0);
        });

        expect(input.props.value).toBe('');
        expect(onChangeMock).toHaveBeenCalledWith('');
      });

      test('focusSlot beyond maxLength leaves value unchanged', async () => {
        const ref = React.createRef<OTPInputRef>();
        render(
          <OTPInput
            ref={ref}
            onChange={onChangeMock}
            maxLength={6}
            render={defaultRender}
          />
        );

        const input = await screen.findByTestId('otp-input');
        simulateTyping(input, '123456');

        await act(async () => {
          ref.current?.focusSlot(10);
        });

        expect(input.props.value).toBe('123456');
      });

      test('focusSlot focuses the input', async () => {
        const ref = React.createRef<OTPInputRef>();
        render(
          <OTPInput
            ref={ref}
            onChange={onChangeMock}
            maxLength={6}
            render={defaultRender}
          />
        );

        const cells = await screen.findByTestId('otp-cells');

        await act(async () => {
          ref.current?.focusSlot(2);
        });

        expect(cells.props['data-focused']).toBe(true);
      });
    });

    test('clear method clears the input through ref', async () => {
      const ref = React.createRef<OTPInputRef>();
      render(
        <OTPInput
          ref={ref}
          onChange={onChangeMock}
          maxLength={6}
          render={defaultRender}
        />
      );

      const input = await screen.findByTestId('otp-input');

      // First set a value
      await act(async () => {
        ref.current?.setValue('1');
      });
      expect(input.props.value).toBe('1');

      // Then clear it
      await act(async () => {
        ref.current?.clear();
      });
      expect(input.props.value).toBe('');
    });
  });
});
