import { StyleSheet, Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { OTPInput } from './input';

// Newer native releases no longer export absoluteFillObject. The Jest
// preset for this repository's older React Native still provides it.
jest.mock('react-native', () => {
  const native = jest.requireActual('react-native');
  Object.defineProperty(native.StyleSheet, 'absoluteFillObject', {
    configurable: true,
    value: undefined,
  });
  return native;
});

describe('OTPInput layout without absoluteFillObject', () => {
  test('keeps the hidden input over the slots and accepts a complete code', () => {
    const onComplete = jest.fn();
    const { getByTestId, getByText } = render(
      <OTPInput
        maxLength={4}
        onComplete={onComplete}
        render={({ slots }) => (
          <View>
            {slots.map((slot, index) => (
              <Text key={index}>{slot.char}</Text>
            ))}
          </View>
        )}
      />
    );
    const input = getByTestId('otp-input');

    expect(StyleSheet.flatten(input.props.style)).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.02,
      color: 'transparent',
    });
    expect(input.props.caretHidden).toBe(true);
    fireEvent.changeText(input, '1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
    expect(getByText('4')).toBeTruthy();
  });

  test('preserves caller style precedence', () => {
    const { getByTestId } = render(
      <OTPInput maxLength={4} style={{ top: 8, opacity: 0.1 }} />
    );

    expect(
      StyleSheet.flatten(getByTestId('otp-input').props.style)
    ).toMatchObject({
      top: 8,
      opacity: 0.1,
    });
  });
});
