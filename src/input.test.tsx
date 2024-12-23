import { View, Text, Platform } from 'react-native';
import {
  cleanup,
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';

import { OTPInput } from './input';
import type {
  InputOTPRenderFn,
  OTPInputProps,
  RenderProps,
  SlotProps,
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
      expect(input.props.maxLength).toBe(6);
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
      expect(input.props.maxLength).toBe(4);
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
      fireEvent.changeText(input, '123456');

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
      fireEvent.changeText(input, '12345');
      expect(onChangeMock).toHaveBeenCalledWith('12345');
      expect(onCompleteMock).not.toHaveBeenCalled();

      fireEvent.changeText(input, '123456');
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
      fireEvent.changeText(input, '123');

      const container = await screen.findByTestId('otp-input-container');
      fireEvent.press(container);

      expect(input.props.value).toBe('');
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
      fireEvent.changeText(input, 'abc');
      expect(onChangeMock).not.toHaveBeenCalled();
      expect(input.props.value).toBe('');

      // Test valid input
      fireEvent.changeText(input, '123');
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
      fireEvent.changeText(input, '123456');

      expect(input.props.value.length).toBeLessThanOrEqual(4);
    });
  });
});
